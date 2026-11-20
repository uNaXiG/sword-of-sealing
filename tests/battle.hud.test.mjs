import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { JSDOM } from 'jsdom'
import { Object3D, OrthographicCamera } from 'three'
import { getAttackableTiles } from '../src/game/battle/battle.attack.ts'
import { INITIAL_UNITS } from '../src/game/battle/battle.data.ts'
import { createBattleUnit } from '../src/game/classes/class.factory.ts'
import {
  BATTLE_ATTRIBUTE_PRESENTATION,
  createAttackPreviewGrid,
  canInspectUnit,
  canShowBattleActionRadial,
  formatTimelineActionValue,
  getBattleAssetUrl,
  getCharacterArtUrl,
  getPortraitUrl,
  getProgressPercentage,
  selectBattleTimeline,
  selectBattleHudCharacter,
  selectBattleDamageForecast,
  selectInspectedUnit,
  selectBattleCombatFeedback,
} from '../src/features/battle/battleHud.ts'
import { calculatePhysicalDamage } from '../src/game/battle/battle.damage.ts'
import { attachBattleContextShortcut } from '../src/features/battle/battlePointerInteraction.ts'
import { initializeTurnState, predictUpcomingTurns } from '../src/game/battle/battle.turn.ts'
import { calculateTimelineCapacity, observeTimelineCapacity } from '../src/features/battle/battleTimelineLayout.ts'
import { calculateRadialScreenPosition } from '../src/features/battle/battleRadialMenuProjection.ts'

test('HUD derives named player portraits and status values from the selected BattleUnit', () => {
  const audrey = INITIAL_UNITS.find((unit) => unit.id === 'assassin')
  const dio = INITIAL_UNITS.find((unit) => unit.id === 'knight')
  const character = selectBattleHudCharacter(audrey, '/sword-of-sealing/')

  assert.equal(audrey.name, '奧黛')
  assert.equal(dio.name, '迪歐')
  assert.equal(character.displayName, '奧黛')
  assert.equal(character.className, '刺客')
  assert.equal(character.unitClass, 'assassin')
  assert.equal(character.currentHp, audrey.hp)
  assert.equal(character.maxHp, audrey.maxHp)
  assert.equal(character.currentSp, audrey.sp)
  assert.equal(character.maxSp, audrey.maxSp)
  assert.equal(character.attack, audrey.atk)
  assert.equal(character.defense, audrey.def)
  assert.equal(character.movement, audrey.movementPoints)
  assert.equal(
    character.portraitUrl,
    '/sword-of-sealing/assets/images/battle/%E5%A5%B3%E4%B8%BB.png',
  )
  assert.equal(
    character.characterArtUrl,
    '/sword-of-sealing/assets/images/cg/hero/%E5%A5%B3%E4%B8%BB-%E6%88%B0%E9%AC%A51.png',
  )
  assert.deepEqual(
    BATTLE_ATTRIBUTE_PRESENTATION.map((attribute) => ({
      key: attribute.key,
      iconPath: attribute.iconPath,
      value: character[attribute.key],
    })),
    [
      { key: 'attack', iconPath: 'assets/images/ui/atk.png', value: audrey.atk },
      { key: 'movement', iconPath: 'assets/images/ui/mov.png', value: audrey.movementPoints },
      { key: 'defense', iconPath: 'assets/images/ui/def.png', value: audrey.def },
    ],
  )
})

