import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { ATTACK_ANIMATION_PROFILES, getAttackTimelineEvents, getAttackTimelineFrame } from '../../../game/battle/battle.animation'
import type { AttackMotion, ConfirmedImpactEvent } from '../../../game/battle/battle.types'
import type { AttackAnimationClockRef } from '../hooks/useAttackAnimation'
import AttackProjectile from './AttackProjectile'
import HitEffect from './HitEffect'
import FloatingDamage from './FloatingDamage'
import { ensureAttackAnimationClock } from '../hooks/attackAnimationClock'

function traceAttack(event: string, attackId: number, data: Record<string, unknown> = {}): void {
  if (import.meta.env?.DEV) console.debug('[ATTACK EVENT]', { event, attackId, ...data })
}

export default function AttackAnimationController({
  attackMotion,
  confirmedImpacts,
  clockRef,
  onImpact,
  onComplete,
  onAbort,
  onFeedbackComplete,
}: {
  attackMotion: AttackMotion | null
  confirmedImpacts: readonly ConfirmedImpactEvent[]
  clockRef: AttackAnimationClockRef
  onImpact: (attackId: number) => void
  onComplete: (attackId: number) => void
  onAbort: (attackId: number) => void
  onFeedbackComplete: (impactId: number) => void
}) {
  const generationRef = useRef(0)
  const emittedImpacts = useRef(new Set<number>())
  const emittedCompletions = useRef(new Set<number>())
  const latestAttackId = useRef<number | null>(null)

  useEffect(() => {
    const generation = ++generationRef.current
    const attackId = attackMotion?.attackId ?? null
    if (attackMotion) {
      if (clockRef.current?.attackId !== attackId) {
        const profile = getAttackProfileFromMotion(attackMotion)
        clockRef.current = { attackId: attackMotion.attackId, elapsedMs: 0, frame: getAttackTimelineFrame(0, profile) }
      }
      latestAttackId.current = attackId
      traceAttack('ANIMATION START', attackMotion.attackId, {
        animationType: attackMotion.animationType,
        phase: attackMotion.phase,
      })
    } else {
      clockRef.current = null
      latestAttackId.current = null
    }

    return () => {
      queueMicrotask(() => {
        if (isCurrentGeneration(generationRef, generation) && latestAttackId.current === attackId && attackId !== null) {
          onAbort(attackId)
          traceAttack('ANIMATION CLEANUP ABORT', attackId)
        }
      })
    }
  }, [attackMotion, clockRef, onAbort])

  useFrame((_, delta) => {
    if (!attackMotion) return
    if (!Number.isFinite(delta) || delta < 0) {
      onAbort(attackMotion.attackId)
      return
    }
    const profile = getAttackProfileFromMotion(attackMotion)
    if (!clockRef.current) {
      clockRef.current = ensureAttackAnimationClock(clockRef.current, attackMotion.attackId, profile)
      traceAttack('CLOCK INITIALIZED IN FRAME', attackMotion.attackId)
    }
    const clock = clockRef.current
    if (clock.attackId !== attackMotion.attackId) {
      onAbort(attackMotion.attackId)
      return
    }
    const previousElapsed = clock.elapsedMs
    const nextElapsed = previousElapsed + delta * 1000
    const events = getAttackTimelineEvents(previousElapsed, nextElapsed, profile)
    clock.elapsedMs = nextElapsed
    clock.frame = getAttackTimelineFrame(nextElapsed, profile)

    if (events.impact && !emittedImpacts.current.has(attackMotion.attackId)) {
      emittedImpacts.current.add(attackMotion.attackId)
      traceAttack('IMPACT CALLBACK', attackMotion.attackId)
      onImpact(attackMotion.attackId)
    }
    if (events.complete && !emittedCompletions.current.has(attackMotion.attackId)) {
      emittedCompletions.current.add(attackMotion.attackId)
      traceAttack('COMPLETE CALLBACK', attackMotion.attackId)
      onComplete(attackMotion.attackId)
    }
  })

  return (
    <>
      {attackMotion && <AttackProjectile attackMotion={attackMotion} clockRef={clockRef} />}
      {confirmedImpacts.map((impact) => (
        <group key={impact.impactId}>
          <HitEffect impact={impact} />
          <FloatingDamage
            position={impact.position}
            damage={impact.result.appliedDamage}
            onComplete={() => onFeedbackComplete(impact.impactId)}
          />
        </group>
      ))}
    </>
  )
}

function isCurrentGeneration(generationRef: { current: number }, generation: number): boolean {
  return generationRef.current === generation
}

function getAttackProfileFromMotion(motion: AttackMotion) {
  const profile = ATTACK_ANIMATION_PROFILES[motion.animationType]
  if (!profile) throw new Error(`Unknown attack animation type: ${motion.animationType}`)
  return profile
}
