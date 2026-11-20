import { OrthographicCamera, Vector3 } from 'three'
import { BATTLE_CAMERA_CONFIG } from './battleCameraConfig.ts'

export type CameraScreenRect = {
  left: number
  top: number
  right: number
  bottom: number
}

export type CameraScreenPoint = {
  x: number
  y: number
}

export type CameraViewportSize = {
  width: number
  height: number
}

export function calculateInitialCameraPosition(
  yaw = BATTLE_CAMERA_CONFIG.defaultYaw,
  polarAngle = BATTLE_CAMERA_CONFIG.fixedPolarAngle,
  distance = BATTLE_CAMERA_CONFIG.defaultDistance,
): [number, number, number] {
  const horizontalDistance = Math.sin(polarAngle) * distance
  return [
    Math.sin(yaw) * horizontalDistance,
    Math.cos(polarAngle) * distance,
    Math.cos(yaw) * horizontalDistance,
  ]
}

export function calculateInitialCameraZoom(size: CameraViewportSize): number {
  const width = Math.max(1, size.width)
  const height = Math.max(1, size.height)
  const fittedZoom = Math.min(width / 13.3, height / 7.6)
  return Math.min(BATTLE_CAMERA_CONFIG.maxZoom, Math.max(BATTLE_CAMERA_CONFIG.minZoom, fittedZoom))
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value))
}

function expandRect(rect: CameraScreenRect, padding: number): CameraScreenRect {
  return {
    left: rect.left - padding,
    top: rect.top - padding,
    right: rect.right + padding,
    bottom: rect.bottom + padding,
  }
}

function isPointAvailable(point: CameraScreenPoint, rects: readonly CameraScreenRect[]): boolean {
  return !rects.some((rect) =>
    point.x >= rect.left &&
    point.x <= rect.right &&
    point.y >= rect.top &&
    point.y <= rect.bottom,
  )
}

export function calculateSafeFocusAnchor(
  size: CameraViewportSize,
  reservedRects: readonly CameraScreenRect[],
): CameraScreenPoint {
  const width = Math.max(1, size.width)
  const height = Math.max(1, size.height)
  const margin = Math.min(BATTLE_CAMERA_CONFIG.viewportMargin, width / 4, height / 4)
  const safeRadius = Math.min(96, Math.max(44, Math.min(width, height) * 0.13))
  const expandedRects = reservedRects
    .filter((rect) => rect.right > rect.left && rect.bottom > rect.top)
    .map((rect) => expandRect(rect, safeRadius))
  const desired = {
    x: clamp(width * BATTLE_CAMERA_CONFIG.desiredFocusX, margin, width - margin),
    y: clamp(height * BATTLE_CAMERA_CONFIG.desiredFocusY, margin, height - margin),
  }

  if (isPointAvailable(desired, expandedRects)) return desired

  const candidateXs = new Set<number>([desired.x, width / 2, width - margin, margin])
  const candidateYs = new Set<number>([desired.y, height / 2, height - margin, margin])
  for (const rect of expandedRects) {
    candidateXs.add(clamp(rect.left - margin, margin, width - margin))
    candidateXs.add(clamp(rect.right + margin, margin, width - margin))
    candidateYs.add(clamp(rect.top - margin, margin, height - margin))
    candidateYs.add(clamp(rect.bottom + margin, margin, height - margin))
  }

  const candidates = [...candidateXs].flatMap((x) =>
    [...candidateYs]
      .map((y) => ({ x, y }))
      .filter((point) => isPointAvailable(point, expandedRects)),
  )
  candidates.sort((left, right) =>
    Math.hypot(left.x - desired.x, left.y - desired.y) -
    Math.hypot(right.x - desired.x, right.y - desired.y),
  )
  return candidates[0] ?? desired
}

export function calculateCameraTargetForAnchor(
  focusPosition: Vector3,
  camera: OrthographicCamera,
  size: CameraViewportSize,
  anchor: CameraScreenPoint,
  output = new Vector3(),
  right = new Vector3(),
  up = new Vector3(),
): Vector3 {
  camera.updateMatrixWorld()
  right.setFromMatrixColumn(camera.matrixWorld, 0)
  up.setFromMatrixColumn(camera.matrixWorld, 1)
  const worldUnitsPerPixel = (camera.top - camera.bottom) / camera.zoom / Math.max(1, size.height)
  const horizontalOffset = (anchor.x - size.width / 2) * worldUnitsPerPixel
  const verticalOffset = (size.height / 2 - anchor.y) * worldUnitsPerPixel

  return output
    .copy(focusPosition)
    .addScaledVector(right, -horizontalOffset)
    .addScaledVector(up, -verticalOffset)
}

export function calculateDampingAlpha(deltaSeconds: number, damping: number): number {
  if (!Number.isFinite(deltaSeconds) || deltaSeconds <= 0) return 0
  if (!Number.isFinite(damping) || damping <= 0) return 1
  return 1 - Math.exp(-damping * deltaSeconds)
}

export function translateCameraAndTarget(
  camera: OrthographicCamera,
  currentTarget: Vector3,
  nextTarget: Vector3,
  translation = new Vector3(),
): void {
  translation.subVectors(nextTarget, currentTarget)
  currentTarget.copy(nextTarget)
  camera.position.add(translation)
  camera.updateMatrixWorld()
}
