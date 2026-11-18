import { useCallback, useRef } from 'react'
import type { DeathTimelineFrame } from '../../../game/battle/battle.death'

export type DeathAnimationClock = {
  deathId: number
  elapsedMs: number
  frame: DeathTimelineFrame
}

export type DeathAnimationClockMapRef = {
  current: Map<number, DeathAnimationClock>
}

export function useDeathAnimation(
  complete: (deathId: number, unitId: string) => void,
  abort: (deathId: number, unitId: string) => void,
) {
  const deathClockRef = useRef(new Map<number, DeathAnimationClock>())
  const onComplete = useCallback(
    (deathId: number, unitId: string) => complete(deathId, unitId),
    [complete],
  )
  const onAbort = useCallback(
    (deathId: number, unitId: string) => abort(deathId, unitId),
    [abort],
  )
  return { deathClockRef, onComplete, onAbort }
}
