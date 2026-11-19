import type { BattleReducer } from './battle.state.ts'
import { createBattleReducer, createBattleState } from './battle.state.ts'
import type { BattleState, BattleUnit } from './battle.types.ts'
import type { BattleObstacle } from './obstacles.ts'
import type { LossCondition } from '../end-conditions/loss-condition.ts'
import type { WinCondition } from '../end-conditions/win-condition.ts'

export type BattleSessionConfiguration = {
  readonly units: readonly BattleUnit[]
  readonly obstacles?: readonly BattleObstacle[]
  readonly winCondition: WinCondition
  readonly lossCondition: LossCondition
}

export type BattleSession = {
  readonly initialState: BattleState
  readonly reducer: BattleReducer
}

export function createBattleSession(configuration: BattleSessionConfiguration): BattleSession {
  const obstacles = configuration.obstacles ?? []
  return Object.freeze({
    initialState: createBattleState(configuration.units, obstacles),
    reducer: createBattleReducer({
      initialUnits: configuration.units,
      winCondition: configuration.winCondition,
      lossCondition: configuration.lossCondition,
    }),
  })
}
