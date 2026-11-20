import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createElement, StrictMode, act } from 'react'
import { JSDOM } from 'jsdom'
import react from '@vitejs/plugin-react'
import { createServer } from 'vite'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { canAttackTarget, getAttackDistance } from '../src/game/battle/battle.attack.ts'
import { ATTACK_ANIMATION_PROFILES, getImpactMs } from '../src/game/battle/battle.animation.ts'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const appPath = resolve(projectRoot, 'src/App.tsx')
const battleScenePath = resolve(projectRoot, 'src/features/battle/BattleScene.tsx')
const runtimePath = resolve(projectRoot, 'src/features/battle/components/BattleSessionRuntime.tsx')
const aiHookPath = resolve(projectRoot, 'src/features/battle/hooks/useBattleAI.ts')
const frameHarnessPath = resolve(projectRoot, 'tests/fixtures/r3fFrameHarness.mjs')
const routeHarnessPath = resolve(projectRoot, 'tests/fixtures/r3fRouteHarness.mjs')
const dreiHarnessPath = resolve(projectRoot, 'tests/fixtures/dreiRouteHarness.mjs')

let vite
let dom
let createRoot
let App
let frameHarness
let routeHarness
let container
let root
let routeRegistry
let activeHashChangeListeners
let restartFrameBaseline = null
const originalGlobals = new Map()
const deferredWork = { tracking: false, scheduled: 0, completed: 0, pending: 0 }
const nativeQueueMicrotask = globalThis.queueMicrotask.bind(globalThis)

const visualStubs = new Map([
  [runtimePath.replace(/\\/g, '/'), new Map([
    ['./GridMap', 'GridMap'],
    ['./UnitPlaceholder', 'UnitPlaceholder'],
    ['./Environment', 'Environment'],
    ['./ObstacleMap', 'ObstacleMap'],
  ])],
  [resolve(projectRoot, 'src/features/battle/components/AttackAnimationController.tsx').replace(/\\/g, '/'), new Map([
    ['./AttackProjectile', 'AttackProjectile'],
    ['./HitEffect', 'HitEffect'],
    ['./FloatingDamage', 'FloatingDamage'],
  ])],
  [resolve(projectRoot, 'src/features/battle/components/DeathAnimationController.tsx').replace(/\\/g, '/'), new Map([
    ['./DeathParticleEffect', 'DeathParticleEffect'],
  ])],
])

function installGlobal(name, value) {
  originalGlobals.set(name, Object.getOwnPropertyDescriptor(globalThis, name))
  Object.defineProperty(globalThis, name, {
    configurable: true,
    writable: true,
    value,
  })
}

function createRouteIntegrationPlugin() {
  return {
    name: 'battle-production-route-integration-test',
    enforce: 'pre',
    resolveId(source, importer) {
      const importerPath = importer?.split('?')[0].replace(/\\/g, '/')
      const stub = visualStubs.get(importerPath)?.get(source)
      return stub ? `\0route-visual:${stub}` : null
    },
    load(id) {
      if (!id.startsWith('\0route-visual:')) return null
      if (id === '\0route-visual:UnitPlaceholder') {
        return `
          import { useEffect } from 'react'
          export default function UnitPlaceholder({ unit, activeUnitId }) {
            useEffect(() => {
              return globalThis.__battleRouteRegistry?.registerUnitPresentation(
                unit.id,
                unit.faction,
                activeUnitId,
              )
            }, [unit.id, unit.faction, activeUnitId])
            return null
          }
        `
      }
      return 'export default function VisualStub() { return null }'
    },
    transform(code, id) {
      const normalizedId = id.split('?')[0].replace(/\\/g, '/')
      if (normalizedId.endsWith('/src/features/battle/hooks/useBattleMovement.ts')) {
        const marker = /return\s*\{\s*\.\.\.state,/
        if (!marker.test(code)) throw new Error('Movement hook test instrumentation target changed')
        return code.replace(marker, (match) => `${match}\n    __testSession: battleSession,`)
      }

      if (normalizedId.endsWith('/src/features/battle/components/BattleSessionRuntime.tsx')) {
        const pattern = /const\s*\{\s*outcome,[\s\S]*?\}\s*=\s*useBattleMovement\(\)/
        if (!pattern.test(code)) throw new Error(`Battle runtime test instrumentation target changed: ${normalizedId}`)
        return code.replace(pattern, (match) => {
          const bindings = match.slice(match.indexOf('{') + 1, match.lastIndexOf('}'))
          return `const battle = useBattleMovement()\n  globalThis.__battleRouteRegistry?.capture(generation, battle, requestRestart)\n  const {${bindings}} = battle`
        })
      }

      if (normalizedId.endsWith('/src/features/battle/components/AttackAnimationController.tsx')) {
        const source = code.replace(/\r\n/g, '\n')
        const startMarker = '  return (\n    <>'
        const endMarker = '    </>\n  )'
        const start = source.indexOf(startMarker)
        const end = source.indexOf(endMarker, start)
        if (start < 0 || end < 0) throw new Error(`Attack visual test replacement target changed: ${normalizedId}`)
        return `${source.slice(0, start)}  return null${source.slice(end + endMarker.length)}`
      }

      if (normalizedId.endsWith('/src/features/battle/hooks/useBattleAI.ts')) {
        const gatewayCall = /const intent\s*=\s*dispatchAIControllerAction\(state,\s*dispatch\)/
        if (!gatewayCall.test(code)) throw new Error(`AI lifecycle test instrumentation target changed: ${normalizedId}`)
        return code.replace(
          gatewayCall,
          'globalThis.__battleRouteRegistry?.captureAI(state, dispatch)\n    const intent = dispatchAIControllerAction(state, dispatch)',
        )
      }

      return null
    },
  }
}

async function settle() {
  const previousTracking = deferredWork.tracking
  deferredWork.tracking = true
  try {
    await act(async () => {
      await new Promise((resolvePromise) => setImmediate(resolvePromise))
      await Promise.resolve()
      await Promise.resolve()
    })
  } finally {
    deferredWork.tracking = previousTracking
  }
}

async function waitFor(predicate, message) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    await settle()
    if (predicate()) return
  }
  assert.fail(message)
}

