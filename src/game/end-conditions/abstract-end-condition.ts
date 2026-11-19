import type { BattleConditionContext } from './end-condition.context.ts'
import type { EndCondition } from './end-condition.interface.ts'
import type { ConditionEvaluationMode, EndConditionOutcome } from './end-condition.types.ts'

export abstract class AbstractEndCondition<TCondition extends EndCondition = EndCondition> {
  protected readonly conditions: readonly TCondition[]
  protected readonly mode: ConditionEvaluationMode

  protected constructor(
    conditions: readonly TCondition[],
    mode: ConditionEvaluationMode = 'ANY',
    expectedOutcome?: EndConditionOutcome,
  ) {
    if (!Array.isArray(conditions) || conditions.length === 0) {
      throw new RangeError('At least one end condition is required')
    }
    if (mode !== 'ANY' && mode !== 'ALL') {
      throw new TypeError(`Invalid condition evaluation mode: ${String(mode)}`)
    }

    const snapshot = [...conditions]
    for (const condition of snapshot) {
      if (
        typeof condition !== 'object' ||
        condition === null ||
        typeof condition.evaluate !== 'function' ||
        (condition.outcome !== 'VICTORY' && condition.outcome !== 'DEFEAT') ||
        (expectedOutcome !== undefined && condition.outcome !== expectedOutcome)
      ) {
        throw new TypeError('Condition does not satisfy the required end condition contract')
      }
    }

    for (const condition of snapshot) {
      Object.freeze(condition)
    }

    this.conditions = Object.freeze(snapshot)
    this.mode = mode
  }

  evaluate(context: BattleConditionContext): boolean {
    for (const condition of this.conditions) {
      const result = condition.evaluate(context)
      if (typeof result !== 'boolean') {
        throw new TypeError('End condition evaluate() must return a boolean')
      }
      if (this.mode === 'ANY' && result) return true
      if (this.mode === 'ALL' && !result) return false
    }
    return this.mode === 'ALL'
  }
}
