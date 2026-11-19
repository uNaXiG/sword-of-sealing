import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createElement, StrictMode, useCallback, useReducer } from 'react'
import { JSDOM } from 'jsdom'
import react from '@vitejs/plugin-react'
import { createServer } from 'vite'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createBattleUnit } from '../src/game/classes/class.factory.ts'
import {
  battleReducer,
  createBattleState,
} from '../src/game/battle/battle.state.ts'
import { dispatchAIControllerAction } from '../src/game/battle/battle.ai.gateway.ts'
import { activateUnitFixture, battleReducerFixture } from './turn.fixture.mjs'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const controllerPath = resolve(
  projectRoot,
  'src/features/battle/components/AttackAnimationController.tsx',
)
const frameHarnessPath = resolve(projectRoot, 'tests/fixtures/r3fFrameHarness.mjs')
const visualImports = new Set([
  './AttackProjectile',
  './HitEffect',
  './FloatingDamage',
])

let vite
let dom
let createRoot
let act
let AttackAnimationController
let useAttackAnimation
let frameHarness
const originalGlobals = new Map()

function installGlobal(name, value) {
  originalGlobals.set(name, Object.getOwnPropertyDescriptor(globalThis, name))
  Object.defineProperty(globalThis, name, {
    configurable: true,
    writable: true,
    value,
  })
}

function createIntegrationPlugin() {
  return {
    name: 'attack-controller-integration-test',
    enforce: 'pre',
    resolveId(source, importer) {
      const normalizedImporter = importer?.split('?')[0].replace(/\\/g, '/')
      const normalizedControllerPath = controllerPath.replace(/\\/g, '/')
      if (
        normalizedImporter === normalizedControllerPath &&
        visualImports.has(source)
      ) return `\0attack-visual:${source}`
      return null
    },
    load(id) {
      if (id.startsWith('\0attack-visual:')) {
        return 'export default function TestVisual() { return null }'
      }
      return null
    },
  }
}

function makeUnit(id, unitClass, faction, column, row, overrides = {}) {
  return {
    ...createBattleUnit({
      id,
      class: unitClass,
      faction,
      position: { column, row },
    }),
    ...overrides,
  }
}

const knight = makeUnit('knight', 'knight', 'player', 3, 3)
const goblin = makeUnit('goblin', 'goblin', 'enemy', 4, 3)

function createPlayerAttackState(targetOverrides = {}) {
  const target = { ...goblin, ...targetOverrides }
  let state = createBattleState([knight, target])
  state = battleReducerFixture(state, { type: 'select', unitId: knight.id })
  state = battleReducerFixture(state, { type: 'set-mode', mode: 'ATTACK' })
  state = battleReducerFixture(state, {
    type: 'select-attack-target',
    targetId: target.id,
  })
  state = battleReducerFixture(state, { type: 'confirm-attack' })
  assert.equal(state.attackMotion?.attackerId, knight.id)
  return state
}

function createEnemyAttackStateWithDeathBarrier() {
  const fallen = makeUnit('fallen', 'ranger', 'player', 6, 5, { hp: 0 })
  let state = activateUnitFixture(
    createBattleState([knight, goblin, fallen]),
    goblin.id,
  )
  let issuedAction
  const intent = dispatchAIControllerAction(state, (action) => {
    issuedAction = action
  })
  assert.equal(intent?.type, 'ATTACK')
  assert.ok(issuedAction)
  state = battleReducer(state, issuedAction)
  assert.equal(state.attackMotion?.attackerId, goblin.id)
  assert.ok(state.attackMotion)
  return {
    ...state,
    deathMotions: [{
      deathId: 1,
      unitId: fallen.id,
      killerId: knight.id,
      attackId: 99,
      position: { ...fallen.position },
      sourcePosition: { column: 5, row: 5 },
    }],
    nextDeathId: 2,
  }
}

function ControllerHost({
  initialState,
  stateRef,
  dispatchRef,
  clockRefRef,
  actions,
  showController,
}) {
  const [state, dispatch] = useReducer(battleReducer, initialState)
  stateRef.current = state
  const dispatchAction = useCallback((action) => {
    actions.push(action)
    dispatch(action)
  }, [actions])
  dispatchRef.current = dispatchAction

  const impact = useCallback(
    (attackId) => dispatchAction({ type: 'attack-impact', attackId }),
    [dispatchAction],
  )
  const complete = useCallback(
    (attackId) => dispatchAction({ type: 'attack-complete', attackId }),
    [dispatchAction],
  )
  const abort = useCallback(
    (attackId) => dispatchAction({ type: 'attack-abort', attackId }),
    [dispatchAction],
  )
  const feedbackComplete = useCallback(
    (impactId) => dispatchAction({ type: 'consume-impact', impactId }),
    [dispatchAction],
  )
  const animation = useAttackAnimation(impact, complete, abort)
  clockRefRef.current = animation.clockRef

  if (!showController) return null
  return createElement(AttackAnimationController, {
    attackMotion: state.attackMotion,
    confirmedImpacts: [],
    clockRef: animation.clockRef,
    onImpact: animation.onImpact,
    onComplete: animation.onComplete,
    onAbort: animation.onAbort,
    onFeedbackComplete: feedbackComplete,
  })
}

