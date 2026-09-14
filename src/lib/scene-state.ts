/**
 * Tiny shared store between scroll-driven sections and the WebGL scene.
 * Sections write; the render loop reads every frame. No React re-renders involved.
 */
export type ShapeIndex = 0 | 1 | 2 | 3 | 4 | 5;

export const sceneState = {
  /** current shape index (from) and next shape index (to) with mix in [0,1] */
  from: 0 as ShapeIndex,
  to: 0 as ShapeIndex,
  mix: 0,
  /** overall scene opacity 0..1 */
  opacity: 1,
  /** rotation offset driven by scroll */
  rot: 0,
  /** which element cluster is highlighted (-1 = none) */
  element: -1,
  /** pointer in NDC */
  px: 0,
  py: 0,
  /** page scroll velocity (normalized) */
  velocity: 0,
  /** scene scale multiplier */
  scale: 1,
  /** whether the canvas is on screen */
  visible: true,
};

export function setMorph(from: ShapeIndex, to: ShapeIndex, mix: number) {
  sceneState.from = from;
  sceneState.to = to;
  sceneState.mix = mix;
}
