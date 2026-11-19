import type { BattleConditionContext } from './end-condition.context'
import type { EndConditionOutcome } from './end-condition.types'

export interface EndCondition {
  readonly outcome: EndConditionOutcome
  evaluate(context: BattleConditionContext): boolean
}

export interface WinEndCondition extends EndCondition {
  readonly outcome: 'VICTORY'
}

export interface LossEndCondition extends EndCondition {
  readonly outcome: 'DEFEAT'
}