async function mountController(initialState) {
  const stats = frameHarness.getFrameHarnessStats()
  assert.equal(stats.activeCallbacks, 0, 'previous test leaked a frame callback')

  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)
  const stateRef = { current: null }
  const dispatchRef = { current: null }
  const clockRefRef = { current: null }
  const actions = []
  let props = {
    initialState,
    stateRef,
    dispatchRef,
    clockRefRef,
    actions,
    showController: true,
  }

  async function render(overrides = {}) {
    props = { ...props, ...overrides }
    await act(async () => {
      root.render(createElement(
        StrictMode,
        null,
        createElement(ControllerHost, props),
      ))
    })
  }

  await render()
  await act(async () => { await Promise.resolve() })
  return {
    actions,
    stateRef,
    dispatchRef,
    clockRefRef,
    render,
    async frame(delta) {
      await act(async () => frameHarness.advanceFrame(delta))
      await act(async () => { await Promise.resolve() })
    },
    async dispatch(action) {
      await act(async () => dispatchRef.current(action))
      await act(async () => { await Promise.resolve() })
    },
    async unmount() {
      await act(async () => root.unmount())
      await act(async () => { await Promise.resolve() })
      container.remove()
    },
  }
}

before(async () => {
  vite = await createServer({
    root: projectRoot,
    configFile: false,
    plugins: [react(), createIntegrationPlugin()],
    resolve: {
      alias: [{ find: '@react-three/fiber', replacement: frameHarnessPath }],
    },
    optimizeDeps: { noDiscovery: true, entries: [] },
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: 'silent',
  })
  const controllerModule = await vite.ssrLoadModule(controllerPath)
  const animationHookModule = await vite.ssrLoadModule(
    resolve(projectRoot, 'src/features/battle/hooks/useAttackAnimation.ts'),
  )
  frameHarness = await vite.ssrLoadModule(frameHarnessPath)
  AttackAnimationController = controllerModule.default
  useAttackAnimation = animationHookModule.useAttackAnimation

  dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://localhost/',
  })
  for (const [name, value] of [
    ['window', dom.window],
    ['document', dom.window.document],
    ['navigator', dom.window.navigator],
    ['HTMLElement', dom.window.HTMLElement],
    ['Node', dom.window.Node],
    ['IS_REACT_ACT_ENVIRONMENT', true],
  ]) installGlobal(name, value)
  const reactDomClient = await import('react-dom/client')
  ;({ createRoot } = reactDomClient)
  ;({ act } = await import('react'))
})

after(async () => {
  if (vite) await vite.close()
  if (dom) dom.window.close()
  for (const [name, descriptor] of originalGlobals) {
    if (descriptor) Object.defineProperty(globalThis, name, descriptor)
    else delete globalThis[name]
  }
})

test('React StrictMode mounts the controller, replays effects, and registers one frame callback', async () => {
  frameHarness.setFrameOnSubscribe(true)
  let harness
  try {
    harness = await mountController(createPlayerAttackState())
    frameHarness.setFrameOnSubscribe(false)
    const stats = frameHarness.getFrameHarnessStats()
    assert.ok(stats.registrations >= 2)
    assert.ok(stats.cleanups >= 1)
    assert.ok(stats.preEffectFrames >= 1)
    assert.equal(stats.activeCallbacks, 1)
    assert.equal(harness.actions.length, 0)
    assert.equal(harness.clockRefRef.current.current.elapsedMs, 0)
  } finally {
    frameHarness.setFrameOnSubscribe(false)
    if (harness) await harness.unmount()
  }
  assert.equal(frameHarness.getFrameHarnessStats().activeCallbacks, 0)
})

