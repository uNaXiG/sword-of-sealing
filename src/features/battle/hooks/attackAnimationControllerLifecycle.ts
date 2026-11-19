import {
  ATTACK_ANIMATION_PROFILES,
  getAttackTimelineEvents,
  getAttackTimelineFrame,
} from '../../../game/battle/battle.animation.ts'
import type { AttackMotion } from '../../../game/battle/battle.types.ts'
import { ensureAttackAnimationClock } from './attackAnimationClock.ts'
import type { AttackAnimationClockRef } from './useAttackAnimation.ts'

export interface AttackAnimationControllerCallbacks {
  onImpact: (attackId: number) => void
  onComplete: (attackId: number) => void
  onAbort: (attackId: number) => void
}

export type AttackAnimationTrace = (
  event: string,
  attackId: number,
  data?: Record<string, unknown>,
) => void

export class AttackAnimationControllerLifecycle {
  private generation = 0
  private readonly emittedImpacts = new Set<number>()
  private readonly emittedCompletions = new Set<number>()
  private latestAttackId: number | null = null
  private readonly clockRef: AttackAnimationClockRef

  constructor(clockRef: AttackAnimationClockRef) {
    this.clockRef = clockRef
  }

  setup(
    attackMotion: AttackMotion | null,
    onAbort: (attackId: number) => void,
    trace: AttackAnimationTrace,
  ): () => void {
    const generation = ++this.generation
    const attackId = attackMotion?.attackId ?? null
    if (attackMotion) {
      if (this.clockRef.current?.attackId !== attackId) {
        const profile = getAttackProfile(attackMotion)
        this.clockRef.current = {
          attackId: attackMotion.attackId,
          elapsedMs: 0,
          frame: getAttackTimelineFrame(0, profile),
        }
      }
      this.latestAttackId = attackId
      trace('ANIMATION START', attackMotion.attackId, {
        animationType: attackMotion.animationType,
        phase: attackMotion.phase,
      })
    } else {
      this.clockRef.current = null
      this.latestAttackId = null
    }

    return () => {
      queueMicrotask(() => {
        if (
          this.generation === generation &&
          this.latestAttackId === attackId &&
          attackId !== null
        ) {
          onAbort(attackId)
          trace('ANIMATION CLEANUP ABORT', attackId)
        }
      })
    }
  }

  frame(
    attackMotion: AttackMotion | null,
    delta: number,
    callbacks: AttackAnimationControllerCallbacks,
    trace: AttackAnimationTrace,
  ): void {
    if (!attackMotion) return
    if (!Number.isFinite(delta) || delta < 0) {
      callbacks.onAbort(attackMotion.attackId)
      return
    }
    const profile = getAttackProfile(attackMotion)
    if (!this.clockRef.current) {
      this.clockRef.current = ensureAttackAnimationClock(
        this.clockRef.current,
        attackMotion.attackId,
        profile,
      )
      trace('CLOCK INITIALIZED IN FRAME', attackMotion.attackId)
    }
    const clock = this.clockRef.current
    if (clock.attackId !== attackMotion.attackId) {
      callbacks.onAbort(attackMotion.attackId)
      return
    }
    const previousElapsed = clock.elapsedMs
    const nextElapsed = previousElapsed + delta * 1000
    const events = getAttackTimelineEvents(previousElapsed, nextElapsed, profile)
    clock.elapsedMs = nextElapsed
    clock.frame = getAttackTimelineFrame(nextElapsed, profile)

    if (events.impact && !this.emittedImpacts.has(attackMotion.attackId)) {
      this.emittedImpacts.add(attackMotion.attackId)
      trace('IMPACT CALLBACK', attackMotion.attackId)
      callbacks.onImpact(attackMotion.attackId)
    }
    if (events.complete && !this.emittedCompletions.has(attackMotion.attackId)) {
      this.emittedCompletions.add(attackMotion.attackId)
      trace('COMPLETE CALLBACK', attackMotion.attackId)
      callbacks.onComplete(attackMotion.attackId)
    }
  }
}

export function getAttackProfile(motion: AttackMotion) {
  const profile = ATTACK_ANIMATION_PROFILES[motion.animationType]
  if (!profile) throw new Error(`Unknown attack animation type: ${motion.animationType}`)
  return profile
}

