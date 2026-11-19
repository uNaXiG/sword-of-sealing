import type { AttackPattern, UnitClass } from '../classes/class.types'
import type { Cell } from '../grid/grid.types'
import type { BattleObstacle } from './obstacles'
import type { AttackAnimationType } from './battle.animation'
import type { BattleTurnState, PendingTurnCompletion, TurnActionState } from './battle.turn.types'

export type BattleFaction = 'player' | 'enemy'

export type BattleUnit = {
  id: string
  name: string
  faction: BattleFaction
  class: UnitClass
  position: Cell
  movementPoints: number
  attackPattern: AttackPattern
  attackRange: number
  minAttackRange: number
  atk: number
  def: number
  agi: number
  hp: number
  maxHp: number
  sp: number
  maxSp: number
}

export type InteractionMode = 'COMMAND' | 'MOVE' | 'ATTACK'

export type AttackCommand = {
  attackerId: string
  targetId: string
}

export type AttackResult = {
  attackerId: string
  targetId: string
  damage: number
  appliedDamage: number
  previousHp: number
  remainingHp: number
  isDefeated: boolean
}

export type UnitLifeState = 'ALIVE' | 'DYING' | 'DEAD'

export type AttackMotionPhase = 'PENDING_IMPACT' | 'IMPACTED'

export type AttackMotion = {
  attackId: number
  turnId: number
  attackerId: string
  targetId: string
  from: Cell
  to: Cell
  animationType: AttackAnimationType
  phase: AttackMotionPhase
  result: AttackResult
}

export type ConfirmedImpactEvent = {
  impactId: number
  attackId: number
  attackerId: string
  targetId: string
  position: Cell
  animationType: AttackAnimationType
  result: AttackResult
}

export type DeathMotion = {
  deathId: number
  unitId: string
  killerId: string
  attackId: number
  position: Cell
  sourcePosition: Cell
}

export type DefeatedUnitRecord = {
  deathId: number
  unit: BattleUnit
  killerId: string
  attackId: number
}

export type BattleMotion = {
  motionId: number
  turnId: number
  unitId: string
  path: Cell[]
  cost: number
}

export type BattleMoveRecord = {
  motionId: number
  turnId: number
  unitId: string
  from: Cell
  to: Cell
  path: Cell[]
  cost: number
}

export type AIProgress =
  | {
    turnId: number
    unitId: string
    phase: 'MOVING'
    targetId: string | null
  }
  | {
    turnId: number
    unitId: string
    phase: 'MOVE_COMPLETED'
    targetId: string | null
  }
  | {
    turnId: number
    unitId: string
    phase: 'ATTACKING'
  }

export type BattleState = {
  units: BattleUnit[]
  obstacles: BattleObstacle[]
  selectedUnitId: string | null
  motion: BattleMotion | null
  nextMotionId: number
  lastMove: BattleMoveRecord | null
  turnAction: TurnActionState | null
  interactionMode: InteractionMode
  selectedAttackTargetId: string | null
  lastAttackCommand: AttackCommand | null
  lastAttackResult: AttackResult | null
  attackMotion: AttackMotion | null
  nextAttackId: number
  deathMotions: DeathMotion[]
  nextDeathId: number
  defeatedUnits: DefeatedUnitRecord[]
  confirmedImpacts: ConfirmedImpactEvent[]
  aiProgress: AIProgress | null
  turn: BattleTurnState
  pendingTurnCompletion: PendingTurnCompletion | null
}