test('unit portraits map by class and asset paths preserve the Vite base path', () => {
  const audrey = INITIAL_UNITS.find((unit) => unit.id === 'assassin')
  const dio = INITIAL_UNITS.find((unit) => unit.id === 'knight')
  const goblin = INITIAL_UNITS.find((unit) => unit.id === 'goblin')
  const character = selectBattleHudCharacter(goblin, '/sword-of-sealing/')

  assert.equal(character.faction, 'enemy')
  assert.equal(
    character.portraitUrl,
    '/sword-of-sealing/assets/images/battle/%E5%93%A5%E5%B8%83%E6%9E%97.png',
  )
  assert.equal(getPortraitUrl(audrey, '/sword-of-sealing/'), '/sword-of-sealing/assets/images/battle/%E5%A5%B3%E4%B8%BB.png')
  assert.equal(getPortraitUrl(dio, '/sword-of-sealing/'), '/sword-of-sealing/assets/images/battle/%E7%94%B7%E4%B8%BB.png')
  assert.equal(
    getCharacterArtUrl(dio, '/sword-of-sealing/'),
    '/sword-of-sealing/assets/images/cg/hero/%E7%94%B7%E4%B8%BB-%E6%88%B0%E9%AC%A51.png',
  )
  assert.equal(character.characterArtUrl, character.portraitUrl)
  assert.equal(getPortraitUrl({ ...audrey, id: 'enemy-assassin', faction: 'enemy' }, '/'), null)
  assert.equal(getBattleAssetUrl('/sword-of-sealing/', '/assets/images/ui/attack.png'), '/sword-of-sealing/assets/images/ui/attack.png')
  assert.equal(getBattleAssetUrl('/', 'assets/images/ui/move.png'), '/assets/images/ui/move.png')
  assert.equal(getBattleAssetUrl('/sword-of-sealing/', 'assets/images/ui/down.png'), '/sword-of-sealing/assets/images/ui/down.png')
})

test('inspected unit stays presentation-only and falls back when it is no longer alive', () => {
  const active = INITIAL_UNITS.find((unit) => unit.id === 'assassin')
  const enemy = INITIAL_UNITS.find((unit) => unit.id === 'goblin')
  const fallenEnemy = { ...enemy, hp: 0 }

  assert.equal(selectInspectedUnit(INITIAL_UNITS, enemy.id, active.id), enemy)
  assert.equal(selectInspectedUnit([active, fallenEnemy], enemy.id, active.id), active)
  assert.equal(selectInspectedUnit([fallenEnemy], enemy.id, active.id), null)
  assert.equal(active.id, 'assassin')
})

test('damage forecast uses the formal damage calculation and reports bounded remaining HP', () => {
  const attacker = INITIAL_UNITS.find((unit) => unit.id === 'assassin')
  const target = { ...INITIAL_UNITS.find((unit) => unit.id === 'goblin'), hp: 3 }
  const expected = calculatePhysicalDamage(attacker, target)
  const forecast = selectBattleDamageForecast(attacker, target)

  assert.deepEqual(forecast, {
    targetId: target.id,
    damage: expected.damage,
    currentHp: target.hp,
    remainingHp: expected.remainingHp,
    remainingPercentage: 0,
    damagePercentage: 5,
  })
  assert.equal(forecast.remainingHp, 0)
})

test('damage forecast segments exclude previously lost HP and clamp to the current HP', () => {
  const attacker = INITIAL_UNITS.find((unit) => unit.id === 'assassin')
  const goblin = INITIAL_UNITS.find((unit) => unit.id === 'goblin')
  const full = selectBattleDamageForecast(attacker, goblin)
  const wounded = selectBattleDamageForecast(attacker, { ...goblin, hp: 40 })
  const overMaximum = selectBattleDamageForecast(attacker, { ...goblin, hp: 80 })
  const invalidMaximum = selectBattleDamageForecast(attacker, { ...goblin, maxHp: 0 })

  assert.equal(full.remainingHp, 37)
  assert.ok(Math.abs(full.remainingPercentage - 37 / 60 * 100) < 1e-10)
  assert.ok(Math.abs(full.damagePercentage - 23 / 60 * 100) < 1e-10)
  assert.equal(wounded.remainingHp, 17)
  assert.ok(Math.abs(wounded.remainingPercentage - 17 / 60 * 100) < 1e-10)
  assert.ok(Math.abs(wounded.damagePercentage - 23 / 60 * 100) < 1e-10)
  assert.ok(overMaximum.remainingPercentage + overMaximum.damagePercentage <= 100)
  assert.equal(invalidMaximum.remainingPercentage, 0)
  assert.equal(invalidMaximum.damagePercentage, 0)
})