async function navigateHash(hash) {
  const oldURL = dom.window.location.href
  const nextURL = `${dom.window.location.pathname}${hash}`
  const previousTracking = deferredWork.tracking
  deferredWork.tracking = true
  try {
    await act(async () => {
      dom.window.history.pushState(null, '', nextURL)
      dom.window.dispatchEvent(new dom.window.HashChangeEvent('hashchange', {
        oldURL,
        newURL: dom.window.location.href,
      }))
    })
    await settle()
  } finally {
    deferredWork.tracking = previousTracking
  }
}

async function enterBattle() {
  await navigateHash('#battle')
  await waitFor(
    () => container.querySelector('.battle-screen') && routeRegistry.current(),
    'production Battle route did not mount',
  )
  assert.equal(container.querySelectorAll('.battle-screen').length, 1)
  return routeRegistry.current()
}

async function leaveBattle() {
  const leavingRecord = routeRegistry.current()
  await navigateHash('')
  await waitFor(
    () => container.querySelector('.title-screen') && !container.querySelector('.battle-screen'),
    'production Main Menu did not replace Battle route',
  )
  await settle()
  assert.equal(container.querySelectorAll('.battle-screen').length, 0)
  assert.equal(deferredWork.pending, 0)
  assert.equal(deferredWork.scheduled, deferredWork.completed)
  assert.equal(leavingRecord.unitPresentations.size, 0)
}

async function run(callback) {
  const previousTracking = deferredWork.tracking
  deferredWork.tracking = true
  try {
    await act(async () => callback())
    await settle()
  } finally {
    deferredWork.tracking = previousTracking
  }
}

function currentFor(session) {
  return routeRegistry.records.find((record) => record.session === session)
}

async function startMove(record) {
  let battle = record.latest
  assert.ok(battle.activeUnit, 'expected an active turn')
  if (battle.selectedUnit?.id !== battle.activeUnit.id) {
    await run(() => battle.selectUnit(battle.activeUnit.id))
    battle = currentFor(record.session).latest
  }
  await run(() => battle.setInteractionMode('MOVE'))
  battle = currentFor(record.session).latest
  const destination = [...battle.reachable.values()].find((tile) => tile.path.length > 1)
  assert.ok(destination, 'expected at least one reachable movement destination')
  await run(() => battle.selectCell(destination.path.at(-1)))
  battle = currentFor(record.session).latest
  assert.ok(battle.motion, 'legal movement should create a Motion')
  return battle
}

async function startAttack(record) {
  let battle = record.latest
  const activeUnitId = battle.activeUnit?.id
  assert.ok(activeUnitId, 'expected a player unit turn')
  const attacker = battle.units.find((unit) => unit.id === activeUnitId)
  const reachableAttackTile = [...battle.reachable.values()].find((tile) => {
    const position = tile.path.at(-1)
    const hypotheticalUnits = battle.units.map((unit) => unit.id === activeUnitId
      ? { ...unit, position }
      : unit)
    return battle.units.some((target) =>
      target.faction !== attacker.faction &&
      canAttackTarget(hypotheticalUnits, activeUnitId, target.id),
    )
  })
  assert.ok(reachableAttackTile, 'production scenario should allow a legal move into attack range')

  await run(() => battle.setInteractionMode('MOVE'))
  battle = currentFor(record.session).latest
  await run(() => battle.selectCell(reachableAttackTile.path.at(-1)))
  battle = currentFor(record.session).latest
  assert.ok(battle.motion)
  await run(() => battle.finishMove(battle.motion.unitId, battle.motion.motionId))
  battle = currentFor(record.session).latest
  assert.equal(battle.motion, null)

  await run(() => battle.setInteractionMode('ATTACK'))
  battle = currentFor(record.session).latest
  const target = battle.attackableTargets[0]
  assert.ok(target, 'completed legal movement should expose an attack target')
  await run(() => battle.selectAttackTarget(target.id))
  battle = currentFor(record.session).latest
  await run(() => battle.confirmAttack())
  battle = currentFor(record.session).latest
  assert.ok(battle.attackMotion, 'the configured production reducer should start the attack')
  return battle
}

