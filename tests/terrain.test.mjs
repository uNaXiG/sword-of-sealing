import test from 'node:test'
import assert from 'node:assert/strict'
import { INITIAL_UNITS } from '../src/game/battle/battle.data.ts'
import { INITIAL_OBSTACLES } from '../src/game/battle/obstacles.ts'
import { TERRAIN_MOVEMENT_COST } from '../src/game/grid/terrain.constants.ts'
import { getTerrainType } from '../src/game/grid/terrain.data.ts'
import { TerrainType } from '../src/game/grid/terrain.types.ts'

test('地形移動成本集中設定且符合各地形規則', () => {
  assert.equal(TERRAIN_MOVEMENT_COST[TerrainType.PLAIN], 1)
  assert.equal(TERRAIN_MOVEMENT_COST[TerrainType.GRASS], 1)
  assert.equal(TERRAIN_MOVEMENT_COST[TerrainType.FOREST], 2)
  assert.equal(TERRAIN_MOVEMENT_COST[TerrainType.SHALLOW_WATER], 2)
  assert.equal(TERRAIN_MOVEMENT_COST[TerrainType.ROCK], Number.POSITIVE_INFINITY)
  assert.equal(TERRAIN_MOVEMENT_COST[TerrainType.WALL], Number.POSITIVE_INFINITY)
})

test('初始地形可視化資料不覆蓋角色，靜態障礙依類型呈現地形', () => {
  const occupied = new Set(INITIAL_UNITS.map(({ position }) => `${position.column},${position.row}`))
  const terrainCells = ['0,5', '0,6', '1,6', '0,0', '0,1', '1,0', '1,1', '2,0', '1,2', '6,0', '7,0', '6,1', '7,1', '7,2', '6,2']
  assert.equal(terrainCells.some((cell) => occupied.has(cell)), false)
  assert.equal(getTerrainType({ column: 0, row: 0 }), TerrainType.FOREST)
  assert.equal(getTerrainType({ column: 7, row: 0 }), TerrainType.SHALLOW_WATER)

  for (const obstacle of INITIAL_OBSTACLES) {
    const terrain = getTerrainType({ column: obstacle.position.x, row: obstacle.position.y }, INITIAL_OBSTACLES)
    if (obstacle.type === 'rock') assert.equal(terrain, TerrainType.ROCK)
    if (obstacle.type === 'wall') assert.equal(terrain, TerrainType.WALL)
    if (obstacle.type === 'tree') assert.equal(terrain, TerrainType.FOREST)
  }
})
