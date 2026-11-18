import type { BattleState, BattleUnit, UnitLifeState } from './battle.types'

export function isUnitAlive(unit: Pick<BattleUnit, 'hp'>): boolean {
  return unit.hp > 0
}

export function getUnitLifeState(state: BattleState, unitId: string): UnitLifeState {
  if (state.deathMotions?.some((motion) => motion.unitId === unitId)) return 'DYING'
  if (state.defeatedUnits?.some((record) => record.unit.id === unitId)) return 'DEAD'
  const unit = state.units.find((candidate) => candidate.id === unitId)
  return unit && isUnitAlive(unit) ? 'ALIVE' : unit ? 'DYING' : 'DEAD'
}
