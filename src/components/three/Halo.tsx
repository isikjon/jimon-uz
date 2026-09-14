"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { sceneState } from "@/lib/scene-state";
import { lerp } from "@/lib/utils";

function makeGlowTexture() {
  const size = 256;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(228,200,118,0.32)");
  g.addColorStop(0.18, "rgba(99,199,155,0.22)");
  g.addColorStop(0.5, "rgba(30,92,70,0.12)");
  g.addColorStop(1, "rgba(7,9,7,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Soft ambient glow + a thin gold ring that appears for the "seed" and "core" states. */
export function Halo() {
  const tex = useMemo(() => makeGlowTexture(), []);
  const glow = useRef<THREE.Sprite>(null);
  const ring = useRef<THREE.Mesh>(null);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null);
  const glowMat = useRef<THREE.SpriteMaterial>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);
    const shape = sceneState.mix > 0.5 ? sceneState.to : sceneState.from;
    const ringTarget = (shape === 0 || shape === 5 ? 0.75 : 0.0) * sceneState.opacity;
    const glowTarget = (shape === 0 || shape === 5 ? 1 : 0.45) * sceneState.opacity;
    if (ringMat.current) ringMat.current.opacity = lerp(ringMat.current.opacity, ringTarget, dt * 2);
    if (glowMat.current) glowMat.current.opacity = lerp(glowMat.current.opacity, glowTarget, dt * 2);
    if (ring.current) {
      ring.current.rotation.z = t * 0.12;
      ring.current.rotation.x = Math.PI / 2 - 0.55 + Math.sin(t * 0.3) * 0.08;
      const s = 1 + Math.sin(t * 0.8) * 0.02;
      ring.current.scale.setScalar(s);
    }
    if (glow.current) {
      const s = 7.5 + Math.sin(t * 0.7) * 0.35;
      glow.current.scale.set(s, s, 1);
    }
  });

  return (
    <>
      <sprite ref={glow} position={[0, 0, -1.5]}>
        <spriteMaterial ref={glowMat} map={tex} transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0} />
      </sprite>
      <mesh ref={ring} rotation={[Math.PI / 2 - 0.55, 0, 0]}>
        <torusGeometry args={[1.75, 0.008, 8, 160]} />
        <meshBasicMaterial ref={ringMat} color="#e4c876" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </>
  );
}
