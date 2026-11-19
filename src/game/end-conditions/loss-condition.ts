import { AbstractEndCondition } from './abstract-end-condition.ts'
import type { LossEndCondition } from './end-condition.interface.ts'
import type { ConditionEvaluationMode } from './end-condition.types.ts'

export class LossCondition extends AbstractEndCondition<LossEndCondition> {
  constructor(
    conditions: readonly LossEndCondition[],
    mode: ConditionEvaluationMode = 'ANY',
  ) {
    super(conditions, mode, 'DEFEAT')
    Object.freeze(this)
  }
}
