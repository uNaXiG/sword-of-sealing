export { AbstractEndCondition } from './abstract-end-condition.ts'
export type {
  BattleConditionContext,
  ReadonlyBattleUnit,
  ReadonlyDefeatedUnitRecord,
} from './end-condition.context.ts'
export type {
  EndCondition,
  LossEndCondition,
  WinEndCondition,
} from './end-condition.interface.ts'
export type {
  ConditionEvaluationMode,
  EndConditionOutcome,
} from './end-condition.types.ts'
export { LossCondition } from './loss-condition.ts'
export { resolveBattleOutcome } from './outcome-resolver.ts'
export { WinCondition } from './win-condition.ts'
export { AllDead as LossAllDead } from './loss/all-dead.ts'
export { AllDead as WinAllDead } from './win/all-dead.ts'
