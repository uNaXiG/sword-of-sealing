import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { ATTACK_ANIMATION_PROFILES, getAttackTimelineEvents, getAttackTimelineFrame } from '../../../game/battle/battle.animation'
import type { AttackMotion } from '../../../game/battle/battle.types'
import type { Cell } from '../../../game/grid/grid.types'
import type { AttackAnimationClockRef } from '../hooks/useAttackAnimation'
import AttackProjectile from './AttackProjectile'
import HitEffect from './HitEffect'
import FloatingDamage from './FloatingDamage'

type Feedback = {
  attackId: number
  position: Cell
  damage: number
}

export default function AttackAnimationController({
  attackMotion,
  clockRef,
  onImpact,
  onComplete,
  onAbort,
}: {
  attackMotion: AttackMotion | null
  clockRef: AttackAnimationClockRef
  onImpact: (attackId: number) => void
  onComplete: (attackId: number) => void
  onAbort: (attackId: number) => void
}) {
  const generationRef = useRef(0)
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
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
    } else {
      clockRef.current = null
      latestAttackId.current = null
    }

    return () => {
      queueMicrotask(() => {
        if (isCurrentGeneration(generationRef, generation) && latestAttackId.current === attackId && attackId !== null) {
          onAbort(attackId)
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
    const clock = clockRef.current
    if (!clock || clock.attackId !== attackMotion.attackId) {
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
      setFeedbacks((current) => current.some((feedback) => feedback.attackId === attackMotion.attackId)
        ? current
        : [...current, {
          attackId: attackMotion.attackId,
          position: { ...attackMotion.to },
          damage: attackMotion.result.appliedDamage,
        }])
      onImpact(attackMotion.attackId)
    }
    if (events.complete && !emittedCompletions.current.has(attackMotion.attackId)) {
      emittedCompletions.current.add(attackMotion.attackId)
      onComplete(attackMotion.attackId)
    }
  })

  return (
    <>
      {attackMotion && <AttackProjectile attackMotion={attackMotion} clockRef={clockRef} />}
      {attackMotion && <HitEffect attackMotion={attackMotion} clockRef={clockRef} />}
      {feedbacks.map((feedback) => (
        <FloatingDamage
          key={feedback.attackId}
          position={feedback.position}
          damage={feedback.damage}
          onComplete={() => setFeedbacks((current) => current.filter((item) => item.attackId !== feedback.attackId))}
        />
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
