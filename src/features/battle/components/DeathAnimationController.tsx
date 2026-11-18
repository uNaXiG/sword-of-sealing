import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  getDeathTimelineEvents,
  getDeathTimelineFrame,
} from '../../../game/battle/battle.death'
import type { DeathMotion } from '../../../game/battle/battle.types'
import type { DeathAnimationClockMapRef } from '../hooks/useDeathAnimation'
import DeathParticleEffect from './DeathParticleEffect'

export default function DeathAnimationController({
  motions,
  deathClockRef,
  onComplete,
  onAbort,
}: {
  motions: readonly DeathMotion[]
  deathClockRef: DeathAnimationClockMapRef
  onComplete: (deathId: number, unitId: string) => void
  onAbort: (deathId: number, unitId: string) => void
}) {
  return (
    <>
      {motions.map((motion) => (
        <DeathAnimation
          key={motion.deathId}
          motion={motion}
          deathClockRef={deathClockRef}
          onComplete={onComplete}
          onAbort={onAbort}
        />
      ))}
    </>
  )
}

function DeathAnimation({
  motion,
  deathClockRef,
  onComplete,
  onAbort,
}: {
  motion: DeathMotion
  deathClockRef: DeathAnimationClockMapRef
  onComplete: (deathId: number, unitId: string) => void
  onAbort: (deathId: number, unitId: string) => void
}) {
  const generation = useRef(0)
  const completed = useRef(false)

  useEffect(() => {
    const currentGeneration = ++generation.current
    const clocks = deathClockRef.current
    clocks.set(motion.deathId, {
      deathId: motion.deathId,
      elapsedMs: 0,
      frame: getDeathTimelineFrame(0),
    })
    return () => {
      queueMicrotask(() => {
        const clock = clocks.get(motion.deathId)
        if (!isCurrentGeneration(generation, currentGeneration)) return
        if (clock?.deathId === motion.deathId) clocks.delete(motion.deathId)
        if (!completed.current) {
          onAbort(motion.deathId, motion.unitId)
        }
      })
    }
  }, [deathClockRef, motion.deathId, motion.unitId, onAbort])

  useFrame((_, delta) => {
    if (completed.current) return
    const clock = deathClockRef.current.get(motion.deathId)
    if (!clock || clock.deathId !== motion.deathId) {
      onAbort(motion.deathId, motion.unitId)
      return
    }
    if (!Number.isFinite(delta) || delta < 0) {
      onAbort(motion.deathId, motion.unitId)
      return
    }
    const previousElapsed = clock.elapsedMs
    const nextElapsed = previousElapsed + delta * 1000
    const events = getDeathTimelineEvents(previousElapsed, nextElapsed)
    clock.elapsedMs = nextElapsed
    clock.frame = getDeathTimelineFrame(nextElapsed)
    if (events.complete) {
      completed.current = true
      onComplete(motion.deathId, motion.unitId)
    }
  })

  return <DeathParticleEffect motion={motion} deathClockRef={deathClockRef} />
}

function isCurrentGeneration(ref: { current: number }, expected: number): boolean {
  return ref.current === expected
}
