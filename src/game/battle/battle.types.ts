import type { Cell } from '../grid/grid.types'
import type { BattleObstacle } from './obstacles'

export type BattleUnit = {
  id: string
  name: string
  faction: 'player' | 'enemy'
  class: 'knight' | 'mage' | 'rogue' | 'goblin'
  position: Cell
  movementPoints: number
  attackRange: number
  hp: number
  maxHp: number
}

export type InteractionMode = 'COMMAND' | 'MOVE' | 'ATTACK'

export type AttackCommand = {
  attackerId: string
  targetId: string
}

export type BattleMotion = {
  motionId: number
  unitId: string
  path: Cell[]
  cost: number
}

export type BattleMoveRecord = {
  motionId: number
  unitId: string
  from: Cell
  to: Cell
  path: Cell[]
  cost: number
}

export type BattleState = {
  units: BattleUnit[]
  obstacles: BattleObstacle[]
  selectedUnitId: string | null
  motion: BattleMotion | null
  nextMotionId: number
  lastMove: BattleMoveRecord | null
  interactionMode: InteractionMode
  selectedAttackTargetId: string | null
  lastAttackCommand: AttackCommand | null
}
