import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import {
  createElement,
  Fragment,
  StrictMode,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react'
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
import { createBattleSession } from '../src/game/battle/battle.session.ts'
import { dispatchAIControllerAction } from '../src/game/battle/battle.ai.gateway.ts'
import { useBattleAI } from '../src/features/battle/hooks/useBattleAI.ts'
import { LossCondition } from '../src/game/end-conditions/loss-condition.ts'
import { AllDead as LossAllDead } from '../src/game/end-conditions/loss/all-dead.ts'
import { WinCondition } from '../src/game/end-conditions/win-condition.ts'
import { AllDead as WinAllDead } from '../src/game/end-conditions/win/all-dead.ts'
import { activateUnitFixture, battleReducerFixture } from './turn.fixture.mjs'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const controllerPath = resolve(
  projectRoot,
  'src/features/battle/components/AttackAnimationController.tsx',
)
const deathControllerPath = resolve(
  projectRoot,
  'src/features/battle/components/DeathAnimationController.tsx',
)
const frameHarnessPath = resolve(projectRoot, 'tests/fixtures/r3fFrameHarness.mjs')
const sessionHostPath = resolve(
  projectRoot,
  'src/features/battle/components/BattleSessionHost.tsx',
)
const resultOverlayPath = resolve(
  projectRoot,
  'src/features/battle/components/BattleResultOverlay.tsx',
)
const battleScenePath = resolve(projectRoot, 'src/features/battle/BattleScene.tsx')
const visualImports = new Set([
  './AttackProjectile',
  './DeathParticleEffect',
  './HitEffect',
  './FloatingDamage',
])

let vite
let dom
let createRoot
let act
let AttackAnimationController
let DeathAnimationController
let useAttackAnimation
let useDeathAnimation
let BattleSessionHost
let BattleResultOverlay
let BattleScene
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
      const normalizedDeathControllerPath = deathControllerPath.replace(/\\/g, '/')
      const normalizedBattleScenePath = battleScenePath.replace(/\\/g, '/')
      if (
        normalizedImporter === normalizedBattleScenePath &&
        source === './components/BattleSessionRuntime'
      ) return '\0battle-session-runtime-probe'
      if (
        (normalizedImporter === normalizedControllerPath ||
          normalizedImporter === normalizedDeathControllerPath) &&
        visualImports.has(source)
      ) return `\0attack-visual:${source}`
      return null
    },
    load(id) {
      if (id === '\0battle-session-runtime-probe') {
        return `
          import { createElement, useEffect } from 'react'
          export default function RuntimeProbe({ generation, requestRestart }) {
            useEffect(() => {
              const record = { generation, cleaned: false }
              globalThis.__battleSessionRuntimeProbeRecords.push(record)
              return () => { record.cleaned = true }
            }, [])
            return createElement('button', {
              type: 'button',
              onClick: () => requestRestart(generation),
            }, String(generation))
          }
        `
      }
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

function withTurnContext(state, action) {
  return {
    ...action,
    turnId: state.turn.turnId,
    unitId: state.turn.activeUnitId,
  }
}

function createAllDeadSession(units) {
  return createBattleSession({
    units,
    winCondition: new WinCondition([new WinAllDead()]),
    lossCondition: new LossCondition([new LossAllDead()]),
  })
}

function beginConfiguredPlayerAttack(session, targetId) {
  let state = session.initialState
  state = session.reducer(state, withTurnContext(state, { type: 'set-mode', mode: 'ATTACK' }))
  state = session.reducer(state, withTurnContext(state, {
    type: 'select-attack-target',
    targetId,
  }))
  state = session.reducer(state, withTurnContext(state, { type: 'confirm-attack' }))
  assert.ok(state.attackMotion)
  return state
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
  reducer,
  stateRef,
  dispatchRef,
  clockRefRef,
  actions,
  showController,
  showDeathController,
}) {
  const [state, dispatch] = useReducer(reducer, initialState)
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

  const deathComplete = useCallback(
    (deathId, unitId) => dispatchAction({ type: 'death-complete', deathId, unitId }),
    [dispatchAction],
  )
  const deathAbort = useCallback(
    (deathId, unitId) => dispatchAction({ type: 'death-abort', deathId, unitId }),
    [dispatchAction],
  )
  const deathAnimation = useDeathAnimation(deathComplete, deathAbort)

  if (!showController) return null
  return createElement(
    Fragment,
    null,
    createElement(AttackAnimationController, {
      attackMotion: state.attackMotion,
      confirmedImpacts: [],
      clockRef: animation.clockRef,
      onImpact: animation.onImpact,
      onComplete: animation.onComplete,
      onAbort: animation.onAbort,
      onFeedbackComplete: feedbackComplete,
    }),
    showDeathController
      ? createElement(DeathAnimationController, {
        motions: state.deathMotions,
        deathClockRef: deathAnimation.deathClockRef,
        onComplete: deathAnimation.onComplete,
        onAbort: deathAnimation.onAbort,
      })
      : null,
  )
}

