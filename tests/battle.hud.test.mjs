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
  selectBattleHudCharacter,
} from '../src/features/battle/battleHud.ts'

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
  assert.equal(character.portraitUrl, getPortraitUrl('assassin', '/sword-of-sealing/'))
  assert.equal(
    character.portraitUrl,
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

test('enemy HUD data has no player portrait and asset paths preserve the Vite base path', () => {
  const goblin = INITIAL_UNITS.find((unit) => unit.id === 'goblin')
  const character = selectBattleHudCharacter(goblin, '/sword-of-sealing/')

  assert.equal(character.faction, 'enemy')
  assert.equal(character.portraitUrl, null)
  assert.equal(getPortraitUrl('goblin', '/sword-of-sealing/'), null)
  assert.equal(getBattleAssetUrl('/sword-of-sealing/', '/assets/images/ui/attack.png'), '/sword-of-sealing/assets/images/ui/attack.png')
  assert.equal(getBattleAssetUrl('/', 'assets/images/ui/move.png'), '/assets/images/ui/move.png')
  assert.equal(getBattleAssetUrl('/sword-of-sealing/', 'assets/images/ui/down.png'), '/sword-of-sealing/assets/images/ui/down.png')
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
