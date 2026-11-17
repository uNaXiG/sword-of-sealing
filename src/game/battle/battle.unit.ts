import type { BattleUnit } from './battle.types'

export function isUnitAlive(unit: Pick<BattleUnit, 'hp'>): boolean {
  return unit.hp > 0
}