function choosePlayerMove(battle) {
  const activeUnit = battle.activeUnit
  const enemies = battle.units.filter((unit) => unit.faction !== activeUnit.faction && unit.hp > 0)
  const options = [...battle.reachable.values()]
    .filter((tile) => tile.path.length > 1)
    .map((tile) => {
      const position = tile.path.at(-1)
      const unitsAtDestination = battle.units.map((unit) => unit.id === activeUnit.id
        ? { ...unit, position }
        : unit)
      const attackable = enemies.some((enemy) =>
        canAttackTarget(unitsAtDestination, activeUnit.id, enemy.id),
      )
      const distance = Math.min(...enemies.map((enemy) =>
        getAttackDistance(position, enemy.position, activeUnit.attackPattern),
      ))
      return { tile, attackable, distance }
    })
    .sort((first, second) =>
      Number(second.attackable) - Number(first.attackable) ||
      first.distance - second.distance ||
      first.tile.cost - second.tile.cost,
    )
  return options[0]?.tile ?? null
}

async function advanceRuntimeBattle(record, targetOutcome, maxSteps = 2400, stopWhen = null) {
  for (let step = 0; step < maxSteps; step += 1) {
    let battle = currentFor(record.session).latest
    if (stopWhen?.(battle)) return { stopped: true, battle }
    if (battle.outcome) return battle.outcome

    if (battle.motion) {
      await run(() => battle.finishMove(battle.motion.unitId, battle.motion.motionId))
      continue
    }

    if (battle.attackMotion || battle.deathMotions.length > 0) {
      await run(() => frameHarness.advanceFrame(2))
      continue
    }

    if (battle.activeUnit?.faction === 'enemy') {
      await settle()
      continue
    }

    if (!battle.activeUnit) {
      await settle()
      continue
    }

    if (battle.selectedUnit?.id !== battle.activeUnit.id) {
      await run(() => battle.selectUnit(battle.activeUnit.id))
      battle = currentFor(record.session).latest
    }

    if (targetOutcome === 'DEFEAT' && battle.canStandby) {
      await run(() => battle.standby())
      continue
    }

    if (battle.canEnterAttackMode) {
      await run(() => battle.setInteractionMode('ATTACK'))
      battle = currentFor(record.session).latest
      const target = battle.attackableTargets
        .slice()
        .sort((first, second) => first.hp - second.hp)[0]
      if (target) {
        await run(() => battle.selectAttackTarget(target.id))
        battle = currentFor(record.session).latest
        await run(() => battle.confirmAttack())
        continue
      }
      await run(() => battle.cancelAttack())
      battle = currentFor(record.session).latest
    }

    if (battle.canEnterMoveMode) {
      const destination = choosePlayerMove(battle)
      if (destination) {
        await run(() => battle.setInteractionMode('MOVE'))
        battle = currentFor(record.session).latest
        await run(() => battle.selectCell(destination.path.at(-1)))
        continue
      }
    }

    if (battle.canStandby) {
      await run(() => battle.standby())
      continue
    }
    await settle()
  }
  assert.fail(`production battle did not reach ${targetOutcome}; last state: ${JSON.stringify({
    outcome: currentFor(record.session).latest.outcome,
    turn: currentFor(record.session).latest.turn,
    activeUnit: currentFor(record.session).latest.activeUnit?.id,
    motion: currentFor(record.session).latest.motion,
    attackMotion: currentFor(record.session).latest.attackMotion,
    deathMotions: currentFor(record.session).latest.deathMotions.length,
  })}`)
}

