import { useEffect, useRef } from 'react'
import type { BattleOutcome } from '../../../game/battle/battle.types'
import './BattleResultOverlay.css'

type TerminalOutcome = Exclude<BattleOutcome, null>

const resultCopy: Record<TerminalOutcome, {
  title: string
  description: string
}> = {
  VICTORY: {
    title: '戰鬥勝利',
    description: '已成功殲滅敵方部隊',
  },
  DEFEAT: {
    title: '戰鬥失敗',
    description: '我方部隊已全數陣亡',
  },
}

export default function BattleResultOverlay({
  outcome,
  onRestart,
}: {
  outcome: TerminalOutcome
  onRestart: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const restartButtonRef = useRef<HTMLButtonElement>(null)
  const copy = resultCopy[outcome]

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (!dialog.open) dialog.showModal()
    restartButtonRef.current?.focus()

    return () => {
      if (dialog.open) dialog.close()
    }
  }, [])

  return (
    <dialog
      ref={dialogRef}
      className={`battle-result-dialog battle-result-dialog-${outcome.toLowerCase()}`}
      aria-modal="true"
      aria-labelledby="battle-result-title"
      aria-describedby="battle-result-description"
      onCancel={(event) => event.preventDefault()}
      onClick={(event) => {
        if (event.target === event.currentTarget) event.preventDefault()
      }}
    >
      <div className="battle-result-panel">
        <span className="battle-result-ornament" aria-hidden="true">✦</span>
        <p className="battle-result-eyebrow">{outcome}</p>
        <h2 id="battle-result-title">{copy.title}</h2>
        <p id="battle-result-description">{copy.description}</p>
        <button
          ref={restartButtonRef}
          className="battle-result-restart"
          type="button"
          onClick={onRestart}
        >
          重新挑戰
        </button>
      </div>
    </dialog>
  )
}
