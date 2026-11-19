import { INITIAL_UNITS } from '../../game/battle/battle.data.ts'
import { createBattleSession } from '../../game/battle/battle.session.ts'
import { INITIAL_OBSTACLES } from '../../game/battle/obstacles.ts'
import { LossCondition } from '../../game/end-conditions/loss-condition.ts'
import { AllDead as LossAllDead } from '../../game/end-conditions/loss/all-dead.ts'
import { WinCondition } from '../../game/end-conditions/win-condition.ts'
import { AllDead as WinAllDead } from '../../game/end-conditions/win/all-dead.ts'

export function createBattleScenarioSession() {
  return createBattleSession({
    units: INITIAL_UNITS,
    obstacles: INITIAL_OBSTACLES,
    winCondition: new WinCondition([new WinAllDead()]),
    lossCondition: new LossCondition([new LossAllDead()]),
  })
}