async function restartFromOutcome(record) {
  const previousSession = record.session
  const previousGeneration = record.generation
  const previousBattle = currentFor(previousSession).latest
  const staleRestartHandler = record.restartHandler
  const stalePlayerAction = previousBattle.standby
  const framesBefore = frameHarness.getFrameHarnessStats()
  const canvasBefore = routeHarness.getCanvasHarnessStats()
  await run(() => container.querySelector('.battle-result-restart').click())
  const current = routeRegistry.current()
  const framesAfter = frameHarness.getFrameHarnessStats()
  const canvasAfter = routeHarness.getCanvasHarnessStats()
  assert.notEqual(current.session, previousSession)
  assert.equal(current.generation, previousGeneration + 1)
  assert.equal(current.latest.outcome, null)
  assert.deepEqual(current.latest.units, current.session.initialState.units)
  assert.equal(record.unitPresentations.size, 0)
  const activeIndicators = [...current.unitPresentations.values()].filter((unit) => unit.showActiveIndicator)
  assert.equal(activeIndicators.length, 1)
  assert.equal(activeIndicators[0].unitId, current.latest.activeUnit.id)
  assert.equal(activeIndicators[0].unitId, 'assassin')
  assert.equal(container.querySelector('dialog'), null)
  assert.equal(container.querySelectorAll('.battle-screen').length, 1)
  assert.ok(framesAfter.cleanups > framesBefore.cleanups)
  if (restartFrameBaseline === null) restartFrameBaseline = framesAfter.activeCallbacks
  assert.equal(framesAfter.activeCallbacks, restartFrameBaseline)
  assert.equal(framesAfter.registrations - framesAfter.cleanups, framesAfter.activeCallbacks)
  assert.ok(canvasAfter.canvasMounts > canvasBefore.canvasMounts)
  assert.ok(canvasAfter.canvasCleanups > canvasBefore.canvasCleanups)
  assert.equal(canvasAfter.activeCanvases, 1)
  assert.equal(canvasAfter.canvasMounts - canvasAfter.canvasCleanups, canvasAfter.activeCanvases)

  const currentTurn = current.latest.turn
  await run(() => {
    staleRestartHandler(previousGeneration)
    stalePlayerAction()
  })
  assert.equal(routeRegistry.current(), current)
  assert.equal(currentFor(current.session).latest.turn, currentTurn)
  assert.equal(currentFor(current.session).latest.outcome, null)
  assert.equal(deferredWork.pending, 0)
  return current
}

async function verifyTerminalRouteUnmount(record, expectedOutcome, dialogSelector) {
  const outcome = await advanceRuntimeBattle(record, expectedOutcome)
  assert.equal(outcome, expectedOutcome)
  const terminalBattle = currentFor(record.session).latest
  const oldSession = record.session
  const staleRestartHandler = record.restartHandler
  const stalePlayerAction = terminalBattle.standby
  assert.equal(terminalBattle.outcome, expectedOutcome)
  assert.ok(container.querySelector(dialogSelector))
  assert.equal(container.querySelectorAll('.battle-screen').length, 1)

  await leaveBattle()
  assert.equal(container.querySelector('.battle-screen'), null)
  assert.equal(container.querySelector('dialog'), null)
  assert.equal(frameHarness.getFrameHarnessStats().activeCallbacks, 0)
  assert.equal(routeHarness.getCanvasHarnessStats().activeCanvases, 0)

  const current = await enterBattle()
  assert.notEqual(current.session, oldSession)
  assert.equal(current.latest.outcome, null)
  assert.deepEqual(current.latest.units, current.session.initialState.units)
  assert.equal(container.querySelector('dialog'), null)
  assert.equal(container.querySelectorAll('.battle-screen').length, 1)
  const currentTurn = current.latest.turn

  await run(() => {
    staleRestartHandler(record.generation)
    stalePlayerAction()
  })
  assert.equal(routeRegistry.current(), current)
  assert.equal(currentFor(current.session).latest.outcome, null)
  assert.equal(currentFor(current.session).latest.turn, currentTurn)
  assert.deepEqual(currentFor(current.session).latest.units, current.session.initialState.units)
  return current
}

async function mountApp() {
  restartFrameBaseline = null
  routeRegistry = {
    records: [],
    capture(generation, battle, restartHandler) {
      const session = battle.__testSession
      let record = this.records.find((candidate) => candidate.session === session)
      if (!record) {
        record = { generation, session, latest: null, renders: 0, aiCaptures: [], unitPresentations: new Map() }
        this.records.push(record)
      }
      record.generation = generation
      record.latest = battle
      record.restartHandler = restartHandler
      record.renders += 1
    },
    registerUnitPresentation(unitId, faction, activeUnitId) {
      const record = this.current()
      if (!record) return undefined
      record.unitPresentations.set(unitId, {
        unitId,
        faction,
        activeUnitId,
        showNameAndHealth: faction === 'enemy',
        showActiveIndicator: unitId === activeUnitId,
      })
      return () => record.unitPresentations.delete(unitId)
    },
    captureAI(state, dispatch) {
      const activeUnit = state.units.find((unit) => unit.id === state.turn.activeUnitId)
      const record = this.current()
      if (activeUnit?.faction === 'enemy' && record) {
        record.aiCaptures.push({ state, dispatch })
      }
    },
    current() { return this.records.at(-1) ?? null },
  }
  installGlobal('__battleRouteRegistry', routeRegistry)
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  await act(async () => {
    root.render(createElement(StrictMode, null, createElement(App)))
  })
  await settle()
}

