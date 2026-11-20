import test from 'node:test'
import assert from 'node:assert/strict'
import { CLASS_DEFINITIONS, UNIT_CLASSES, validateClassDefinition } from '../src/game/classes/class.data.ts'
import { createBattleUnit } from '../src/game/classes/class.factory.ts'
import { INITIAL_UNITS } from '../src/game/battle/battle.data.ts'
import { INITIAL_OBSTACLES } from '../src/game/battle/obstacles.ts'
import { createBattleState } from '../src/game/battle/battle.state.ts'
import { getTerrainType } from '../src/game/grid/terrain.data.ts'
import { TerrainType } from '../src/game/grid/terrain.types.ts'

const expectedStats = {
  knight: ['劍士', 100, 30, 20, 10, 10, 4, 'SQUARE', 1, 1],
  assassin: ['刺客', 75, 35, 28, 5, 15, 6, 'SQUARE', 1, 1],
  mage: ['法師', 65, 60, 12, 6, 10, 3, 'CROSS', 2, 1],
  cleric: ['牧師', 80, 70, 24, 6, 12, 3, 'CROSS', 2, 1],
  ranger: ['遊俠', 80, 40, 18, 5, 12, 5, 'DIAMOND_RING', 3, 3],
  goblin: ['哥布林', 60, 15, 15, 5, 10, 3, 'DIAMOND', 1, 1],
}

function definitionValues(definition) {
  return [definition.name, definition.maxHp, definition.maxSp, definition.atk, definition.def, definition.agi,
    definition.movementPoints, definition.attackPattern, definition.attackRange, definition.minAttackRange]
}

test('職業 Registry 包含六種職業且 key、名稱與基礎屬性正確', () => {
  assert.deepEqual(Object.keys(CLASS_DEFINITIONS), UNIT_CLASSES)
  for (const type of UNIT_CLASSES) {
    const definition = CLASS_DEFINITIONS[type]
    assert.equal(definition.type, type)
    assert.deepEqual(definitionValues(definition), expectedStats[type])
    assert.doesNotThrow(() => validateClassDefinition(definition))
  }
})

test('Factory 以職業模板建立獨立 HP、SP、屬性與座標資料', () => {
  const position = { column: 2, row: 5 }
  const first = createBattleUnit({ id: 'goblin-a', class: 'goblin', faction: 'enemy', position })
  const second = createBattleUnit({ id: 'goblin-b', class: 'goblin', faction: 'enemy', position, name: '護衛' })
  assert.equal(first.name, '哥布林')
  assert.equal(second.name, '護衛')
  assert.equal(first.hp, first.maxHp)
  assert.equal(first.sp, first.maxSp)
  assert.notEqual(first.position, second.position)
  assert.notEqual(first.position, position)
  first.hp = 1
  first.sp = 2
  first.position.column = 0
  assert.equal(second.hp, 60)
  assert.equal(second.sp, 15)
  assert.equal(CLASS_DEFINITIONS.goblin.maxHp, 60)
})

test('Factory 允許職業與陣營任意組合並拒絕未知職業', () => {
  assert.equal(createBattleUnit({ id: 'enemy-knight', class: 'knight', faction: 'enemy', position: { column: 0, row: 0 } }).faction, 'enemy')
  assert.throws(() => createBattleUnit({ id: 'invalid', class: 'archer', faction: 'player', position: { column: 0, row: 0 } }), /Unknown unit class/)
})

test('職業模板拒絕不合法屬性、距離與攻擊模式', () => {
  const base = CLASS_DEFINITIONS.knight
  assert.throws(() => validateClassDefinition({ ...base, maxHp: 0 }), /Invalid class attributes/)
  assert.throws(() => validateClassDefinition({ ...base, maxSp: -1 }), /Invalid class attributes/)
  assert.throws(() => validateClassDefinition({ ...base, attackPattern: 'UNKNOWN' }), /Invalid attack pattern/)
  assert.throws(() => validateClassDefinition({ ...base, minAttackRange: 2 }), /interval/)
})

test('Battle State 驗證 SP、AGI、職業與攻擊模式欄位', () => {
  const unit = createBattleUnit({ id: 'mage', class: 'mage', faction: 'player', position: { column: 2, row: 2 } })
  for (const changes of [
    { sp: -1 }, { sp: unit.maxSp + 1 }, { maxSp: -1 }, { agi: -1 }, { agi: 1.5 },
    { movementPoints: -1 }, { attackPattern: 'LINE' }, { class: 'rogue' },
    { minAttackRange: 0 }, { minAttackRange: 3 },
  ]) {
    assert.throws(() => createBattleState([{ ...unit, ...changes }]))
  }
})

test('初始戰場配置奧黛與迪歐及原有三名敵方且位置全部合法', () => {
  const state = createBattleState(INITIAL_UNITS, INITIAL_OBSTACLES)
  const players = state.units.filter((unit) => unit.faction === 'player')
  const enemies = state.units.filter((unit) => unit.faction === 'enemy')
  assert.equal(state.units.length, 5)
  assert.deepEqual(players.map(({ id, name }) => [id, name]), [
    ['knight', '迪歐'],
    ['assassin', '奧黛'],
  ])
  assert.deepEqual(players.map(({ class: unitClass }) => unitClass), ['knight', 'assassin'])
  assert.equal(new Set(state.units.map((unit) => unit.id)).size, state.units.length)
  assert.equal(state.units.filter((unit) => unit.faction === 'enemy').length, 3)
  assert.deepEqual(enemies.map(({ id, class: unitClass, name }) => [id, unitClass, name]), [
    ['goblin', 'goblin', '哥布林 A'],
    ['goblin-b', 'goblin', '哥布林 B'],
    ['goblin-c', 'goblin', '哥布林 C'],
  ])
  for (const unit of state.units) {
    assert.notEqual(getTerrainType(unit.position, INITIAL_OBSTACLES), TerrainType.ROCK)
    assert.notEqual(getTerrainType(unit.position, INITIAL_OBSTACLES), TerrainType.WALL)
    assert.equal(unit.hp, unit.maxHp)
    assert.equal(unit.sp, unit.maxSp)
  }
})
