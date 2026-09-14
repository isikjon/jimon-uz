"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { buildShapes } from "./shapes";
import { fragmentShader, vertexShader } from "./shaders";
import { sceneState } from "@/lib/scene-state";
import { elements } from "@/content/elements";
import { lerp } from "@/lib/utils";

/** Per-shape palettes: [A, B, C] = base, secondary, spark. */
const palettes: [string, string, string][] = [
  ["#1e5c46", "#63c79b", "#e4c876"], // seed
  ["#2f7a5c", "#8fb99a", "#e4c876"], // plant
  ["#3e8c6e", "#c9a24a", "#f3eee2"], // elements
  ["#2f5b8a", "#6fa3d8", "#e4c876"], // molecule
  ["#8f6f2a", "#e4c876", "#63c79b"], // product
  ["#c9a24a", "#3e8c6e", "#f3eee2"], // core
];
const elColors = elements.map((e) => new THREE.Color(e.glow));

export function ParticleField({ count, onReady }: { count: number; onReady?: () => void }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const started = useRef<number | null>(null);
  const ready = useRef(false);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const shapes = buildShapes(count);
    g.setAttribute("position", new THREE.BufferAttribute(shapes[0], 3));
    shapes.forEach((s, i) => g.setAttribute(`aP${i}`, new THREE.BufferAttribute(s, 3)));
    const rand = new Float32Array(count * 4);
    let s = 99;
    for (let i = 0; i < count * 4; i++) {
      s = (s * 1664525 + 1013904223) % 4294967296;
      rand[i] = s / 4294967296;
    }
    g.setAttribute("aRand", new THREE.BufferAttribute(rand, 4));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 12);
    return g;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMix: { value: 0 },
      uFrom: { value: 0 },
      uTo: { value: 0 },
      uSize: { value: 1.55 },
      uDpr: { value: 1 },
      uMouse: { value: new THREE.Vector3(99, 99, 0) },
      uMouseStrength: { value: 0 },
      uScatter: { value: 0.6 },
      uIntro: { value: 0 },
      uElement: { value: -1 },
      uElColor: { value: new THREE.Color("#e4c876") },
      uColA: { value: new THREE.Color(palettes[0][0]) },
      uColB: { value: new THREE.Color(palettes[0][1]) },
      uColC: { value: new THREE.Color(palettes[0][2]) },
      uOpacity: { value: 1 },
    }),
    [],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  const tmpA = useMemo(() => new THREE.Color(), []);
  const tmpB = useMemo(() => new THREE.Color(), []);
  const tmpC = useMemo(() => new THREE.Color(), []);
  const cur = useRef({ mix: 0, opacity: 1, mx: 0, my: 0, el: -1, elMix: 0, scale: 1 });

  useFrame((state, delta) => {
    const m = mat.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    if (started.current === null) started.current = t;
    const dt = Math.min(delta, 0.05);
    const u = m.uniforms;
    u.uTime.value = t;
    u.uDpr.value = Math.min(state.gl.getPixelRatio(), 2);

    // intro assembly (~2.2s)
    const intro = Math.min(1, (t - started.current) / 2.2);
    u.uIntro.value = intro * intro * (3 - 2 * intro);
    if (!ready.current && intro > 0.15) {
      ready.current = true;
      onReady?.();
    }

    // morph smoothing
    const c = cur.current;
    c.mix = lerp(c.mix, sceneState.mix, 1 - Math.pow(0.001, dt));
    u.uFrom.value = sceneState.from;
    u.uTo.value = sceneState.to;
    u.uMix.value = c.mix;

    // palette: interpolate between from/to palettes
    const pa = palettes[sceneState.from],
      pb = palettes[sceneState.to];
    const k = c.mix * c.mix * (3 - 2 * c.mix);
    tmpA.set(pa[0]).lerp(tmpB.set(pb[0]), k);
    (u.uColA.value as THREE.Color).copy(tmpA);
    tmpA.set(pa[1]).lerp(tmpB.set(pb[1]), k);
    (u.uColB.value as THREE.Color).copy(tmpA);
    tmpA.set(pa[2]).lerp(tmpC.set(pb[2]), k);
    (u.uColC.value as THREE.Color).copy(tmpA);

    // opacity
    c.opacity = lerp(c.opacity, sceneState.opacity, 1 - Math.pow(0.002, dt));
    u.uOpacity.value = c.opacity;

    // element highlight
    const el = sceneState.element;
    u.uElement.value = el;
    if (el >= 0) (u.uElColor.value as THREE.Color).copy(elColors[el]);

    // mouse in world units (z=0 plane)
    c.mx = lerp(c.mx, sceneState.px * (viewport.width / 2), 1 - Math.pow(0.001, dt));
    c.my = lerp(c.my, sceneState.py * (viewport.height / 2), 1 - Math.pow(0.001, dt));
    (u.uMouse.value as THREE.Vector3).set(c.mx, c.my, 0);
    u.uMouseStrength.value = lerp(u.uMouseStrength.value, sceneState.px === 0 && sceneState.py === 0 ? 0 : 1, dt * 2);

    // scatter more when scrolling fast
    const v = Math.min(1, Math.abs(sceneState.velocity) / 40);
    u.uScatter.value = lerp(u.uScatter.value, 0.5 + v * 0.8, dt * 3);

    // group transform: slow rotation + scroll rotation + pointer tilt
    const g = group.current;
    if (g) {
      g.rotation.y = t * 0.08 + sceneState.rot;
      g.rotation.x = lerp(g.rotation.x, -sceneState.py * 0.15 + 0.1, dt * 2);
      g.rotation.z = lerp(g.rotation.z, sceneState.px * 0.05, dt * 2);
      c.scale = lerp(c.scale, sceneState.scale, dt * 3);
      g.scale.setScalar(c.scale);
    }
  });

  return (
    <group ref={group}>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={mat}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
