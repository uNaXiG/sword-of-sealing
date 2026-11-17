export const TerrainType = {
  PLAIN: 'PLAIN',
  GRASS: 'GRASS',
  FOREST: 'FOREST',
  SHALLOW_WATER: 'SHALLOW_WATER',
  ROCK: 'ROCK',
  WALL: 'WALL',
} as const

export type TerrainType = (typeof TerrainType)[keyof typeof TerrainType]
