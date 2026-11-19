import BattleSessionHost from './components/BattleSessionHost'
import BattleSessionRuntime from './components/BattleSessionRuntime'

export default function BattleScene() {
  return (
    <BattleSessionHost>
      {({ generation, requestRestart }) => (
        <BattleSessionRuntime
          key={generation}
          generation={generation}
          requestRestart={requestRestart}
        />
      )}
    </BattleSessionHost>
  )
}
