import type { BattleOutcome } from '../battle/battle.types.ts'
import type { BattleConditionContext } from './end-condition.context.ts'
import type { LossCondition } from './loss-condition.ts'
import type { WinCondition } from './win-condition.ts'

export function resolveBattleOutcome(
  context: BattleConditionContext,
  winCondition: WinCondition,
  lossCondition: LossCondition,
): BattleOutcome {
  const won = winCondition.evaluate(context)
  const lost = lossCondition.evaluate(context)

  if (lost) return 'DEFEAT'
  if (won) return 'VICTORY'
  return null
}
