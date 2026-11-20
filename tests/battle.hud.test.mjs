import test from 'node:test'
import assert from 'node:assert/strict'
import { getAttackableTiles } from '../src/game/battle/battle.attack.ts'
import { INITIAL_UNITS } from '../src/game/battle/battle.data.ts'
import { createBattleUnit } from '../src/game/classes/class.factory.ts'
import {
  BATTLE_ATTRIBUTE_PRESENTATION,
  createAttackPreviewGrid,
  getBattleAssetUrl,
  getPortraitUrl,
  getProgressPercentage,
  selectBattleTimeline,
  selectBattleHudCharacter,
  selectInspectedUnit,
} from '../src/features/battle/battleHud.ts'
import { initializeTurnState, predictUpcomingTurns } from '../src/game/battle/battle.turn.ts'

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

test('resource bar percentages stay valid for depleted, excessive, and invalid input', () => {
  assert.equal(getProgressPercentage(30, 60), 50)
  assert.equal(getProgressPercentage(-10, 60), 0)
  assert.equal(getProgressPercentage(80, 60), 100)
  assert.equal(getProgressPercentage(Number.NaN, 60), 0)
  assert.equal(getProgressPercentage(10, 0), 0)
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