async function unmountApp() {
  if (!root) return
  const previousTracking = deferredWork.tracking
  deferredWork.tracking = true
  try {
    await act(async () => root.unmount())
    await settle()
    container.remove()
    root = null
  } finally {
    deferredWork.tracking = previousTracking
  }
  assert.equal(deferredWork.pending, 0)
  assert.equal(deferredWork.scheduled, deferredWork.completed)
  for (const record of routeRegistry.records) {
    assert.equal(record.unitPresentations.size, 0)
  }
}

before(async () => {
  vite = await createServer({
    root: projectRoot,
    mode: 'production',
    configFile: false,
    plugins: [createRouteIntegrationPlugin(), react()],
    resolve: {
      alias: [
        { find: '@react-three/fiber', replacement: routeHarnessPath },
        { find: '@react-three/drei', replacement: dreiHarnessPath },
      ],
    },
    optimizeDeps: { noDiscovery: true, entries: [] },
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: 'silent',
  })
  await vite.ssrLoadModule(battleScenePath)
  App = (await vite.ssrLoadModule(appPath)).default
  frameHarness = await vite.ssrLoadModule(frameHarnessPath)
  routeHarness = await vite.ssrLoadModule(routeHarnessPath)

  dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://localhost/',
  })
  Object.defineProperty(dom.window.HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value() { this.open = true },
  })
  Object.defineProperty(dom.window.HTMLDialogElement.prototype, 'close', {
    configurable: true,
    value() { this.open = false },
  })

  const listeners = new Set()
  const addEventListener = dom.window.addEventListener.bind(dom.window)
  const removeEventListener = dom.window.removeEventListener.bind(dom.window)
  dom.window.addEventListener = (type, listener, options) => {
    if (type === 'hashchange') listeners.add(listener)
    return addEventListener(type, listener, options)
  }
  dom.window.removeEventListener = (type, listener, options) => {
    if (type === 'hashchange') listeners.delete(listener)
    return removeEventListener(type, listener, options)
  }
  activeHashChangeListeners = listeners

  for (const [name, value] of [
    ['window', dom.window],
    ['document', dom.window.document],
    ['navigator', dom.window.navigator],
    ['HTMLElement', dom.window.HTMLElement],
    ['Node', dom.window.Node],
    ['IS_REACT_ACT_ENVIRONMENT', true],
    ['queueMicrotask', (callback) => {
      if (!deferredWork.tracking) {
        nativeQueueMicrotask(callback)
        return
      }
      deferredWork.scheduled += 1
      deferredWork.pending += 1
      nativeQueueMicrotask(() => {
        try {
          callback()
        } finally {
          deferredWork.completed += 1
          deferredWork.pending -= 1
        }
      })
    }],
  ]) installGlobal(name, value)
  ;({ createRoot } = await import('react-dom/client'))
})

after(async () => {
  await unmountApp()
  if (vite) await vite.close()
  if (dom) dom.window.close()
  for (const [name, descriptor] of originalGlobals) {
    if (descriptor) Object.defineProperty(globalThis, name, descriptor)
    else delete globalThis[name]
  }
})

test('Production App route entry, idle exit, and re-entry create isolated Sessions', async () => {
  assert.equal(frameHarness.getFrameHarnessStats().activeCallbacks, 0)
  await mountApp()
  assert.ok(container.querySelector('.title-screen'))
  assert.equal(activeHashChangeListeners.size, 1)

  let previous = await enterBattle()
  const firstSession = previous.session
  assert.equal(previous.latest.outcome, null)
  assert.equal(container.querySelectorAll('.battle-screen').length, 1)
  assert.ok(frameHarness.getFrameHarnessStats().activeCallbacks > 0)
  assert.equal(routeHarness.getCanvasHarnessStats().activeCanvases, 1)

  for (let cycle = 0; cycle < 10; cycle += 1) {
    await leaveBattle()
    assert.equal(frameHarness.getFrameHarnessStats().activeCallbacks, 0)
    assert.equal(routeHarness.getCanvasHarnessStats().activeCanvases, 0)
    assert.equal(container.querySelectorAll('.battle-screen').length, 0)

    const current = await enterBattle()
    assert.notEqual(current.session, previous.session)
    assert.notEqual(current.session.reducer, previous.session.reducer)
    assert.deepEqual(current.latest.units, current.session.initialState.units)
    assert.equal(current.latest.outcome, null)
    assert.ok(frameHarness.getFrameHarnessStats().activeCallbacks > 0)
    assert.equal(routeHarness.getCanvasHarnessStats().activeCanvases, 1)
    assert.equal(activeHashChangeListeners.size, 1)
    previous = current
  }

  assert.notEqual(previous.session, firstSession)
  await unmountApp()
  assert.equal(frameHarness.getFrameHarnessStats().activeCallbacks, 0)
  assert.equal(routeHarness.getCanvasHarnessStats().activeCanvases, 0)
  assert.equal(activeHashChangeListeners.size, 0)
  assert.equal(container.querySelectorAll('.battle-screen').length, 0)
})