test('right-click shortcut distinguishes a stationary click from a camera drag', () => {
  const dom = new JSDOM('<canvas></canvas>')
  const canvas = dom.window.document.querySelector('canvas')
  const calls = []
  const cleanup = attachBattleContextShortcut(canvas, () => calls.push('right-click'))
  const dispatchPointer = (type, { button = 2, pointerId = 1, x = 10, y = 10 } = {}) => {
    const event = new dom.window.MouseEvent(type, {
      bubbles: true,
      cancelable: true,
      button,
      clientX: x,
      clientY: y,
    })
    Object.defineProperty(event, 'pointerId', { value: pointerId })
    canvas.dispatchEvent(event)
  }

  dispatchPointer('pointerdown')
  dispatchPointer('pointerup')
  assert.deepEqual(calls, ['right-click'])

  dispatchPointer('pointerdown')
  dispatchPointer('pointermove', { x: 15 })
  dispatchPointer('pointerup', { x: 15 })
  assert.deepEqual(calls, ['right-click', 'right-click'])

  dispatchPointer('pointerdown')
  dispatchPointer('pointermove', { x: 16 })
  dispatchPointer('pointerup', { x: 16 })
  assert.deepEqual(calls, ['right-click', 'right-click'])

  const contextMenu = new dom.window.MouseEvent('contextmenu', { cancelable: true })
  canvas.dispatchEvent(contextMenu)
  assert.equal(contextMenu.defaultPrevented, true)
  cleanup()
  dispatchPointer('pointerdown')
  dispatchPointer('pointerup')
  assert.deepEqual(calls, ['right-click', 'right-click'])
  dom.window.close()
})

test('inspection policy blocks MOVE mode and radial authorization requires the displayed active unit', () => {
  const active = INITIAL_UNITS.find((unit) => unit.id === 'assassin')

  assert.equal(canInspectUnit('COMMAND', false), true)
  assert.equal(canInspectUnit('ATTACK', false), true)
  assert.equal(canInspectUnit('MOVE', false), false)
  assert.equal(canInspectUnit('COMMAND', true), false)
  assert.equal(canShowBattleActionRadial({
    activeUnit: active,
    selectedUnitId: active.id,
    displayUnitId: active.id,
    interactionMode: 'COMMAND',
    battleBusy: false,
    pendingTurnCompletion: false,
  }), true)
  assert.equal(canShowBattleActionRadial({
    activeUnit: active,
    selectedUnitId: active.id,
    displayUnitId: 'goblin',
    interactionMode: 'COMMAND',
    battleBusy: false,
    pendingTurnCompletion: false,
  }), false)
  assert.equal(canShowBattleActionRadial({
    activeUnit: active,
    selectedUnitId: active.id,
    displayUnitId: active.id,
    interactionMode: 'ATTACK',
    battleBusy: false,
    pendingTurnCompletion: false,
  }), false)
})

test('timeline capacity only exposes complete cards at desktop and compact sizes', () => {
  assert.equal(calculateTimelineCapacity(68, 68, 6), 1)
  assert.equal(calculateTimelineCapacity(401, 68, 6), 5)
  assert.equal(calculateTimelineCapacity(585, 68, 6), 7)
  assert.equal(calculateTimelineCapacity(586, 68, 6), 8)
  assert.equal(calculateTimelineCapacity(317, 48, 6), 5)
  assert.equal(calculateTimelineCapacity(318, 48, 6), 6)
  assert.equal(calculateTimelineCapacity(1000, 68, 6), 8)
  assert.equal(calculateTimelineCapacity(20, 68, 6), 0)

  const dom = new JSDOM('<div id="available-space"></div>')
  const element = dom.window.document.querySelector('#available-space')
  element.style.setProperty('--turn-card-size', '68px')
  element.style.setProperty('--turn-card-gap', '6px')
  let width = 401
  Object.defineProperty(element, 'clientWidth', { get: () => width })
  let resizeCallback
  let observed = false
  let disconnected = false
  let capacity = 0
  const cleanup = observeTimelineCapacity(
    element,
    (nextCapacity) => { capacity = nextCapacity },
    (callback) => {
      resizeCallback = callback
      return {
        observe: () => { observed = true },
        disconnect: () => { disconnected = true },
      }
    },
  )

  assert.equal(observed, true)
  assert.equal(capacity, 5)
  width = 215
  resizeCallback([], {})
  assert.equal(capacity, 2)
  cleanup()
  assert.equal(disconnected, true)
})

