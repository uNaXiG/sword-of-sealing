import { TerrainType } from './terrain.types.ts'

export const TERRAIN_MOVEMENT_COST: Readonly<Record<TerrainType, number>> = {
  [TerrainType.PLAIN]: 1,
  [TerrainType.GRASS]: 1,
  [TerrainType.FOREST]: 2,
  [TerrainType.SHALLOW_WATER]: 2,
  [TerrainType.ROCK]: Number.POSITIVE_INFINITY,
  [TerrainType.WALL]: Number.POSITIVE_INFINITY,
}

export const TERRAIN_COLORS: Readonly<Record<TerrainType, string>> = {
  [TerrainType.PLAIN]: '#c8b994',
  [TerrainType.GRASS]: '#81b878',
  [TerrainType.FOREST]: '#4f8057',
  [TerrainType.SHALLOW_WATER]: '#78b9d1',
  [TerrainType.ROCK]: '#9a9b96',
  [TerrainType.WALL]: '#c4bead',
}
