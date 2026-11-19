import type { BattleConditionContext } from '../end-condition.context.ts'
import type { LossEndCondition } from '../end-condition.interface.ts'

export class AllDead implements LossEndCondition {
  readonly outcome = 'DEFEAT' as const

  evaluate(context: BattleConditionContext): boolean {
    return context.isFactionEliminated('player')
  }

  constructor() {
    Object.freeze(this)
  }
}