test('radial menu projection follows the world anchor and clamps to the viewport', () => {
  const camera = new OrthographicCamera(-5, 5, 5, -5, 0.1, 100)
  camera.position.set(0, 0, 10)
  camera.lookAt(0, 0, 0)
  camera.updateProjectionMatrix()
  camera.updateMatrixWorld()
  const object = new Object3D()
  object.position.set(-3, 3, 0)
  object.updateMatrixWorld()
  const size = { width: 800, height: 600 }
  const first = calculateRadialScreenPosition(object, camera, size)
  object.position.set(4, -4, 0)
  object.updateMatrixWorld()
  const second = calculateRadialScreenPosition(object, camera, size)

  assert.ok(first[0] >= 122 && first[0] <= 678)
  assert.ok(first[1] >= 122 && first[1] <= 478)
  assert.ok(second[0] > first[0])
  assert.ok(second[1] > first[1])

  const reserved = [{ left: 390, top: 30, right: 800, bottom: 120 }]
  const avoided = calculateRadialScreenPosition(object, camera, size, undefined, reserved)
  assert.ok(
    avoided[0] + 112 <= reserved[0].left ||
    avoided[0] - 112 >= reserved[0].right ||
    avoided[1] + 112 <= reserved[0].top ||
    avoided[1] - 112 >= reserved[0].bottom,
  )

  object.position.set(0, 0.85, 0)
  object.updateMatrixWorld()
  const landscape = { width: 845, height: 390 }
  const landscapeReserved = [
    { left: 482, top: 48, right: 838, bottom: 126 },
    { left: 8, top: 270, right: 838, bottom: 382 },
  ]
  const landscapePosition = calculateRadialScreenPosition(
    object,
    camera,
    landscape,
    undefined,
    landscapeReserved,
  )
  assert.equal(landscapeReserved.some((rect) => !(
    landscapePosition[0] + 112 <= rect.left ||
    landscapePosition[0] - 112 >= rect.right ||
    landscapePosition[1] + 112 <= rect.top ||
    landscapePosition[1] - 112 >= rect.bottom
  )), false)

  const k2 = { width: 2560, height: 1440 }
  const k2Position = calculateRadialScreenPosition(
    new Object3D(),
    camera,
    k2,
  )
  assert.ok(k2Position[0] >= 138)
  assert.ok(k2Position[1] >= 138)
  assert.ok(k2Position[0] <= k2.width - 138)
  assert.ok(k2Position[1] <= k2.height - 138)
})

test('turn timeline uses PAS order and values, caps at eight, and never fills missing entries', () => {
  const turn = initializeTurnState(INITIAL_UNITS)
  const upcoming = predictUpcomingTurns(turn, INITIAL_UNITS, 12)
  const timeline = selectBattleTimeline(turn, INITIAL_UNITS, upcoming, '/sword-of-sealing/')

  assert.equal(timeline.length, 8)
  assert.equal(timeline[0].unit.id, turn.activeUnitId)
  assert.equal(timeline[0].isActive, true)
  assert.equal(timeline[0].actionValue, 0)
  for (const [index, entry] of timeline.slice(1).entries()) {
    assert.equal(entry.unit.id, upcoming[index].unitId)
    assert.equal(entry.actionValue, upcoming[index].timeOffset)
  }
  const goblinEntries = timeline.filter((entry) => entry.unit.id.startsWith('goblin'))
  assert.ok(goblinEntries.length > 0)
  assert.equal(new Set(goblinEntries.map((entry) => entry.portraitUrl)).size, 1)

  const singleUnit = selectBattleTimeline(turn, INITIAL_UNITS, [], '/')
  assert.equal(singleUnit.length, 1)

  const missingValue = selectBattleTimeline(turn, INITIAL_UNITS, [{
    ...upcoming[0],
    timeOffset: Number.NaN,
  }], '/')
  assert.equal(missingValue[1].actionValue, null)
})

