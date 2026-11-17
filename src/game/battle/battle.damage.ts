import type { AttackResult, BattleUnit } from './battle.types'

export type DamageCalculation = Omit<AttackResult, 'attackerId' | 'targetId'>

export function calculatePhysicalDamage(
  attacker: Pick<BattleUnit, 'atk'>,
  target: Pick<BattleUnit, 'def' | 'hp'>,
): DamageCalculation {
  const damage = Math.max(1, attacker.atk - target.def)
  const remainingHp = Math.max(0, target.hp - damage)
  return {
    damage,
    appliedDamage: target.hp - remainingHp,
    previousHp: target.hp,
    remainingHp,
    isDefeated: remainingHp === 0,
  }
}
