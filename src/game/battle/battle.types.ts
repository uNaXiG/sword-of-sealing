import type { Cell } from '../grid/grid.types'
import type { BattleObstacle } from './obstacles'

export type BattleUnit = {
  id: string
  name: string
  faction: 'player' | 'enemy'
  class: 'knight' | 'mage' | 'rogue' | 'goblin'
  position: Cell
  movement: number
  hp: number
  maxHp: number
}

export type BattleMotion = {
  unitId: string
  path: Cell[]
}

export type BattleState = {
  units: BattleUnit[]
  obstacles: BattleObstacle[]
  selectedUnitId: string | null
  motion: BattleMotion | null
}
