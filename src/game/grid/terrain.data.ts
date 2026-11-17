import type { BattleObstacle } from '../battle/obstacles'
import { cellKey } from './grid.utils.ts'
import type { Cell } from './grid.types'
import { TerrainType } from './terrain.types.ts'

const TERRAIN_BY_CELL: Readonly<Record<string, TerrainType>> = {
  '0,5': TerrainType.PLAIN,
  '0,6': TerrainType.PLAIN,
  '1,6': TerrainType.PLAIN,
  '0,0': TerrainType.FOREST,
  '0,1': TerrainType.FOREST,
  '1,0': TerrainType.FOREST,
  '1,1': TerrainType.FOREST,
  '2,0': TerrainType.FOREST,
  '1,2': TerrainType.FOREST,
  '6,0': TerrainType.SHALLOW_WATER,
  '7,0': TerrainType.SHALLOW_WATER,
  '6,1': TerrainType.SHALLOW_WATER,
  '7,1': TerrainType.SHALLOW_WATER,
  '7,2': TerrainType.SHALLOW_WATER,
  '6,2': TerrainType.SHALLOW_WATER,
}

export function getTerrainType(cell: Cell, obstacles: readonly BattleObstacle[] = []): TerrainType {
  const obstacle = obstacles.find(({ position }) => position.x === cell.column && position.y === cell.row)
  if (obstacle?.type === 'rock') return TerrainType.ROCK
  if (obstacle?.type === 'wall') return TerrainType.WALL
  if (obstacle?.type === 'tree') return TerrainType.FOREST
  return TERRAIN_BY_CELL[cellKey(cell)] ?? TerrainType.GRASS
}
