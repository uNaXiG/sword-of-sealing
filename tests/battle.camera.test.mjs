import assert from 'node:assert/strict'
import test from 'node:test'
import { OrthographicCamera, Vector3 } from 'three'
import { BATTLE_CAMERA_CONFIG } from '../src/features/battle/battleCameraConfig.ts'
import {
  calculateCameraTargetForAnchor,
  calculateDampingAlpha,
  calculateInitialCameraPosition,
  calculateInitialCameraZoom,
  calculateSafeFocusAnchor,
  translateCameraAndTarget,
} from '../src/features/battle/battleCameraMath.ts'

test('initial camera pose uses one fixed pitch and responsive zoom within existing bounds', () => {
  const [x, y, z] = calculateInitialCameraPosition()
  const distance = Math.hypot(x, y, z)

  assert.ok(Math.abs(Math.acos(y / distance) - BATTLE_CAMERA_CONFIG.fixedPolarAngle) < 1e-10)
  assert.ok(calculateInitialCameraZoom({ width: 1280, height: 720 }) <= BATTLE_CAMERA_CONFIG.maxZoom)
  assert.ok(calculateInitialCameraZoom({ width: 390, height: 845 }) >= BATTLE_CAMERA_CONFIG.minZoom)
  assert.equal(calculateInitialCameraZoom({ width: 0, height: 0 }), BATTLE_CAMERA_CONFIG.minZoom)
})

test('safe focus anchor avoids expanded UI regions and remains within viewport in compact layouts', () => {
  const size = { width: 1280, height: 720 }
  const reserved = [{ left: 0, top: 0, right: 520, bottom: 720 }]
  const anchor = calculateSafeFocusAnchor(size, reserved)

  assert.ok(anchor.x > 520)
  assert.ok(anchor.x < size.width)
  assert.ok(anchor.y > 0 && anchor.y < size.height)

  const referenceFrame = calculateSafeFocusAnchor(
    { width: 1412, height: 713 },
    [
      { left: 0, top: 100, right: 522, bottom: 713 },
      { left: 70, top: 527, right: 692, bottom: 693 },
      { left: 789, top: 611, right: 1396, bottom: 701 },
    ],
  )
  assert.ok(referenceFrame.x > 500 && referenceFrame.x < 950)
  assert.ok(referenceFrame.y > 355 && referenceFrame.y < 575)

  const compact = calculateSafeFocusAnchor(
    { width: 390, height: 845 },
    [{ left: 0, top: 0, right: 200, bottom: 650 }],
  )
  assert.ok(compact.x >= 0 && compact.x <= 390)
  assert.ok(compact.y >= 0 && compact.y <= 845)
})

test('screen-anchor translation preserves camera offset, orientation, and zoom', () => {
  const size = { width: 1280, height: 720 }
  const camera = new OrthographicCamera(-size.width / 2, size.width / 2, size.height / 2, -size.height / 2, 0.1, 100)
  const currentTarget = new Vector3(0, 0, 0)
  camera.position.set(8, 10, 8)
  camera.zoom = 80
  camera.lookAt(currentTarget)
  camera.updateProjectionMatrix()
  camera.updateMatrixWorld()

  const positionOffset = camera.position.clone().sub(currentTarget)
  const originalQuaternion = camera.quaternion.clone()
  const focusPosition = new Vector3(2, 0.75, -1)
  const anchor = { x: 880, y: 270 }
  const nextTarget = calculateCameraTargetForAnchor(focusPosition, camera, size, anchor)
  translateCameraAndTarget(camera, currentTarget, nextTarget)
  camera.lookAt(currentTarget)
  camera.updateMatrixWorld()

  assert.ok(camera.position.clone().sub(currentTarget).distanceTo(positionOffset) < 1e-8)
  assert.ok(camera.quaternion.angleTo(originalQuaternion) < 1e-8)
  assert.equal(camera.zoom, 80)

  const projected = focusPosition.clone().project(camera)
  assert.ok(Math.abs((projected.x + 1) * size.width / 2 - anchor.x) < 1e-6)
  assert.ok(Math.abs((1 - projected.y) * size.height / 2 - anchor.y) < 1e-6)
})

test('exponential camera damping converges consistently across frame rates', () => {
  const finalValues = [30, 60, 120].map((framesPerSecond) => {
    let value = 0
    for (let frame = 0; frame < framesPerSecond; frame += 1) {
      value += (10 - value) * calculateDampingAlpha(1 / framesPerSecond, BATTLE_CAMERA_CONFIG.transitionDamping)
    }
    return value
  })

  assert.ok(Math.max(...finalValues) - Math.min(...finalValues) < 1e-10)
  assert.ok(finalValues[0] > 9.9)
})
