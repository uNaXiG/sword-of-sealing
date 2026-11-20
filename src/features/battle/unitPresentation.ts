import type { BattleUnit } from '../../game/battle/battle.types'

export function getUnitOverheadPresentation(
  unit: Pick<BattleUnit, 'id' | 'faction'>,
  activeUnitId: string | null,
): {
  showNameAndHealth: boolean
  showActiveIndicator: boolean
} {
  return {
    showNameAndHealth: unit.faction === 'enemy',
    showActiveIndicator: activeUnitId !== null && unit.id === activeUnitId,
  }
}

export function getActiveIndicatorFloatOffset(elapsedSeconds: number, reducedMotion: boolean): number {
  if (reducedMotion || !Number.isFinite(elapsedSeconds)) return 0
  return Math.sin(elapsedSeconds * 2.5) * 0.08
}
