/**
 * Procedural point-cloud targets for the morphing particle field.
 * Each generator fills a Float32Array(count*3). Shapes share the same index space,
 * so particle i travels from shape A[i] to shape B[i] during a morph.
 */

const rnd = (seed: { v: number }) => {
  // deterministic LCG so SSR/CSR and re-mounts produce stable clouds
  seed.v = (seed.v * 1664525 + 1013904223) % 4294967296;
  return seed.v / 4294967296;
};

export type ShapeName = "seed" | "plant" | "elements" | "molecule" | "product" | "core";

export function makeSeed(count: number, seed = { v: 7 }) {
  const a = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // superellipsoid seed: elongated along y, slight teardrop
    const u = rnd(seed) * Math.PI * 2;
    const v = Math.acos(2 * rnd(seed) - 1);
    const r = 1.05 + (rnd(seed) - 0.5) * 0.06;
    const shell = rnd(seed) < 0.8 ? 1 : 0.55 + rnd(seed) * 0.4; // some inner particles
    const x = r * Math.sin(v) * Math.cos(u) * 0.8;
    let y = r * Math.cos(v) * 1.25;
    const z = r * Math.sin(v) * Math.sin(u) * 0.8;
    const taper = 1 - 0.25 * Math.max(0, y / 1.25); // narrower on top
    y += 0.08 * Math.sin(u * 3);
    a[i * 3] = x * taper * shell;
    a[i * 3 + 1] = y * shell;
    a[i * 3 + 2] = z * taper * shell;
  }
  return a;
}

/** Ginseng-like root with branching + a small canopy of leaves. */
export function makePlant(count: number, seed = { v: 13 }) {
  const a = new Float32Array(count * 3);
  const nBranches = 9;
  const branches: Array<{ p0: number[]; p1: number[]; p2: number[]; p3: number[]; r: number }> = [];
  // main taproot
  branches.push({ p0: [0, 0.9, 0], p1: [0.05, 0.2, 0.05], p2: [-0.05, -0.6, 0], p3: [0.02, -1.55, 0.02], r: 0.22 });
  for (let b = 0; b < nBranches; b++) {
    const t = 0.15 + rnd(seed) * 0.6;
    const ang = rnd(seed) * Math.PI * 2;
    const len = 0.5 + rnd(seed) * 0.9;
    const y0 = 0.7 - t * 2.1;
    const p0 = [0, y0, 0];
    const dir = [Math.cos(ang), -0.7 - rnd(seed) * 0.5, Math.sin(ang)];
    const p3 = [p0[0] + dir[0] * len, p0[1] + dir[1] * len, p0[2] + dir[2] * len];
    const p1 = [p0[0] + dir[0] * len * 0.3, p0[1] + dir[1] * len * 0.2, p0[2] + dir[2] * len * 0.3];
    const p2 = [p3[0] * 0.8 + (rnd(seed) - 0.5) * 0.3, p3[1] * 0.7, p3[2] * 0.8 + (rnd(seed) - 0.5) * 0.3];
    branches.push({ p0, p1, p2, p3, r: 0.05 + rnd(seed) * 0.05 });
  }
  const bez = (p0: number[], p1: number[], p2: number[], p3: number[], t: number, k: number) => {
    const mt = 1 - t;
    return mt * mt * mt * p0[k] + 3 * mt * mt * t * p1[k] + 3 * mt * t * t * p2[k] + t * t * t * p3[k];
  };
  const leafCount = Math.floor(count * 0.3);
  for (let i = 0; i < count; i++) {
    if (i < leafCount) {
      // canopy: 5 leaves fanning out at the top
      const leaf = i % 5;
      const base = (leaf / 5) * Math.PI * 2;
      const u = rnd(seed);
      const w = (rnd(seed) - 0.5) * 2;
      const len = 0.95;
      const width = Math.sin(u * Math.PI) * 0.26;
      const lx = Math.cos(base) * (0.15 + u * len);
      const lz = Math.sin(base) * (0.15 + u * len);
      const perpX = -Math.sin(base) * w * width;
      const perpZ = Math.cos(base) * w * width;
      a[i * 3] = lx + perpX;
      a[i * 3 + 1] = 1.05 + u * 0.55 - Math.abs(w) * 0.05 + Math.sin(u * Math.PI) * 0.1;
      a[i * 3 + 2] = lz + perpZ;
    } else {
      const br = branches[Math.floor(rnd(seed) * branches.length)];
      const t = rnd(seed);
      const rad = br.r * (1 - t * 0.85) * Math.sqrt(rnd(seed));
      const ang = rnd(seed) * Math.PI * 2;
      a[i * 3] = bez(br.p0, br.p1, br.p2, br.p3, t, 0) + Math.cos(ang) * rad;
      a[i * 3 + 1] = bez(br.p0, br.p1, br.p2, br.p3, t, 1);
      a[i * 3 + 2] = bez(br.p0, br.p1, br.p2, br.p3, t, 2) + Math.sin(ang) * rad;
    }
  }
  return a;
}

