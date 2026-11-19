import { AbstractEndCondition } from './abstract-end-condition.ts'
import type { WinEndCondition } from './end-condition.interface.ts'
import type { ConditionEvaluationMode } from './end-condition.types.ts'

export class WinCondition extends AbstractEndCondition<WinEndCondition> {
  constructor(
    conditions: readonly WinEndCondition[],
    mode: ConditionEvaluationMode = 'ANY',
  ) {
    super(conditions, mode, 'VICTORY')
    Object.freeze(this)
  }
}
