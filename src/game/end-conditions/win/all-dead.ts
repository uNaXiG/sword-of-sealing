import type { BattleConditionContext } from '../end-condition.context.ts'
import type { WinEndCondition } from '../end-condition.interface.ts'

export class AllDead implements WinEndCondition {
  readonly outcome = 'VICTORY' as const

  evaluate(context: BattleConditionContext): boolean {
    return context.isFactionEliminated('enemy')
  }

  constructor() {
    Object.freeze(this)
  }
}