test('controlled frame deltas keep HP unchanged before impact and dispatch reducer events at their boundaries', async () => {
  const harness = await mountController(createPlayerAttackState())
  const attackId = harness.stateRef.current.attackMotion.attackId
  const targetHp = harness.stateRef.current.units.find((unit) => unit.id === goblin.id).hp
  try {
    await harness.frame(0.44)
    assert.equal(harness.actions.length, 0)
    assert.equal(harness.stateRef.current.units.find((unit) => unit.id === goblin.id).hp, targetHp)

    await harness.frame(0.02)
    assert.deepEqual(
      harness.actions.map(({ type }) => type),
      ['attack-impact'],
    )
    assert.equal(harness.actions[0].attackId, attackId)
    assert.equal(harness.stateRef.current.attackMotion.phase, 'IMPACTED')
    assert.equal(
      harness.stateRef.current.units.find((unit) => unit.id === goblin.id).hp,
      targetHp - harness.stateRef.current.lastAttackResult.appliedDamage,
    )

    await harness.frame(0.54)
    assert.deepEqual(
      harness.actions.map(({ type }) => type),
      ['attack-impact', 'attack-complete'],
    )
    assert.deepEqual(
      harness.actions.map(({ attackId: actionId }) => actionId),
      [attackId, attackId],
    )
    assert.equal(
      harness.stateRef.current.units.find((unit) => unit.id === goblin.id).hp,
      targetHp - harness.stateRef.current.lastAttackResult.appliedDamage,
    )
    assert.equal(harness.stateRef.current.attackMotion, null)
    assert.equal(harness.stateRef.current.confirmedImpacts.length, 1)
    assert.equal(harness.stateRef.current.turn.activeUnitId, goblin.id)

    await harness.frame(5)
    assert.equal(harness.actions.length, 2)
  } finally {
    await harness.unmount()
  }
})

test('a single large frame dispatches impact before completion exactly once', async () => {
  const harness = await mountController(createPlayerAttackState())
  const attackId = harness.stateRef.current.attackMotion.attackId
  try {
    await harness.frame(1.5)
    assert.deepEqual(
      harness.actions.map(({ type }) => type),
      ['attack-impact', 'attack-complete'],
    )
    assert.deepEqual(
      harness.actions.map(({ attackId: actionId }) => actionId),
      [attackId, attackId],
    )
    assert.equal(harness.stateRef.current.attackMotion, null)
    assert.equal(harness.stateRef.current.confirmedImpacts.length, 1)

    await harness.frame(5)
    assert.equal(harness.actions.length, 2)
    assert.equal(harness.stateRef.current.confirmedImpacts.length, 1)
  } finally {
    await harness.unmount()
  }
})

test('a React prop transition resets the clock and isolates consecutive player and enemy attack IDs', async () => {
  const harness = await mountController(createPlayerAttackState())
  try {
    await harness.frame(1.1)
    assert.equal(harness.stateRef.current.turn.activeUnitId, goblin.id)

    const enemyIntentAction = []
    const intent = dispatchAIControllerAction(
      harness.stateRef.current,
      (action) => enemyIntentAction.push(action),
    )
    assert.equal(intent?.type, 'ATTACK')
    assert.equal(enemyIntentAction.length, 1)
    await harness.dispatch(enemyIntentAction[0])

    const secondAttackId = harness.stateRef.current.attackMotion.attackId
    assert.equal(secondAttackId, 2)
    assert.equal(harness.clockRefRef.current.current.attackId, secondAttackId)
    assert.equal(harness.clockRefRef.current.current.elapsedMs, 0)
    const playerHp = harness.stateRef.current.units.find((unit) => unit.id === knight.id).hp

    await harness.frame(1.2)
    const impactActions = harness.actions.filter(({ type }) => type === 'attack-impact')
    assert.deepEqual(impactActions.map(({ attackId }) => attackId), [1, secondAttackId])
    assert.equal(
      harness.stateRef.current.units.find((unit) => unit.id === knight.id).hp,
      playerHp - harness.stateRef.current.lastAttackResult.appliedDamage,
    )
    assert.equal(harness.stateRef.current.attackMotion, null)
  } finally {
    await harness.unmount()
  }
})

test('a mismatched clock Attack ID aborts only the current reservation without impact', async () => {
  const harness = await mountController(createPlayerAttackState())
  const attackId = harness.stateRef.current.attackMotion.attackId
  const targetHp = harness.stateRef.current.units.find((unit) => unit.id === goblin.id).hp
  const turnId = harness.stateRef.current.turn.turnId
  try {
    harness.clockRefRef.current.current.attackId += 1
    await harness.frame(0.1)
    assert.deepEqual(harness.actions, [{ type: 'attack-abort', attackId }])
    assert.equal(harness.stateRef.current.attackMotion, null)
    assert.equal(harness.stateRef.current.units.find((unit) => unit.id === goblin.id).hp, targetHp)
    assert.equal(harness.stateRef.current.turn.turnId, turnId)
  } finally {
    await harness.unmount()
  }
})

