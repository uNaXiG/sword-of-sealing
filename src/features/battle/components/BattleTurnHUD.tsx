import type { BattleTurnState } from '../../../game/battle/battle.turn.types'
import type { BattleUnit } from '../../../game/battle/battle.types'

export default function BattleTurnHUD({
  turn,
  activeUnit,
}: {
  turn: BattleTurnState
  activeUnit: BattleUnit | null
}) {
  return (
    <section className="battle-turn-hud" aria-label="目前個體回合">
      <div><span>ROUND</span><strong>{turn.round}</strong></div>
      <div><span>BATTLE TIME</span><strong>{turn.battleTime.toFixed(2)}</strong></div>
      <div><span>TURN</span><strong>{turn.turnId}</strong></div>
      <div className="battle-turn-hud-active">
        <span>{activeUnit?.faction === 'enemy' ? 'ENEMY TURN' : activeUnit ? 'PLAYER TURN' : 'NO ACTIVE UNIT'}</span>
        <strong>{activeUnit?.name ?? '無可行動角色'}</strong>
      </div>
    </section>
  )
}
