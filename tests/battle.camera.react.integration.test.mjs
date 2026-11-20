import assert from 'node:assert/strict'
import { after, afterEach, before, test } from 'node:test'
import { createElement, act } from 'react'
import { createRoot } from 'react-dom/client'
import { JSDOM } from 'jsdom'
import react from '@vitejs/plugin-react'
import { createServer } from 'vite'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { OrthographicCamera, Object3D, Vector3 } from 'three'
import {
  calculateInitialCameraPosition,
  calculateInitialCameraZoom,
  calculateSafeFocusAnchor,
} from '../src/features/battle/battleCameraMath.ts'
import { BATTLE_CAMERA_CONFIG } from '../src/features/battle/battleCameraConfig.ts'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const controllerPath = resolve(projectRoot, 'src/features/battle/components/BattleCameraController.tsx')
const frameHarnessPath = resolve(projectRoot, 'tests/fixtures/r3fCameraFrameHarness.mjs')
let vite
let dom
let BattleCameraController
let frameHarness
let container
let root
let originalMatchMedia
const originalGlobals = new Map()

class ControlsHarness {
  constructor(camera) {
    this.camera = camera
    this.target = new Vector3()
  }

  update() {
    this.camera.lookAt(this.target)
    this.camera.updateMatrixWorld()
  }
}

function installGlobal(name, value) {
  originalGlobals.set(name, Object.getOwnPropertyDescriptor(globalThis, name))
  Object.defineProperty(globalThis, name, {
    configurable: true,
    writable: true,
    value,
  })
}

function frame(camera, size, delta = 1 / 60) {
  act(() => {
    frameHarness.advanceFrame({ camera, size }, delta)
  })
}

function advance(camera, size, count = 120) {
  for (let index = 0; index < count; index += 1) frame(camera, size)
}

function assertProjectedAtSafeAnchor(camera, unit, size) {
  camera.updateMatrixWorld()
  const focusPoint = unit.position.clone().add(new Vector3(0, BATTLE_CAMERA_CONFIG.focusHeight, 0))
  const projected = focusPoint.project(camera)
  const actual = {
    x: (projected.x + 1) * size.width / 2,
    y: (1 - projected.y) * size.height / 2,
  }
  const expected = calculateSafeFocusAnchor(size, [])
  assert.ok(Math.abs(actual.x - expected.x) < 1, `focus x: ${actual.x} != ${expected.x}`)
  assert.ok(Math.abs(actual.y - expected.y) < 1, `focus y: ${actual.y} != ${expected.y}`)
}

function renderController({
  controls,
  groups,
  safeAreaRoot,
  focusUnitId,
}) {
  act(() => root.render(createElement(BattleCameraController, {
    controlsRef: { current: controls },
    unitGroupsRef: { current: groups },
    safeAreaRootRef: { current: safeAreaRoot },
    focusUnitId,
  })))
}

before(async () => {
  dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/' })
  installGlobal('window', dom.window)
  installGlobal('document', dom.window.document)
  installGlobal('HTMLElement', dom.window.HTMLElement)
  installGlobal('IS_REACT_ACT_ENVIRONMENT', true)

  vite = await createServer({
    root: projectRoot,
    configFile: false,
    appType: 'custom',
    plugins: [react()],
    resolve: {
      alias: [{ find: '@react-three/fiber', replacement: frameHarnessPath }],
    },
    optimizeDeps: { noDiscovery: true, entries: [] },
    server: { middlewareMode: true },
    logLevel: 'silent',
  })
  const module = await vite.ssrLoadModule(controllerPath)
  frameHarness = await vite.ssrLoadModule(frameHarnessPath)
  BattleCameraController = module.default
})

after(async () => {
  if (root) act(() => root.unmount())
  await vite?.close()
  dom?.window.close()
  for (const [name, descriptor] of originalGlobals) {
    if (descriptor) Object.defineProperty(globalThis, name, descriptor)
    else delete globalThis[name]
  }
})

afterEach(() => {
  if (root) act(() => root.unmount())
  root = null
  container?.remove()
  container = null
  if (dom && originalMatchMedia !== undefined) window.matchMedia = originalMatchMedia
})

