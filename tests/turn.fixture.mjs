import { ACTION_DISTANCE } from '../src/game/battle/battle.turn.constants.ts'
import { createTurnActionState } from '../src/game/battle/battle.action.ts'
import { battleReducer } from '../src/game/battle/battle.state.ts'

const COMMAND_ACTION_TYPES = new Set([
  'select',
  'cell',
  'clear',
  'standby',
  'undo',
  'commit',
  'set-mode',
  'cancel-move-mode',
  'select-attack-target',
  'cancel-attack',
  'confirm-attack',
])

export function battleReducerFixture(state, action) {
  if (!COMMAND_ACTION_TYPES.has(action.type) || ('turnId' in action && 'unitId' in action)) {
    return battleReducer(state, action)
  }
  const normalized = action.type === 'select'
    ? { type: 'select', targetId: action.unitId }
    : action
  return battleReducer(state, {
    ...normalized,
    turnId: state.turn.turnId,
    unitId: state.turn.activeUnitId ?? '',
  })
}

export function activateUnitFixture(state, unitId) {
  const unit = state.units.find((candidate) => candidate.id === unitId)
  if (!unit) throw new Error(`Missing turn fixture unit: ${unitId}`)
  const turn = {
    ...state.turn,
    activeUnitId: unit.id,
    timeline: state.turn.timeline.map((entry) => ({
      ...entry,
      remainingDistance: entry.unitId === unit.id ? 0 : ACTION_DISTANCE,
    })),
  }
  return {
    ...state,
    selectedUnitId: unit.faction === 'player' ? unit.id : null,
    turnAction: createTurnActionState(turn),
    interactionMode: 'COMMAND',
    turn,
  }
}