test('pre-impact frame abort dispatches once without HP damage or ending the player turn', async () => {
  const harness = await mountController(createPlayerAttackState())
  const playerHp = harness.stateRef.current.units.find((unit) => unit.id === goblin.id).hp
  const turnId = harness.stateRef.current.turn.turnId
  try {
    await harness.frame(Number.NaN)
    assert.deepEqual(
      harness.actions.map(({ type }) => type),
      ['attack-abort'],
    )
    assert.equal(harness.stateRef.current.attackMotion, null)
    assert.equal(
      harness.stateRef.current.units.find((unit) => unit.id === goblin.id).hp,
      playerHp,
    )
    assert.equal(harness.stateRef.current.turn.turnId, turnId)
  } finally {
    await harness.unmount()
  }
})

test('enemy pre-impact abort callback preserves the death-motion barrier until it resolves', async () => {
  const harness = await mountController(createEnemyAttackStateWithDeathBarrier())
  const turnId = harness.stateRef.current.turn.turnId
  try {
    await harness.frame(Number.NaN)
    const aborted = harness.stateRef.current
    assert.deepEqual(
      harness.actions.map(({ type }) => type),
      ['attack-abort'],
    )
    assert.equal(aborted.turn.turnId, turnId)
    assert.equal(aborted.pendingTurnCompletion?.unitId, goblin.id)
    assert.equal(aborted.deathMotions.length, 1)

    await harness.dispatch({
      type: 'death-complete',
      deathId: aborted.deathMotions[0].deathId,
      unitId: 'fallen',
    })
    assert.equal(harness.stateRef.current.pendingTurnCompletion, null)
    assert.equal(harness.stateRef.current.turn.turnId, turnId + 1)
  } finally {
    await harness.unmount()
  }
})

test('post-impact abort preserves reducer-confirmed damage and advances the player turn', async () => {
  const harness = await mountController(createPlayerAttackState())
  const targetHp = harness.stateRef.current.units.find((unit) => unit.id === goblin.id).hp
  const turnId = harness.stateRef.current.turn.turnId
  try {
    await harness.frame(0.45)
    assert.equal(harness.stateRef.current.attackMotion.phase, 'IMPACTED')
    assert.equal(harness.stateRef.current.units.find((unit) => unit.id === goblin.id).hp, targetHp - 15)

    await harness.frame(Number.NaN)
    assert.equal(harness.stateRef.current.attackMotion, null)
    assert.equal(harness.stateRef.current.units.find((unit) => unit.id === goblin.id).hp, targetHp - 15)
    assert.equal(harness.stateRef.current.turn.turnId, turnId + 1)
    assert.deepEqual(
      harness.actions.map(({ type }) => type),
      ['attack-impact', 'attack-abort'],
    )
  } finally {
    await harness.unmount()
  }
})

test('lethal same-frame impact and completion preserve the death-motion turn barrier', async () => {
  const harness = await mountController(createPlayerAttackState({ hp: 5 }))
  const turnId = harness.stateRef.current.turn.turnId
  try {
    await harness.frame(1.5)
    const state = harness.stateRef.current
    assert.equal(state.units.find((unit) => unit.id === goblin.id).hp, 0)
    assert.equal(state.deathMotions.length, 1)
    assert.equal(state.pendingTurnCompletion?.unitId, knight.id)
    assert.equal(state.turn.turnId, turnId)

    await harness.dispatch({
      type: 'death-complete',
      deathId: state.deathMotions[0].deathId,
      unitId: goblin.id,
    })
    assert.equal(harness.stateRef.current.pendingTurnCompletion, null)
    assert.equal(harness.stateRef.current.turn.turnId, turnId + 1)
  } finally {
    await harness.unmount()
  }
})

test('unmount aborts pending attack once, removes its frame callback, and remount is clean', async () => {
  const harness = await mountController(createPlayerAttackState())
  const targetHp = harness.stateRef.current.units.find((unit) => unit.id === goblin.id).hp
  const turnId = harness.stateRef.current.turn.turnId
  try {
    await harness.render({ showController: false })
    await act(async () => { await Promise.resolve() })

    assert.equal(frameHarness.getFrameHarnessStats().activeCallbacks, 0)
    assert.deepEqual(
      harness.actions.map(({ type }) => type),
      ['attack-abort'],
    )
    assert.equal(harness.stateRef.current.attackMotion, null)
    assert.equal(harness.stateRef.current.units.find((unit) => unit.id === goblin.id).hp, targetHp)
    assert.equal(harness.stateRef.current.turn.turnId, turnId)

    await harness.render({ showController: true })
    assert.equal(frameHarness.getFrameHarnessStats().activeCallbacks, 1)
    await harness.frame(2)
    assert.equal(harness.actions.length, 1)
  } finally {
    await harness.unmount()
  }
  assert.equal(frameHarness.getFrameHarnessStats().activeCallbacks, 0)
})
