import { Object3D, Vector3, type Camera } from 'three'

const VIEWPORT_MARGIN = 10

function getRadialRadius(size: { width: number; height: number }): number {
  return size.width >= 2100 && size.height >= 1000 ? 128 : 112
}

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
  const radius = getRadialRadius(size)
  return [
    Math.min(size.width - radius - VIEWPORT_MARGIN, Math.max(radius + VIEWPORT_MARGIN, x)),
    Math.min(size.height - radius - VIEWPORT_MARGIN, Math.max(radius + VIEWPORT_MARGIN, y)),
  ]
}

function overlapsReserved(
  x: number,
  y: number,
  size: { width: number; height: number },
  rect: ScreenRect,
): boolean {
  const radius = getRadialRadius(size)
  return !(
    x + radius <= rect.left ||
    x - radius >= rect.right ||
    y + radius <= rect.top ||
    y - radius >= rect.bottom
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
  if (!reserved.some((rect) => overlapsReserved(initial[0], initial[1], size, rect))) return initial

  const radius = getRadialRadius(size)
  const candidateX = [
    initial[0],
    ...reserved.flatMap((rect) => [
      rect.left - radius - VIEWPORT_MARGIN,
      rect.right + radius + VIEWPORT_MARGIN,
    ]),
  ]
  const candidateY = [
    initial[1],
    ...reserved.flatMap((rect) => [
      rect.top - radius - VIEWPORT_MARGIN,
      rect.bottom + radius + VIEWPORT_MARGIN,
    ]),
  ]
  const candidates = candidateX.flatMap((nextX) =>
    candidateY.map((nextY) => clampPosition(nextX, nextY, size)),
  )
    .filter((candidate) => !reserved.some((rect) => overlapsReserved(candidate[0], candidate[1], size, rect)))
    .sort((a, b) => Math.hypot(a[0] - initial[0], a[1] - initial[1]) - Math.hypot(b[0] - initial[0], b[1] - initial[1]))
  return candidates[0] ?? initial
}
