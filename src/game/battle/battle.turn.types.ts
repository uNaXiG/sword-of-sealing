export interface UnitTurnState {
  readonly unitId: string
  readonly initialOrder: number
  readonly remainingDistance: number
  readonly velocity: number
}

export interface BattleTurnState {
  readonly battleTime: number
  readonly round: number
  readonly turnId: number
  readonly activeUnitId: string | null
  readonly timeline: readonly UnitTurnState[]
}

export interface PendingTurnCompletion {
  readonly turnId: number
  readonly unitId: string
  readonly attackId: number
}

export interface TurnContext {
  readonly turnId: number
  readonly unitId: string
}

export type CombatActionStatus = 'AVAILABLE' | 'RESERVED' | 'CONSUMED'

export interface TurnActionState extends TurnContext {
  readonly movementUsed: boolean
  readonly movementInitiationLocked: boolean
  readonly combatAction: CombatActionStatus
  readonly reservedAttackId: number | null
}

export interface TurnPreviewEntry {
  readonly unitId: string
  readonly turnId: number
  readonly battleTime: number
  readonly round: number
  readonly timeOffset: number
}
