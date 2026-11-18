import { useCallback, useRef } from 'react'
import type { AttackTimelineFrame } from '../../../game/battle/battle.animation'

export interface AttackAnimationClock {
  attackId: number
  elapsedMs: number
  frame: AttackTimelineFrame
}

export interface AttackAnimationClockRef {
  current: AttackAnimationClock | null
}

export function useAttackAnimation(
  impact: (attackId: number) => void,
  complete: (attackId: number) => void,
  abort: (attackId: number) => void,
) {
  const clockRef = useRef<AttackAnimationClock | null>(null)
  const onImpact = useCallback((attackId: number) => impact(attackId), [impact])
  const onComplete = useCallback((attackId: number) => complete(attackId), [complete])
  const onAbort = useCallback((attackId: number) => abort(attackId), [abort])
  return { clockRef, onImpact, onComplete, onAbort }
}