async function mountController(initialState, reducer = battleReducer, showDeathController = false) {
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
    reducer,
    stateRef,
    dispatchRef,
    clockRefRef,
    actions,
    showController: true,
    showDeathController,
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

function makeSessionUnits(mode) {
  const isDefeat = mode === 'defeat'
  const isEnemyTurn = mode === 'ai' || isDefeat
  const player = makeUnit(
    'session-player',
    'knight',
    'player',
    3,
    3,
    {
      agi: isEnemyTurn ? 1 : 100,
      atk: mode === 'victory' ? 100 : 1,
      def: 0,
      hp: isDefeat ? 1 : 30,
      maxHp: 30,
    },
  )
  const enemy = makeUnit(
    'session-enemy',
    'goblin',
    'enemy',
    4,
    3,
    {
      agi: isEnemyTurn ? 100 : 1,
      atk: isDefeat ? 100 : 1,
      def: 0,
      hp: mode === 'victory' ? 1 : 100,
      maxHp: 100,
    },
  )
  return [player, enemy]
}

function SessionAI({ enabled, state, dispatch }) {
  if (!enabled) return null
  return createElement(SessionAIController, { state, dispatch })
}

function SessionAIController({ state, dispatch }) {
  useBattleAI(state, dispatch)
  return null
}

function SessionProbe({
  generation,
  requestRestart,
  instances,
  mode,
  enableAI,
}) {
  const [session] = useState(() => createAllDeadSession(makeSessionUnits(mode)))
  const [state, dispatch] = useReducer(session.reducer, session.initialState)
  const stateRef = useRef(state)
  stateRef.current = state
  const impactAttack = useCallback(
    (attackId) => dispatch({ type: 'attack-impact', attackId }),
    [dispatch],
  )
  const completeAttack = useCallback(
    (attackId) => dispatch({ type: 'attack-complete', attackId }),
    [dispatch],
  )
  const abortAttack = useCallback(
    (attackId) => dispatch({ type: 'attack-abort', attackId }),
    [dispatch],
  )
  const animation = useAttackAnimation(impactAttack, completeAttack, abortAttack)
  const deathAnimation = useDeathAnimation(
    useCallback(
      (deathId, unitId) => dispatch({ type: 'death-complete', deathId, unitId }),
      [dispatch],
    ),
    useCallback(
      (deathId, unitId) => dispatch({ type: 'death-abort', deathId, unitId }),
      [dispatch],
    ),
  )
  const startMove = useCallback(() => {
    const context = { turnId: state.turn.turnId, unitId: state.turn.activeUnitId }
    dispatch({ type: 'set-mode', mode: 'MOVE', ...context })
    dispatch({ type: 'cell', cell: { column: 3, row: 4 }, ...context })
  }, [dispatch, state])
  const startAttack = useCallback(() => {
    const context = { turnId: state.turn.turnId, unitId: state.turn.activeUnitId }
    dispatch({ type: 'set-mode', mode: 'ATTACK', ...context })
    dispatch({ type: 'select-attack-target', targetId: 'session-enemy', ...context })
    dispatch({ type: 'confirm-attack', ...context })
  }, [dispatch, state])
  const standby = useCallback(
    () => dispatch(withTurnContext(state, { type: 'standby' })),
    [dispatch, state],
  )
  const issueAIAction = useCallback(
    () => dispatchAIControllerAction(state, dispatch),
    [dispatch, state],
  )
  const initialAIAction = useRef(issueAIAction)
  const finishMove = useCallback(
    (unitId, motionId) => dispatch({ type: 'finish', unitId, motionId }),
    [dispatch],
  )
  const cancelMove = useCallback(
    (unitId, motionId) => dispatch({ type: 'cancel', unitId, motionId }),
    [dispatch],
  )
  const consumeImpact = useCallback(
    (impactId) => dispatch({ type: 'consume-impact', impactId }),
    [dispatch],
  )
  const restart = useCallback(
    () => requestRestart(generation),
    [generation, requestRestart],
  )
  const recordRef = useRef({})
  recordRef.current.generation = generation
  recordRef.current.session = session
  recordRef.current.stateRef = stateRef
  recordRef.current.dispatch = dispatch
  recordRef.current.callbacks = {
    startMove,
    startAttack,
    standby,
    issueAIAction,
    initialAIAction: initialAIAction.current,
    finishMove,
    cancelMove,
    impact: animation.onImpact,
    completeAttack: animation.onComplete,
    abortAttack: animation.onAbort,
    consumeImpact,
    completeDeath: deathAnimation.onComplete,
    abortDeath: deathAnimation.onAbort,
    restart,
  }

  useEffect(() => {
    const record = recordRef.current
    instances.set(generation, record)
    return () => {
      if (instances.get(generation) === record) instances.delete(generation)
    }
  }, [generation, instances])

  return createElement(
    Fragment,
    null,
    createElement('output', { 'data-testid': 'session-outcome' }, state.outcome ?? 'ACTIVE'),
    createElement('button', {
      type: 'button',
      'data-testid': 'request-remount',
      onClick: restart,
    }, 'Remount'),
    createElement('button', {
      type: 'button',
      'data-testid': 'start-move',
      onClick: startMove,
    }, 'Start move'),
    createElement('button', {
      type: 'button',
      'data-testid': 'start-attack',
      onClick: startAttack,
    }, 'Start attack'),
    createElement(SessionAI, { enabled: enableAI, state, dispatch }),
    createElement(AttackAnimationController, {
      attackMotion: state.attackMotion,
      confirmedImpacts: [],
      clockRef: animation.clockRef,
      onImpact: animation.onImpact,
      onComplete: animation.onComplete,
      onAbort: animation.onAbort,
      onFeedbackComplete: consumeImpact,
    }),
    createElement(DeathAnimationController, {
      motions: state.deathMotions,
      deathClockRef: deathAnimation.deathClockRef,
      onComplete: deathAnimation.onComplete,
      onAbort: deathAnimation.onAbort,
    }),
    state.outcome !== null
      ? createElement(BattleResultOverlay, { outcome: state.outcome, onRestart: restart })
      : null,
  )
}

async function mountSessionHost({ mode = 'player', enableAI = false, strict = false } = {}) {
  const stats = frameHarness.getFrameHarnessStats()
  assert.equal(stats.activeCallbacks, 0, 'previous test leaked a frame callback')
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)
  const instances = new Map()
  const render = () => {
    const host = createElement(
      BattleSessionHost,
      null,
      ({ generation, requestRestart }) => createElement(SessionProbe, {
        key: generation,
        generation,
        requestRestart,
        instances,
        mode,
        enableAI,
      }),
    )
    root.render(strict ? createElement(StrictMode, null, host) : host)
  }

  await act(async () => render())
  await act(async () => { await Promise.resolve() })
  return {
    container,
    instances,
    current: () => Array.from(instances.values()).reduce(
      (latest, record) => !latest || record.generation > latest.generation ? record : latest,
      null,
    ),
    async click(testId) {
      const button = container.querySelector(`[data-testid="${testId}"]`)
      assert.ok(button, `missing test button: ${testId}`)
      await act(async () => button.click())
      await act(async () => { await Promise.resolve() })
    },
    async clickSelector(selector) {
      const element = container.querySelector(selector)
      assert.ok(element, `missing element: ${selector}`)
      await act(async () => element.click())
      await act(async () => { await Promise.resolve() })
    },
    async run(callback) {
      let result
      await act(async () => { result = callback() })
      await act(async () => { await Promise.resolve() })
      return result
    },
    async frame(delta) {
      await act(async () => frameHarness.advanceFrame(delta))
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
  const deathControllerModule = await vite.ssrLoadModule(deathControllerPath)
  const animationHookModule = await vite.ssrLoadModule(
    resolve(projectRoot, 'src/features/battle/hooks/useAttackAnimation.ts'),
  )
  const deathAnimationHookModule = await vite.ssrLoadModule(
    resolve(projectRoot, 'src/features/battle/hooks/useDeathAnimation.ts'),
  )
  const sessionHostModule = await vite.ssrLoadModule(sessionHostPath)
  const resultOverlayModule = await vite.ssrLoadModule(resultOverlayPath)
  const battleSceneModule = await vite.ssrLoadModule(battleScenePath)
  frameHarness = await vite.ssrLoadModule(frameHarnessPath)
  AttackAnimationController = controllerModule.default
  DeathAnimationController = deathControllerModule.default
  useAttackAnimation = animationHookModule.useAttackAnimation
  useDeathAnimation = deathAnimationHookModule.useDeathAnimation
  BattleSessionHost = sessionHostModule.default
  BattleResultOverlay = resultOverlayModule.default
  BattleScene = battleSceneModule.default

  dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://localhost/',
  })
  Object.defineProperty(dom.window.HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value() {
      this.open = true
      this.focus()
    },
  })
  Object.defineProperty(dom.window.HTMLDialogElement.prototype, 'close', {
    configurable: true,
    value() {
      this.open = false
    },
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

test('configured Victory waits for React attack and death lifecycle completion without advancing PAS', async () => {
  const fragileGoblin = makeUnit('fragile-goblin', 'goblin', 'enemy', 4, 3, { hp: 5 })
  const session = createAllDeadSession([knight, fragileGoblin])
  const attackState = beginConfiguredPlayerAttack(session, fragileGoblin.id)
  const attackId = attackState.attackMotion.attackId
  const turnId = attackState.turn.turnId
  const harness = await mountController(attackState, session.reducer, true)

  try {
    await harness.frame(0.45)
    const afterImpact = harness.stateRef.current
    assert.deepEqual(
      harness.actions.map(({ type }) => type),
      ['attack-impact'],
    )
    assert.equal(afterImpact.outcome, null)
    assert.equal(afterImpact.attackMotion.phase, 'IMPACTED')
    assert.equal(afterImpact.deathMotions.length, 1)
    assert.equal(afterImpact.turn.turnId, turnId)

    await harness.frame(0.55)
    const afterAttack = harness.stateRef.current
    assert.deepEqual(
      harness.actions.map(({ type }) => type),
      ['attack-impact', 'attack-complete'],
    )
    assert.equal(afterAttack.outcome, null)
    assert.equal(afterAttack.attackMotion, null)
    assert.equal(afterAttack.deathMotions.length, 1)
    assert.equal(afterAttack.pendingTurnCompletion?.unitId, knight.id)
    assert.equal(afterAttack.turn.turnId, turnId)

    await harness.frame(0.7)
    const terminal = harness.stateRef.current
    assert.equal(terminal.outcome, 'VICTORY')
    assert.equal(terminal.pendingTurnCompletion, null)
    assert.equal(terminal.turn.turnId, turnId)
    assert.deepEqual(
      harness.actions.map(({ type }) => type),
      ['attack-impact', 'attack-complete', 'death-complete'],
    )

    await harness.dispatch({ type: 'attack-complete', attackId })
    assert.equal(harness.stateRef.current, terminal)
    assert.equal(harness.stateRef.current.outcome, 'VICTORY')
  } finally {
    await harness.unmount()
  }
})

test('configured Defeat waits for React enemy attack and player death lifecycle completion', async () => {
  const fragileKnight = { ...knight, hp: 5 }
  const fastGoblin = { ...goblin, agi: 20 }
  const session = createAllDeadSession([fragileKnight, fastGoblin])
  const initial = session.initialState
  let aiAction
  const intent = dispatchAIControllerAction(initial, (action) => { aiAction = action })
  assert.equal(intent?.type, 'ATTACK')
  assert.ok(aiAction)
  const attackState = session.reducer(initial, aiAction)
  const attackId = attackState.attackMotion.attackId
  const turnId = attackState.turn.turnId
  const harness = await mountController(attackState, session.reducer, true)

  try {
    await harness.frame(0.4)
    const afterImpact = harness.stateRef.current
    assert.deepEqual(
      harness.actions.map(({ type }) => type),
      ['attack-impact'],
    )
    assert.equal(afterImpact.outcome, null)
    assert.equal(afterImpact.attackMotion.phase, 'IMPACTED')
    assert.equal(afterImpact.deathMotions.length, 1)
    assert.equal(afterImpact.turn.turnId, turnId)

    await harness.frame(0.5)
    const afterAttack = harness.stateRef.current
    assert.deepEqual(
      harness.actions.map(({ type }) => type),
      ['attack-impact', 'attack-complete'],
    )
    assert.equal(afterAttack.outcome, null)
    assert.equal(afterAttack.attackMotion, null)
    assert.equal(afterAttack.deathMotions.length, 1)
    assert.equal(afterAttack.pendingTurnCompletion?.unitId, fastGoblin.id)
    assert.equal(afterAttack.turn.turnId, turnId)

    await harness.frame(0.7)
    const terminal = harness.stateRef.current
    assert.equal(terminal.outcome, 'DEFEAT')
    assert.equal(terminal.pendingTurnCompletion, null)
    assert.equal(terminal.turn.turnId, turnId)

    await harness.dispatch({ type: 'attack-abort', attackId })
    assert.equal(harness.stateRef.current, terminal)
    assert.equal(harness.stateRef.current.outcome, 'DEFEAT')
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

async function reachVictory(harness) {
  await harness.click('start-attack')
  assert.ok(harness.current().stateRef.current.attackMotion)
  await harness.frame(2)
  assert.equal(harness.current().stateRef.current.outcome, null)
  assert.equal(harness.current().stateRef.current.deathMotions.length, 1)
  assert.equal(harness.container.querySelector('dialog'), null)
  await harness.frame(2)
  assert.equal(harness.current().stateRef.current.outcome, 'VICTORY')
  assert.ok(harness.container.querySelector('dialog'))
}

async function reachDefeat(harness) {
  assert.ok(harness.current().stateRef.current.attackMotion)
  await harness.frame(2)
  assert.equal(harness.current().stateRef.current.outcome, null)
  assert.equal(harness.current().stateRef.current.deathMotions.length, 1)
  assert.equal(harness.container.querySelector('dialog'), null)
  await harness.frame(2)
  assert.equal(harness.current().stateRef.current.outcome, 'DEFEAT')
  assert.ok(harness.container.querySelector('dialog'))
}

test('ACTIVE BattleState does not render a result dialog', async () => {
  const harness = await mountSessionHost()
  try {
    assert.equal(harness.current().stateRef.current.outcome, null)
    assert.equal(harness.container.querySelector('dialog'), null)
  } finally {
    await harness.unmount()
  }
})

test('Production BattleScene remounts its keyed runtime when the Session Host accepts restart', async () => {
  const records = []
  installGlobal('__battleSessionRuntimeProbeRecords', records)
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)

  try {
    await act(async () => root.render(createElement(BattleScene)))
    await act(async () => { await Promise.resolve() })
    assert.deepEqual(records.map(({ generation }) => generation), [0])

    await act(async () => container.querySelector('button').click())
    await act(async () => { await Promise.resolve() })
    assert.deepEqual(records.map(({ generation }) => generation), [0, 1])
    assert.equal(records[0].cleaned, true)
    assert.equal(records[1].cleaned, false)
  } finally {
    await act(async () => root.unmount())
    await act(async () => { await Promise.resolve() })
    container.remove()
  }
})

test('Victory presentation waits for death completion and exposes the configured result copy', async () => {
  const harness = await mountSessionHost({ mode: 'victory' })
  try {
    await reachVictory(harness)
    const dialog = harness.container.querySelector('dialog')
    assert.equal(dialog.getAttribute('aria-modal'), 'true')
    assert.equal(dialog.getAttribute('aria-labelledby'), 'battle-result-title')
    assert.equal(dialog.getAttribute('aria-describedby'), 'battle-result-description')
    assert.equal(harness.container.querySelector('.battle-result-eyebrow').textContent, 'VICTORY')
    assert.equal(harness.container.querySelector('#battle-result-title').textContent, '戰鬥勝利')
    assert.equal(harness.container.querySelector('#battle-result-description').textContent, '已成功殲滅敵方部隊')
    assert.equal(harness.container.querySelector('.battle-result-restart').textContent, '重新挑戰')
    assert.equal(document.activeElement, harness.container.querySelector('.battle-result-restart'))
  } finally {
    await harness.unmount()
  }
})

test('Defeat presentation follows the configured enemy attack and death lifecycle', async () => {
  const harness = await mountSessionHost({ mode: 'defeat', enableAI: true })
  try {
    await reachDefeat(harness)
    assert.equal(harness.container.querySelector('.battle-result-eyebrow').textContent, 'DEFEAT')
    assert.equal(harness.container.querySelector('#battle-result-title').textContent, '戰鬥失敗')
    assert.equal(harness.container.querySelector('#battle-result-description').textContent, '我方部隊已全數陣亡')
    assert.ok(harness.container.querySelector('.battle-result-dialog-defeat'))
  } finally {
    await harness.unmount()
  }
})

test('Result dialog prevents Escape and backdrop dismissal while retaining keyboard focus', async () => {
  const harness = await mountSessionHost({ mode: 'victory' })
  try {
    await reachVictory(harness)
    const dialog = harness.container.querySelector('dialog')
    const cancel = new dom.window.Event('cancel', { cancelable: true })
    dialog.dispatchEvent(cancel)
    assert.equal(cancel.defaultPrevented, true)
    dialog.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true, cancelable: true }))
    assert.equal(dialog.open, true)
    assert.equal(document.activeElement, harness.container.querySelector('.battle-result-restart'))
  } finally {
    await harness.unmount()
  }
})

test('Victory restart remounts a fresh Session without changing the route or mutating the old outcome', async () => {
  const harness = await mountSessionHost({ mode: 'victory' })
  try {
    await reachVictory(harness)
    const previous = harness.current()
    const previousSessionState = previous.stateRef.current
    await harness.clickSelector('.battle-result-restart')

    const restarted = harness.current()
    assert.equal(restarted.generation, previous.generation + 1)
    assert.equal(restarted.stateRef.current.outcome, null)
    assert.deepEqual(restarted.stateRef.current, restarted.session.initialState)
    assert.notEqual(restarted.session, previous.session)
    assert.notEqual(restarted.session.reducer, previous.session.reducer)
    assert.notEqual(restarted.dispatch, previous.dispatch)
    assert.equal(previousSessionState.outcome, 'VICTORY')
    assert.equal(harness.container.querySelector('dialog'), null)
  } finally {
    await harness.unmount()
  }
})

test('Defeat restart restores the same initial roster and clears terminal presentation', async () => {
  const harness = await mountSessionHost({ mode: 'defeat', enableAI: true })
  try {
    await reachDefeat(harness)
    const previous = harness.current()
    await harness.clickSelector('.battle-result-restart')
    const restarted = harness.current()

    assert.equal(restarted.stateRef.current.outcome, null)
    assert.deepEqual(restarted.session.initialState, previous.session.initialState)
    assert.deepEqual(
      restarted.session.initialState.units.map(({ id, hp, sp, position }) => ({ id, hp, sp, position })),
      previous.session.initialState.units.map(({ id, hp, sp, position }) => ({ id, hp, sp, position })),
    )
    assert.equal(restarted.stateRef.current.attackMotion?.attackId, 1)
    assert.equal(restarted.stateRef.current.nextAttackId, 2)
    assert.equal(harness.container.querySelector('dialog'), null)
  } finally {
    await harness.unmount()
  }
})

test('a same-generation Restart request succeeds once and stale handlers cannot restart the new Session', async () => {
  const harness = await mountSessionHost()
  try {
    const previous = harness.current()
    await harness.run(() => {
      previous.callbacks.restart()
      previous.callbacks.restart()
    })
    assert.equal(harness.current().generation, previous.generation + 1)
    const restarted = harness.current()
    await harness.run(previous.callbacks.restart)
    assert.equal(harness.current(), restarted)
    assert.equal(harness.current().generation, previous.generation + 1)
  } finally {
    await harness.unmount()
  }
})

test('three completed victories and restarts create fresh, equivalent battle sessions', async () => {
  const harness = await mountSessionHost({ mode: 'victory' })
  try {
    const previousSessions = [harness.current().session]
    for (let index = 0; index < 3; index += 1) {
      await reachVictory(harness)
      const previous = harness.current()
      previousSessions.push(previous.session)
      await harness.clickSelector('.battle-result-restart')
      const current = harness.current()
      assert.equal(current.generation, index + 1)
      assert.deepEqual(current.stateRef.current, current.session.initialState)
      assert.equal(previous.stateRef.current.outcome, 'VICTORY')
      assert.ok(previousSessions.every((session) => session !== current.session))
    }
  } finally {
    await harness.unmount()
  }
})

test('same-ID old Move finish and cancel callbacks cannot complete a new Session motion', async () => {
  const harness = await mountSessionHost()
  try {
    const previous = harness.current()
    await harness.run(previous.callbacks.startMove)
    const previousMotion = previous.stateRef.current.motion
    assert.equal(previousMotion.motionId, 1)
    await harness.run(previous.callbacks.restart)

    const restarted = harness.current()
    await harness.run(restarted.callbacks.startMove)
    const currentMotion = restarted.stateRef.current.motion
    assert.equal(currentMotion.motionId, previousMotion.motionId)
    assert.equal(currentMotion.unitId, previousMotion.unitId)
    assert.equal(currentMotion.turnId, previousMotion.turnId)
    await harness.run(() => {
      previous.callbacks.finishMove(previousMotion.unitId, previousMotion.motionId)
      previous.callbacks.cancelMove(previousMotion.unitId, previousMotion.motionId)
    })
    assert.equal(restarted.stateRef.current.motion, currentMotion)
  } finally {
    await harness.unmount()
  }
})

test('same-ID old Attack impact, completion, and abort callbacks cannot alter a new attack', async () => {
  const harness = await mountSessionHost()
  try {
    const previous = harness.current()
    await harness.run(previous.callbacks.startAttack)
    const previousMotion = previous.stateRef.current.attackMotion
    await harness.run(previous.callbacks.restart)
    const restarted = harness.current()
    await harness.run(restarted.callbacks.startAttack)
    const currentMotion = restarted.stateRef.current.attackMotion
    const currentTarget = restarted.stateRef.current.units.find((unit) => unit.id === currentMotion.targetId)
    assert.equal(currentMotion.attackId, previousMotion.attackId)
    assert.equal(currentMotion.turnId, previousMotion.turnId)
    assert.equal(currentMotion.attackerId, previousMotion.attackerId)
    await harness.run(() => {
      previous.callbacks.impact(previousMotion.attackId)
      previous.callbacks.completeAttack(previousMotion.attackId)
      previous.callbacks.abortAttack(previousMotion.attackId)
    })
    assert.equal(restarted.stateRef.current.attackMotion, currentMotion)
    assert.equal(
      restarted.stateRef.current.units.find((unit) => unit.id === currentMotion.targetId).hp,
      currentTarget.hp,
    )
  } finally {
    await harness.unmount()
  }
})

test('same-ID old Death complete and abort callbacks cannot remove a new Session death motion', async () => {
  const harness = await mountSessionHost({ mode: 'victory' })
  try {
    const previous = harness.current()
    await harness.run(previous.callbacks.startAttack)
    await harness.run(() => previous.callbacks.impact(1))
    const previousDeath = previous.stateRef.current.deathMotions[0]
    assert.ok(previousDeath)
    await harness.run(previous.callbacks.restart)

    const restarted = harness.current()
    await harness.run(restarted.callbacks.startAttack)
    await harness.run(() => restarted.callbacks.impact(1))
    const currentDeath = restarted.stateRef.current.deathMotions[0]
    assert.equal(currentDeath.deathId, previousDeath.deathId)
    assert.equal(currentDeath.unitId, previousDeath.unitId)
    assert.equal(currentDeath.attackId, previousDeath.attackId)
    await harness.run(() => {
      previous.callbacks.completeDeath(previousDeath.deathId, previousDeath.unitId)
      previous.callbacks.abortDeath(previousDeath.deathId, previousDeath.unitId)
    })
    assert.equal(restarted.stateRef.current.deathMotions[0], currentDeath)
  } finally {
    await harness.unmount()
  }
})

test('same-ID old Impact consumption cannot clear a new Session confirmed impact', async () => {
  const harness = await mountSessionHost()
  try {
    const previous = harness.current()
    await harness.run(previous.callbacks.startAttack)
    await harness.run(() => previous.callbacks.impact(1))
    const previousImpact = previous.stateRef.current.confirmedImpacts[0]
    assert.ok(previousImpact)
    await harness.run(previous.callbacks.restart)

    const restarted = harness.current()
    await harness.run(restarted.callbacks.startAttack)
    await harness.run(() => restarted.callbacks.impact(1))
    const currentImpact = restarted.stateRef.current.confirmedImpacts[0]
    assert.equal(currentImpact.impactId, previousImpact.impactId)
    assert.equal(currentImpact.attackId, previousImpact.attackId)
    await harness.run(() => previous.callbacks.consumeImpact(previousImpact.impactId))
    assert.equal(restarted.stateRef.current.confirmedImpacts[0], currentImpact)
  } finally {
    await harness.unmount()
  }
})

test('same-turn old AI Gateway callback and signed action stay bound to the old Session dispatch', async () => {
  const harness = await mountSessionHost({ mode: 'ai' })
  try {
    const previous = harness.current()
    const previousTurn = previous.stateRef.current.turn
    await harness.run(previous.callbacks.restart)
    const restarted = harness.current()
    assert.equal(restarted.stateRef.current.turn.turnId, previousTurn.turnId)
    assert.equal(restarted.stateRef.current.turn.activeUnitId, previousTurn.activeUnitId)
    assert.equal(restarted.stateRef.current.attackMotion, null)

    const intent = await harness.run(previous.callbacks.initialAIAction)
    assert.equal(intent?.type, 'ATTACK')
    assert.equal(restarted.stateRef.current.attackMotion, null)
    assert.equal(restarted.stateRef.current.turn.activeUnitId, previousTurn.activeUnitId)
  } finally {
    await harness.unmount()
  }
})

test('same-turn old Player action callback cannot advance the new Session PAS', async () => {
  const harness = await mountSessionHost()
  try {
    const previous = harness.current()
    const previousTurnId = previous.stateRef.current.turn.turnId
    await harness.run(previous.callbacks.restart)
    const restarted = harness.current()
    assert.equal(restarted.stateRef.current.turn.turnId, previousTurnId)
    assert.equal(restarted.stateRef.current.turn.activeUnitId, previous.stateRef.current.turn.activeUnitId)
    await harness.run(previous.callbacks.standby)
    assert.equal(restarted.stateRef.current.turn.turnId, previousTurnId)
    assert.equal(restarted.stateRef.current.turn.activeUnitId, previous.stateRef.current.turn.activeUnitId)
  } finally {
    await harness.unmount()
  }
})

test('StrictMode remount keeps a single effective AI attack and one active Frame subscription', async () => {
  const harness = await mountSessionHost({ mode: 'ai', enableAI: true, strict: true })
  try {
    const previous = harness.current()
    const state = previous.stateRef.current
    assert.equal(state.attackMotion?.attackId, 1)
    assert.equal(state.nextAttackId, 2)
    assert.equal(frameHarness.getFrameHarnessStats().activeCallbacks, 1)
    await harness.click('request-remount')
    const restarted = harness.current()
    const restartedAttack = restarted.stateRef.current.attackMotion
    assert.equal(restartedAttack?.attackId, 1)
    assert.equal(restarted.stateRef.current.nextAttackId, 2)
    await harness.run(previous.callbacks.initialAIAction)
    assert.equal(restarted.stateRef.current.attackMotion, restartedAttack)
    assert.equal(frameHarness.getFrameHarnessStats().activeCallbacks, 1)
  } finally {
    await harness.unmount()
  }
  assert.equal(frameHarness.getFrameHarnessStats().activeCallbacks, 0)
})

test('Session remount and unmount clean old controller Frame subscriptions', async () => {
  const harness = await mountSessionHost()
  const before = frameHarness.getFrameHarnessStats()
  try {
    await harness.run(harness.current().callbacks.startAttack)
    assert.equal(frameHarness.getFrameHarnessStats().activeCallbacks, 1)
    await harness.click('request-remount')
    const afterRestart = frameHarness.getFrameHarnessStats()
    assert.equal(afterRestart.activeCallbacks, 1)
    assert.ok(afterRestart.cleanups > before.cleanups)
    await harness.frame(2)
    assert.equal(harness.current().stateRef.current.attackMotion, null)
  } finally {
    await harness.unmount()
  }
  assert.equal(frameHarness.getFrameHarnessStats().activeCallbacks, 0)
})