test('Production Battle HUD follows the active unit and dispatches player commands', async () => {
  await mountApp()
  const record = await enterBattle()

  assert.equal(record.latest.activeUnit.id, 'assassin')
  assert.equal(container.querySelector('.battle-hud__identity h2').textContent, '奧黛')
  assert.match(container.querySelector('.battle-hud__identity').textContent, /刺客/)
  assert.match(container.querySelector('.battle-hud__resources').textContent, /75\s*\/\s*75/)
  assert.match(container.querySelector('.battle-hud__resources').textContent, /35\s*\/\s*35/)
  assert.equal(container.querySelectorAll('.battle-hud__attack-cell').length, 9)
  assert.equal(container.querySelector('.battle-hud__effects'), null)
  assert.equal(container.querySelectorAll('.battle-hud__attribute img').length, 3)
  assert.deepEqual(
    [...container.querySelectorAll('.battle-hud__attribute img')].map((image) => image.getAttribute('src').split('/').at(-1)),
    ['atk.png', 'mov.png', 'def.png'],
  )
  assert.equal(record.unitPresentations.get('assassin').showActiveIndicator, true)
  assert.equal(record.unitPresentations.get('assassin').showNameAndHealth, false)
  assert.equal(record.unitPresentations.get('goblin').showNameAndHealth, true)

  const portrait = container.querySelector('.battle-hud__portrait-image')
  assert.match(portrait.src, /%E5%A5%B3%E4%B8%BB/)
  await run(() => portrait.dispatchEvent(new dom.window.Event('error')))
  assert.equal(container.querySelector('.battle-hud__portrait-fallback').textContent, '立繪無法載入')

  await run(() => record.latest.clearSelection())
  assert.equal(container.querySelector('button[aria-label="移動"]'), null)
  await run(() => record.latest.selectUnit(record.latest.activeUnit.id))
  assert.ok(container.querySelector('button[aria-label="移動"]'))
  await run(() => container.querySelector('button[aria-label="移動"]').click())
  assert.equal(currentFor(record.session).latest.interactionMode, 'MOVE')
  await run(() => container.querySelector('button[aria-label="取消移動"]').click())
  assert.equal(currentFor(record.session).latest.interactionMode, 'COMMAND')
  await run(() => container.querySelector('button[aria-label="待命"]').click())

  assert.equal(currentFor(record.session).latest.activeUnit.id, 'knight')
  assert.equal(container.querySelector('.battle-hud__identity h2').textContent, '迪歐')
  assert.match(container.querySelector('.battle-hud__portrait-image').src, /%E7%94%B7%E4%B8%BB/)
  assert.equal(record.unitPresentations.get('assassin').showActiveIndicator, false)
  assert.equal(record.unitPresentations.get('knight').showActiveIndicator, true)

  await run(() => container.querySelector('button[aria-label="待命"]').click())
  const enemyTurn = await advanceRuntimeBattle(
    record,
    'DEFEAT',
    2400,
    (battle) => battle.activeUnit?.faction === 'enemy' && Boolean(battle.motion || battle.attackMotion),
  )
  assert.equal(enemyTurn.stopped, true)
  const enemyIndicators = [...record.unitPresentations.values()].filter((unit) => unit.showActiveIndicator)
  assert.equal(enemyIndicators.length, 1)
  assert.equal(enemyIndicators[0].faction, 'enemy')
  assert.equal(record.unitPresentations.get('knight').showActiveIndicator, false)

  await unmountApp()
  assert.equal(frameHarness.getFrameHarnessStats().activeCallbacks, 0)
})

test('Production Runtime Move and Player callbacks with colliding IDs stay bound to the old Session', async () => {
  await mountApp()
  const previous = await enterBattle()
  const oldPlayerAction = previous.latest.standby
  const oldMotionBattle = await startMove(previous)
  const oldMotion = oldMotionBattle.motion

  const deferredBeforeExit = deferredWork.scheduled
  await leaveBattle()
  assert.ok(deferredWork.scheduled > deferredBeforeExit)
  assert.equal(frameHarness.getFrameHarnessStats().activeCallbacks, 0)

  const current = await enterBattle()
  const newMotionBattle = await startMove(current)
  const newMotion = newMotionBattle.motion
  const newTurn = newMotionBattle.turn
  assert.equal(newMotion.motionId, oldMotion.motionId)
  assert.equal(newMotion.turnId, oldMotion.turnId)
  assert.equal(newMotion.unitId, oldMotion.unitId)

  await run(() => {
    oldMotionBattle.finishMove(oldMotion.unitId, oldMotion.motionId)
    oldMotionBattle.cancelMove(oldMotion.unitId, oldMotion.motionId)
    oldPlayerAction()
  })
  assert.equal(currentFor(current.session).latest.motion, newMotion)
  assert.equal(currentFor(current.session).latest.turn, newTurn)

  await unmountApp()
  assert.equal(frameHarness.getFrameHarnessStats().activeCallbacks, 0)
})