test('camera locks on the first frame, follows movement and orbit, and pans freely only when focus is cleared', () => {
  container = document.createElement('main')
  document.body.append(container)
  root = createRoot(container)

  const size = { width: 1280, height: 720 }
  const camera = new OrthographicCamera(-640, 640, 360, -360, 0.1, 100)
  camera.position.fromArray(calculateInitialCameraPosition())
  camera.zoom = calculateInitialCameraZoom(size)
  camera.updateProjectionMatrix()
  const controls = new ControlsHarness(camera)
  controls.update()
  const player = new Object3D()
  player.position.set(-1, 0, 1)
  const enemy = new Object3D()
  enemy.position.set(3, 0, -2)
  const groups = new Map([
    ['player', player],
    ['enemy', enemy],
  ])
  const safeAreaRoot = document.createElement('div')
  const setFocus = (focusUnitId) => renderController({ controls, groups, safeAreaRoot, focusUnitId })

  setFocus('player')
  frame(camera, size)
  assertProjectedAtSafeAnchor(camera, player, size)

  player.position.x += 2
  frame(camera, size)
  assertProjectedAtSafeAnchor(camera, player, size)

  camera.position.sub(controls.target).applyAxisAngle(new Vector3(0, 1, 0), 0.6).add(controls.target)
  camera.zoom *= 0.8
  camera.updateProjectionMatrix()
  controls.update()
  const orientation = camera.quaternion.clone()
  frame(camera, size)
  assertProjectedAtSafeAnchor(camera, player, size)
  assert.ok(camera.quaternion.angleTo(orientation) < 1e-6)

  setFocus(null)
  controls.target.add(new Vector3(4, 0, 0))
  camera.position.add(new Vector3(4, 0, 0))
  controls.update()
  const afterPan = controls.target.clone()
  advance(camera, size)
  assert.deepEqual(controls.target, afterPan)

  setFocus('enemy')
  advance(camera, size)
  assertProjectedAtSafeAnchor(camera, enemy, size)

  act(() => root.unmount())
  root = null
  assert.equal(frameHarness.getFrameStats().activeCallbacks, 0)
  container.remove()
})

test('viewport resize re-anchors the focused unit after the previous transition settles', () => {
  container = document.createElement('main')
  document.body.append(container)
  root = createRoot(container)

  const viewport = { width: 1280, height: 720 }
  const canvasViewport = { width: 1280, height: 720 }
  const rect = (size = viewport) => ({
    left: 0,
    top: 0,
    right: size.width,
    bottom: size.height,
    width: size.width,
    height: size.height,
  })
  const safeAreaRoot = document.createElement('main')
  const canvasElement = document.createElement('canvas')
  safeAreaRoot.getBoundingClientRect = rect
  canvasElement.getBoundingClientRect = () => rect(canvasViewport)
  safeAreaRoot.append(canvasElement)
  container.append(safeAreaRoot)

  const size = { width: viewport.width, height: viewport.height }
  const camera = new OrthographicCamera(-640, 640, 360, -360, 0.1, 100)
  camera.position.fromArray(calculateInitialCameraPosition())
  camera.zoom = calculateInitialCameraZoom(size)
  camera.updateProjectionMatrix()
  const controls = new ControlsHarness(camera)
  controls.update()
  const player = new Object3D()
  player.position.set(-1, 0, 1)

  renderController({
    controls,
    groups: new Map([['player', player]]),
    safeAreaRoot,
    focusUnitId: 'player',
  })
  advance(camera, size)
  assertProjectedAtSafeAnchor(camera, player, size)

  const resizeViewport = (width, height) => {
    viewport.width = width
    viewport.height = height
    window.dispatchEvent(new window.Event('resize'))
    frame(camera, size)

    size.width = width
    size.height = height
    canvasViewport.width = width
    canvasViewport.height = height
    frame(camera, size)
    camera.left = -width / 2
    camera.right = width / 2
    camera.top = height / 2
    camera.bottom = -height / 2
    camera.updateProjectionMatrix()
    advance(camera, size)
    assertProjectedAtSafeAnchor(camera, player, size)
  }

  resizeViewport(1920, 1080)
  resizeViewport(1280, 720)

  act(() => root.unmount())
  root = null
  assert.equal(frameHarness.getFrameStats().activeCallbacks, 0)
})

test('reduced motion resolves a change of focus immediately', () => {
  originalMatchMedia = window.matchMedia
  window.matchMedia = () => ({
    matches: true,
    addEventListener() {},
    removeEventListener() {},
  })

  container = document.createElement('main')
  document.body.append(container)
  root = createRoot(container)
  const size = { width: 390, height: 845 }
  const camera = new OrthographicCamera(-195, 195, 422.5, -422.5, 0.1, 100)
  camera.position.fromArray(calculateInitialCameraPosition())
  camera.zoom = calculateInitialCameraZoom(size)
  camera.updateProjectionMatrix()
  const controls = new ControlsHarness(camera)
  controls.update()
  const player = new Object3D()
  player.position.set(-2, 0, 0)
  const enemy = new Object3D()
  enemy.position.set(2, 0, 0)
  const groups = new Map([['player', player], ['enemy', enemy]])
  const safeAreaRoot = document.createElement('div')

  renderController({
    controls,
    groups,
    safeAreaRoot,
    focusUnitId: 'player',
  })
  frame(camera, size, 0)
  assertProjectedAtSafeAnchor(camera, player, size)

  renderController({
    controls,
    groups,
    safeAreaRoot,
    focusUnitId: 'enemy',
  })
  frame(camera, size, 0)
  assert.ok(controls.target.distanceTo(enemy.position) > 0)
  assertProjectedAtSafeAnchor(camera, enemy, size)

  act(() => root.unmount())
  root = null
  container.remove()
  window.matchMedia = originalMatchMedia
})