/** Five orbiting clusters (Wu Xing) arranged as a pentagon with linking arcs. */
export function makeElements(count: number, seed = { v: 29 }) {
  const a = new Float32Array(count * 3);
  const R = 1.55;
  const centers = Array.from({ length: 5 }, (_, k) => {
    const ang = -Math.PI / 2 + (k / 5) * Math.PI * 2;
    return [Math.cos(ang) * R, Math.sin(ang) * R * 0.85, 0];
  });
  const arcCount = Math.floor(count * 0.28);
  for (let i = 0; i < count; i++) {
    if (i < arcCount) {
      // generating cycle ring (outer) + controlling pentagram (inner)
      const t = rnd(seed) * Math.PI * 2;
      const star = rnd(seed) < 0.4;
      if (!star) {
        a[i * 3] = Math.cos(t) * R * (1 + (rnd(seed) - 0.5) * 0.04);
        a[i * 3 + 1] = Math.sin(t) * R * 0.85;
        a[i * 3 + 2] = (rnd(seed) - 0.5) * 0.15;
      } else {
        const k = Math.floor(rnd(seed) * 5);
        const p = centers[k],
          q = centers[(k + 2) % 5];
        const u = rnd(seed);
        a[i * 3] = p[0] + (q[0] - p[0]) * u;
        a[i * 3 + 1] = p[1] + (q[1] - p[1]) * u;
        a[i * 3 + 2] = (rnd(seed) - 0.5) * 0.1;
      }
    } else {
      const k = i % 5;
      const c = centers[k];
      // small sphere cluster per element
      const u = rnd(seed) * Math.PI * 2;
      const v = Math.acos(2 * rnd(seed) - 1);
      const r = 0.42 * Math.cbrt(rnd(seed));
      a[i * 3] = c[0] + r * Math.sin(v) * Math.cos(u);
      a[i * 3 + 1] = c[1] + r * Math.sin(v) * Math.sin(u);
      a[i * 3 + 2] = c[2] + r * Math.cos(v);
    }
  }
  return a;
}

/** Hexagonal lattice "molecule" with nodes and bonds in 3D. */
export function makeMolecule(count: number, seed = { v: 41 }) {
  const a = new Float32Array(count * 3);
  const nodes: number[][] = [];
  // three stacked hexagonal rings + a few satellites
  for (let ring = 0; ring < 3; ring++) {
    const y = (ring - 1) * 0.75;
    const rot = ring * 0.35;
    for (let k = 0; k < 6; k++) {
      const ang = rot + (k / 6) * Math.PI * 2;
      nodes.push([Math.cos(ang) * 1.05, y + Math.sin(ang * 2) * 0.12, Math.sin(ang) * 1.05]);
    }
  }
  for (let s = 0; s < 8; s++) {
    const ang = rnd(seed) * Math.PI * 2;
    nodes.push([Math.cos(ang) * 1.8, (rnd(seed) - 0.5) * 1.8, Math.sin(ang) * 1.8]);
  }
  const bonds: number[][] = [];
  for (let ring = 0; ring < 3; ring++)
    for (let k = 0; k < 6; k++) {
      bonds.push([ring * 6 + k, ring * 6 + ((k + 1) % 6)]);
      if (ring < 2) bonds.push([ring * 6 + k, (ring + 1) * 6 + k]);
    }
  for (let s = 0; s < 8; s++) bonds.push([18 + s, Math.floor(rnd(seed) * 18)]);

  const nodeShare = Math.floor(count * 0.45);
  for (let i = 0; i < count; i++) {
    if (i < nodeShare) {
      const n = nodes[i % nodes.length];
      const u = rnd(seed) * Math.PI * 2;
      const v = Math.acos(2 * rnd(seed) - 1);
      const r = 0.16 * Math.cbrt(rnd(seed));
      a[i * 3] = n[0] + r * Math.sin(v) * Math.cos(u);
      a[i * 3 + 1] = n[1] + r * Math.sin(v) * Math.sin(u);
      a[i * 3 + 2] = n[2] + r * Math.cos(v);
    } else {
      const b = bonds[Math.floor(rnd(seed) * bonds.length)];
      const p = nodes[b[0]],
        q = nodes[b[1]];
      const t = rnd(seed);
      const jitter = 0.02;
      a[i * 3] = p[0] + (q[0] - p[0]) * t + (rnd(seed) - 0.5) * jitter;
      a[i * 3 + 1] = p[1] + (q[1] - p[1]) * t + (rnd(seed) - 0.5) * jitter;
      a[i * 3 + 2] = p[2] + (q[2] - p[2]) * t + (rnd(seed) - 0.5) * jitter;
    }
  }
  return a;
}

