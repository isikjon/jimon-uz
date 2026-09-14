export const vertexShader = /* glsl */ `
  attribute vec3 aP0; attribute vec3 aP1; attribute vec3 aP2;
  attribute vec3 aP3; attribute vec3 aP4; attribute vec3 aP5;
  attribute vec4 aRand;
  uniform float uTime;
  uniform float uMix;
  uniform int uFrom;
  uniform int uTo;
  uniform float uSize;
  uniform float uDpr;
  uniform vec3 uMouse;
  uniform float uMouseStrength;
  uniform float uScatter;
  uniform float uIntro;
  uniform float uElement;
  varying float vAlpha;
  varying float vTone;
  varying float vHalo;
  varying float vGroup;

  vec3 pick(int i) {
    if (i == 0) return aP0; if (i == 1) return aP1; if (i == 2) return aP2;
    if (i == 3) return aP3; if (i == 4) return aP4; return aP5;
  }

  // cheap 3d noise
  vec3 hash3(vec3 p) {
    p = vec3(dot(p, vec3(127.1, 311.7, 74.7)), dot(p, vec3(269.5, 183.3, 246.1)), dot(p, vec3(113.5, 271.9, 124.6)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  void main() {
    vec3 from = pick(uFrom);
    vec3 to = pick(uTo);
    // staggered morph: each particle starts at a slightly different time
    float stagger = aRand.x * 0.35;
    float m = smoothstep(stagger, 1.0, uMix);
    // ease in-out
    m = m * m * (3.0 - 2.0 * m);
    vec3 p = mix(from, to, m);

    // scatter along the way (dissolve & reassemble)
    float burst = sin(m * 3.14159) * (0.55 + aRand.y * 0.9) * uScatter;
    vec3 dir = normalize(hash3(aRand.xyz * 10.0 + 1.0) + vec3(0.0001));
    p += dir * burst;

    // intro assembly: particles fly in from a big sphere
    vec3 far = normalize(hash3(aRand.zyx * 7.0)) * (6.0 + aRand.w * 6.0);
    float intro = smoothstep(aRand.y * 0.4, 1.0, uIntro);
    intro = intro * intro * (3.0 - 2.0 * intro);
    p = mix(far, p, intro);

    // idle breathing / organic drift
    float t = uTime * 0.35;
    vec3 drift = vec3(
      sin(t + aRand.x * 6.28) * 0.5 + sin(t * 1.7 + p.y * 2.0) * 0.5,
      cos(t * 0.9 + aRand.y * 6.28) * 0.5 + sin(t * 1.3 + p.x * 2.0) * 0.5,
      sin(t * 1.1 + aRand.z * 6.28)
    ) * 0.035;
    p += drift;

    // mouse repel (world space, z plane)
    vec3 d = p - uMouse;
    float dist = length(d.xy);
    float rep = smoothstep(1.6, 0.0, dist) * uMouseStrength;
    p += normalize(vec3(d.xy, 0.0) + vec3(0.0001)) * rep * 0.6;

    // element highlight (groups i%5 in the elements shape)
    float group = mod(floor(aRand.w * 5.0), 5.0);
    vGroup = group;
    float hl = (uElement >= 0.0 && abs(uElement - group) < 0.5) ? 1.0 : 0.0;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float size = uSize * (0.6 + aRand.z * 0.9) * (1.0 + hl * 0.8) * pow(uDpr, 0.75);
    gl_PointSize = size * (18.0 / -mv.z);
    gl_Position = projectionMatrix * mv;

    vAlpha = (0.12 + aRand.w * 0.55) * intro;
    vTone = aRand.x;
    vHalo = hl;
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;
  uniform vec3 uColA;
  uniform vec3 uColB;
  uniform vec3 uColC;
  uniform float uOpacity;
  uniform float uElement;
  uniform vec3 uElColor;
  varying float vAlpha;
  varying float vTone;
  varying float vHalo;
  varying float vGroup;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv);
    if (r > 0.5) discard;
    float core = smoothstep(0.5, 0.05, r);
    float glow = smoothstep(0.5, 0.0, r) * 0.55;
    float a = (core * 0.75 + glow * 0.8) * vAlpha * uOpacity;
    vec3 col = mix(uColA, uColB, smoothstep(0.2, 0.8, vTone));
    col = mix(col, uColC, pow(vTone, 6.0)); // rare bright gold sparks
    if (vHalo > 0.5) col = mix(col, uElColor, 0.85);
    else if (uElement >= 0.0) a *= 0.45;
    gl_FragColor = vec4(col, a);
  }
`;