test('Production Runtime Attack callbacks with colliding IDs stay isolated before and after Impact', async () => {
  await mountApp()
  let previous = await enterBattle()
  let oldAttackBattle = await startAttack(previous)
  let oldAttack = oldAttackBattle.attackMotion
  const oldCallbacks = {
    impact: oldAttackBattle.impactAttack,
    complete: oldAttackBattle.completeAttack,
    abort: oldAttackBattle.abortAttack,
  }

  let deferredBeforeExit = deferredWork.scheduled
  await leaveBattle()
  assert.ok(deferredWork.scheduled > deferredBeforeExit)
  assert.equal(frameHarness.getFrameHarnessStats().activeCallbacks, 0)
  let current = await enterBattle()
  let newAttackBattle = await startAttack(current)
  let newAttack = newAttackBattle.attackMotion
  assert.equal(newAttack.attackId, oldAttack.attackId)
  assert.equal(newAttack.turnId, oldAttack.turnId)
  assert.equal(newAttack.attackerId, oldAttack.attackerId)
  assert.equal(newAttack.targetId, oldAttack.targetId)
  const untouchedHp = newAttackBattle.units.find((unit) => unit.id === newAttack.targetId).hp

  await run(() => {
    oldCallbacks.impact(oldAttack.attackId)
    oldCallbacks.complete(oldAttack.attackId)
    oldCallbacks.abort(oldAttack.attackId)
  })
  assert.equal(currentFor(current.session).latest.attackMotion, newAttack)
  assert.equal(
    currentFor(current.session).latest.units.find((unit) => unit.id === newAttack.targetId).hp,
    untouchedHp,
  )

  const impactMs = getImpactMs(ATTACK_ANIMATION_PROFILES[newAttack.animationType])
  await run(() => frameHarness.advanceFrame((impactMs + 1) / 1000))
  const impactedBattle = currentFor(current.session).latest
  assert.equal(impactedBattle.attackMotion?.phase, 'IMPACTED')
  const impactedCallbacks = {
    impact: impactedBattle.impactAttack,
    complete: impactedBattle.completeAttack,
    abort: impactedBattle.abortAttack,
  }
  oldAttack = impactedBattle.attackMotion

  deferredBeforeExit = deferredWork.scheduled
  await leaveBattle()
  assert.ok(deferredWork.scheduled > deferredBeforeExit)
  assert.equal(frameHarness.getFrameHarnessStats().activeCallbacks, 0)
  previous = await enterBattle()
  newAttackBattle = await startAttack(previous)
  newAttack = newAttackBattle.attackMotion
  assert.equal(newAttack.attackId, oldAttack.attackId)
  assert.equal(newAttack.targetId, oldAttack.targetId)
  const preImpactHp = newAttackBattle.units.find((unit) => unit.id === newAttack.targetId).hp

  await run(() => {
    impactedCallbacks.impact(oldAttack.attackId)
    impactedCallbacks.complete(oldAttack.attackId)
    impactedCallbacks.abort(oldAttack.attackId)
  })
  assert.equal(currentFor(previous.session).latest.attackMotion, newAttack)
  assert.equal(
    currentFor(previous.session).latest.units.find((unit) => unit.id === newAttack.targetId).hp,
    preImpactHp,
  )
  await unmountApp()
  assert.equal(frameHarness.getFrameHarnessStats().activeCallbacks, 0)
})