/** Product: a rounded box (package) with a capsule/bottle floating in front. */
export function makeProduct(count: number, seed = { v: 53 }) {
  const a = new Float32Array(count * 3);
  const boxShare = Math.floor(count * 0.62);
  const bw = 1.15,
    bh = 1.5,
    bd = 0.42;
  for (let i = 0; i < count; i++) {
    if (i < boxShare) {
      // points on box surface (pick a face weighted by area)
      const faces = [bw * bh, bw * bh, bh * bd, bh * bd, bw * bd, bw * bd];
      const total = faces.reduce((s, f) => s + f, 0);
      let r = rnd(seed) * total,
        f = 0;
      while (r > faces[f]) {
        r -= faces[f];
        f++;
      }
      const u = rnd(seed) - 0.5,
        v = rnd(seed) - 0.5;
      let x = 0,
        y = 0,
        z = 0;
      if (f === 0) [x, y, z] = [u * bw, v * bh, bd / 2];
      else if (f === 1) [x, y, z] = [u * bw, v * bh, -bd / 2];
      else if (f === 2) [x, y, z] = [bw / 2, v * bh, u * bd];
      else if (f === 3) [x, y, z] = [-bw / 2, v * bh, u * bd];
      else if (f === 4) [x, y, z] = [u * bw, bh / 2, v * bd];
      else [x, y, z] = [u * bw, -bh / 2, v * bd];
      // edge emphasis: push some points toward edges for crisp silhouette
      if (rnd(seed) < 0.25) {
        x = Math.sign(x || 1) * (bw / 2) * (Math.abs(x) > bw * 0.3 ? 1 : Math.abs(x) / (bw / 2));
      }
      a[i * 3] = x - 0.35;
      a[i * 3 + 1] = y;
      a[i * 3 + 2] = z - 0.2;
    } else {
      // bottle: cylinder + cap, in front-right
      const t = rnd(seed);
      const ang = rnd(seed) * Math.PI * 2;
      const cap = t > 0.82;
      const rad = cap ? 0.2 : 0.27;
      const y = -0.75 + t * 1.25;
      const inner = rnd(seed) < 0.12 ? Math.sqrt(rnd(seed)) : 1;
      a[i * 3] = 0.72 + Math.cos(ang) * rad * inner;
      a[i * 3 + 1] = y;
      a[i * 3 + 2] = 0.55 + Math.sin(ang) * rad * inner;
    }
  }
  return a;
}

/** Final: a dense glowing core with a gold ring (assembled). */
export function makeCore(count: number, seed = { v: 67 }) {
  const a = new Float32Array(count * 3);
  const ringShare = Math.floor(count * 0.22);
  for (let i = 0; i < count; i++) {
    if (i < ringShare) {
      const t = rnd(seed) * Math.PI * 2;
      const R = 1.7 + (rnd(seed) - 0.5) * 0.05;
      const tilt = 0.55;
      const x = Math.cos(t) * R;
      const y0 = Math.sin(t) * R;
      a[i * 3] = x;
      a[i * 3 + 1] = y0 * Math.cos(tilt) * 0.35;
      a[i * 3 + 2] = y0 * Math.sin(tilt);
    } else {
      const u = rnd(seed) * Math.PI * 2;
      const v = Math.acos(2 * rnd(seed) - 1);
      const r = 0.95 * Math.pow(rnd(seed), 0.35);
      a[i * 3] = r * Math.sin(v) * Math.cos(u);
      a[i * 3 + 1] = r * Math.sin(v) * Math.sin(u);
      a[i * 3 + 2] = r * Math.cos(v);
    }
  }
  return a;
}

export function buildShapes(count: number) {
  return [makeSeed(count), makePlant(count), makeElements(count), makeMolecule(count), makeProduct(count), makeCore(count)];
}