test('enemy timeline entries retain enemy faction for fixed red frame presentation', () => {
  const turn = initializeTurnState(INITIAL_UNITS)
  const upcoming = predictUpcomingTurns(turn, INITIAL_UNITS, 12)
  const timeline = selectBattleTimeline(turn, INITIAL_UNITS, upcoming, '/')
  const enemyEntries = timeline.filter((entry) => entry.unit.faction === 'enemy')

  assert.ok(enemyEntries.length > 0)
  assert.ok(enemyEntries.every((entry) => entry.unit.faction === 'enemy'))
})

test('timeline action values display as integers without changing underlying PAS values', () => {
  assert.equal(formatTimelineActionValue(0), '0')
  assert.equal(formatTimelineActionValue(33.33), '33')
  assert.equal(formatTimelineActionValue(66.67), '67')
  assert.equal(formatTimelineActionValue(133.5), '134')
  assert.equal(formatTimelineActionValue(null), '待補')
  assert.equal(formatTimelineActionValue(Number.NaN), '待補')
})

test('2K HUD keeps HP SP origins while restoring right-column spacing', () => {
  const css = readFileSync(new URL('../src/features/battle/components/BattleHUD.css', import.meta.url), 'utf8')
  assert.match(css, /grid-template-columns: minmax\(0, 1fr\) 168px 168px/)
  assert.match(css, /@media \(min-width: 2100px\)[\s\S]*\.battle-hud__resources \{\s*max-width: none;\s*margin-left: 0;\s*\}/)
  assert.doesNotMatch(css, /選取目前角色以使用指令/)
})

test('resource bar percentages stay valid for depleted, excessive, and invalid input', () => {
  assert.equal(getProgressPercentage(30, 60), 50)
  assert.equal(getProgressPercentage(-10, 60), 0)
  assert.equal(getProgressPercentage(80, 60), 100)
  assert.equal(getProgressPercentage(Number.NaN, 60), 0)
  assert.equal(getProgressPercentage(10, 0), 0)
})

test('combat feedback is a presentation-only independent banner message', () => {
  assert.equal(selectBattleCombatFeedback({
    combatFeedback: '奧黛 對 哥布林 A 造成 23 點傷害',
  }), '奧黛 對 哥布林 A 造成 23 點傷害')

  assert.equal(selectBattleCombatFeedback({
    combatFeedback: null,
  }), null)
})

test('attack preview grid uses the same legal tiles as the battle attack rules', () => {
  const ranger = createBattleUnit({
    id: 'preview-ranger',
    class: 'ranger',
    faction: 'player',
    position: { column: 0, row: 0 },
  })
  const grid = createAttackPreviewGrid(ranger)
  const size = ranger.attackRange * 2 + 1
  const center = { column: ranger.attackRange, row: ranger.attackRange }
  const expected = getAttackableTiles({ ...ranger, position: center }, size)
    .map(({ column, row }) => `${column},${row}`)
    .sort()
  const actual = grid
    .filter((cell) => cell.kind === 'attack')
    .map(({ column, row }) => `${column},${row}`)
    .sort()

  assert.equal(grid.length, size * size)
  assert.deepEqual(actual, expected)
  assert.equal(grid.find((cell) => cell.kind === 'center').column, center.column)
  assert.equal(grid.some((cell) => cell.kind === 'center' && cell.row !== center.row), false)
})