test('Production Runtime Enemy AI and Death callbacks cannot mutate a re-entered Session', async () => {
  await mountApp()
  let previous = await enterBattle()
  const enemyMotionResult = await advanceRuntimeBattle(
    previous,
    'DEFEAT',
    2400,
    (battle) => battle.activeUnit?.faction === 'enemy' && Boolean(battle.motion || battle.attackMotion),
  )
  assert.equal(enemyMotionResult.stopped, true)
  const oldEnemyAction = previous.aiCaptures.find(({ state }) =>
    state.turn.turnId === enemyMotionResult.battle.turn.turnId &&
    state.turn.activeUnitId === enemyMotionResult.battle.turn.activeUnitId)
  assert.ok(oldEnemyAction, 'expected the real AI Effect to capture an enemy-turn dispatch')

  let deferredBeforeExit = deferredWork.scheduled
  await leaveBattle()
  assert.ok(deferredWork.scheduled > deferredBeforeExit)
  assert.equal(frameHarness.getFrameHarnessStats().activeCallbacks, 0)
  let current = await enterBattle()
  const newEnemyMotionResult = await advanceRuntimeBattle(
    current,
    'DEFEAT',
    2400,
    (battle) => battle.activeUnit?.faction === 'enemy' && Boolean(battle.motion || battle.attackMotion),
  )
  assert.equal(newEnemyMotionResult.stopped, true)
  assert.equal(newEnemyMotionResult.battle.turn.turnId, enemyMotionResult.battle.turn.turnId)
  assert.equal(newEnemyMotionResult.battle.turn.activeUnitId, enemyMotionResult.battle.turn.activeUnitId)
  const newEnemyState = currentFor(current.session).latest

  const { dispatchAIControllerAction } = await import('../src/game/battle/battle.ai.gateway.ts')
  await run(() => dispatchAIControllerAction(oldEnemyAction.state, oldEnemyAction.dispatch))
  assert.equal(currentFor(current.session).latest.motion, newEnemyState.motion)
  assert.equal(currentFor(current.session).latest.attackMotion, newEnemyState.attackMotion)
  assert.equal(currentFor(current.session).latest.turn, newEnemyState.turn)

  deferredBeforeExit = deferredWork.scheduled
  await leaveBattle()
  assert.ok(deferredWork.scheduled > deferredBeforeExit)
  current = await enterBattle()
  const firstDeath = await advanceRuntimeBattle(
    current,
    'DEFEAT',
    2400,
    (battle) => battle.deathMotions.length > 0,
  )
  assert.equal(firstDeath.stopped, true)
  const oldDeathBattle = currentFor(current.session).latest
  const oldDeath = oldDeathBattle.deathMotions[0]
  const oldImpact = oldDeathBattle.confirmedImpacts[0]
  assert.ok(oldDeath)
  assert.ok(oldImpact)

  deferredBeforeExit = deferredWork.scheduled
  await leaveBattle()
  assert.ok(deferredWork.scheduled > deferredBeforeExit)
  const reentered = await enterBattle()
  const newDeathResult = await advanceRuntimeBattle(
    reentered,
    'DEFEAT',
    2400,
    (battle) => battle.deathMotions.length > 0,
  )
  assert.equal(newDeathResult.stopped, true)
  const newDeathBattle = currentFor(reentered.session).latest
  const newDeath = newDeathBattle.deathMotions[0]
  const newImpact = newDeathBattle.confirmedImpacts[0]
  assert.equal(newDeath.deathId, oldDeath.deathId)
  assert.equal(newDeath.unitId, oldDeath.unitId)
  assert.equal(newImpact.impactId, oldImpact.impactId)

  await run(() => {
    oldDeathBattle.completeDeath(oldDeath.deathId, oldDeath.unitId)
    oldDeathBattle.abortDeath(oldDeath.deathId, oldDeath.unitId)
    oldDeathBattle.consumeImpact(oldImpact.impactId)
  })
  assert.equal(currentFor(reentered.session).latest.deathMotions[0], newDeath)
  assert.equal(currentFor(reentered.session).latest.confirmedImpacts[0], newImpact)
  await unmountApp()
  assert.equal(frameHarness.getFrameHarnessStats().activeCallbacks, 0)
})

test('Production Runtime Outcome, Overlay, and Restart use the configured battle Session', async () => {
  await mountApp()
  let record = await enterBattle()

  const victory = await advanceRuntimeBattle(record, 'VICTORY')
  assert.equal(victory, 'VICTORY')
  assert.equal(currentFor(record.session).latest.outcome, 'VICTORY')
  assert.ok(container.querySelector('.battle-result-dialog-victory'))
  record = await restartFromOutcome(record)

  const defeat = await advanceRuntimeBattle(record, 'DEFEAT')
  assert.equal(defeat, 'DEFEAT')
  assert.equal(currentFor(record.session).latest.outcome, 'DEFEAT')
  assert.ok(container.querySelector('.battle-result-dialog-defeat'))
  record = await restartFromOutcome(record)

  const activeCallbacksAfterRestart = frameHarness.getFrameHarnessStats().activeCallbacks
  for (let restart = 2; restart < 10; restart += 1) {
    const terminal = await advanceRuntimeBattle(record, 'DEFEAT')
    assert.equal(terminal, 'DEFEAT')
    assert.ok(container.querySelector('.battle-result-dialog-defeat'))
    record = await restartFromOutcome(record)
    assert.equal(frameHarness.getFrameHarnessStats().activeCallbacks, activeCallbacksAfterRestart)
    assert.equal(routeHarness.getCanvasHarnessStats().activeCanvases, 1)
  }

  await unmountApp()
  assert.equal(frameHarness.getFrameHarnessStats().activeCallbacks, 0)
  assert.equal(container.querySelectorAll('.battle-screen').length, 0)
})

test('Production Route unmounts terminal Victory and Defeat Overlays without leaking old Session callbacks', async () => {
  await mountApp()
  let record = await enterBattle()
  record = await verifyTerminalRouteUnmount(record, 'VICTORY', '.battle-result-dialog-victory')
  record = await verifyTerminalRouteUnmount(record, 'DEFEAT', '.battle-result-dialog-defeat')

  await unmountApp()
  assert.equal(frameHarness.getFrameHarnessStats().activeCallbacks, 0)
  assert.equal(container.querySelectorAll('.battle-screen').length, 0)
})
