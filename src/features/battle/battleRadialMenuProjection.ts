import { Object3D, Vector3, type Camera } from 'three'

const RADIAL_MENU_HALF_WIDTH = 112
const RADIAL_MENU_HALF_HEIGHT = 112
const VIEWPORT_MARGIN = 10

export type ScreenRect = {
  left: number
  top: number
  right: number
  bottom: number
}

function clampPosition(
  x: number,
  y: number,
  size: { width: number; height: number },
): [number, number] {
  return [
    Math.min(size.width - RADIAL_MENU_HALF_WIDTH - VIEWPORT_MARGIN, Math.max(RADIAL_MENU_HALF_WIDTH + VIEWPORT_MARGIN, x)),
    Math.min(size.height - RADIAL_MENU_HALF_HEIGHT - VIEWPORT_MARGIN, Math.max(RADIAL_MENU_HALF_HEIGHT + VIEWPORT_MARGIN, y)),
  ]
}

function overlapsReserved(
  x: number,
  y: number,
  rect: ScreenRect,
): boolean {
  return !(
    x + RADIAL_MENU_HALF_WIDTH <= rect.left ||
    x - RADIAL_MENU_HALF_WIDTH >= rect.right ||
    y + RADIAL_MENU_HALF_HEIGHT <= rect.top ||
    y - RADIAL_MENU_HALF_HEIGHT >= rect.bottom
  )
}

export function calculateRadialScreenPosition(
  object: Object3D,
  camera: Camera,
  size: { width: number; height: number },
  projected = new Vector3(),
  reserved: readonly ScreenRect[] = [],
): [number, number] {
  projected.setFromMatrixPosition(object.matrixWorld).project(camera)
  const x = projected.x * size.width / 2 + size.width / 2
  const y = -projected.y * size.height / 2 + size.height / 2
  const initial = clampPosition(x, y, size)
  if (!reserved.some((rect) => overlapsReserved(initial[0], initial[1], rect))) return initial

  const candidateX = [
    initial[0],
    ...reserved.flatMap((rect) => [
      rect.left - RADIAL_MENU_HALF_WIDTH - VIEWPORT_MARGIN,
      rect.right + RADIAL_MENU_HALF_WIDTH + VIEWPORT_MARGIN,
    ]),
  ]
  const candidateY = [
    initial[1],
    ...reserved.flatMap((rect) => [
      rect.top - RADIAL_MENU_HALF_HEIGHT - VIEWPORT_MARGIN,
      rect.bottom + RADIAL_MENU_HALF_HEIGHT + VIEWPORT_MARGIN,
    ]),
  ]
  const candidates = candidateX.flatMap((nextX) =>
    candidateY.map((nextY) => clampPosition(nextX, nextY, size)),
  )
    .filter((candidate) => !reserved.some((rect) => overlapsReserved(candidate[0], candidate[1], rect)))
    .sort((a, b) => Math.hypot(a[0] - initial[0], a[1] - initial[1]) - Math.hypot(b[0] - initial[0], b[1] - initial[1]))
  return candidates[0] ?? initial
}
