import { ACTION_DISTANCE } from '../src/game/battle/battle.turn.constants.ts'

export function activateUnitFixture(state, unitId) {
  const unit = state.units.find((candidate) => candidate.id === unitId)
  if (!unit) throw new Error(`Missing turn fixture unit: ${unitId}`)
  return {
    ...state,
    selectedUnitId: unit.faction === 'player' ? unit.id : null,
    movementUsedTurnId: null,
    interactionMode: 'COMMAND',
    turn: {
      ...state.turn,
      activeUnitId: unit.id,
      timeline: state.turn.timeline.map((entry) => ({
        ...entry,
        remainingDistance: entry.unitId === unit.id ? 0 : ACTION_DISTANCE,
      })),
    },
  }
}
