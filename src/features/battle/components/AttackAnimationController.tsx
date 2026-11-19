import { useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import type { AttackMotion, ConfirmedImpactEvent } from '../../../game/battle/battle.types'
import type { AttackAnimationClockRef } from '../hooks/useAttackAnimation'
import AttackProjectile from './AttackProjectile'
import HitEffect from './HitEffect'
import FloatingDamage from './FloatingDamage'
import { AttackAnimationControllerLifecycle } from '../hooks/attackAnimationControllerLifecycle'

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
  const [lifecycle] = useState(
    () => new AttackAnimationControllerLifecycle(clockRef),
  )

  useEffect(() => {
    return lifecycle.setup(attackMotion, onAbort, traceAttack)
  }, [attackMotion, lifecycle, onAbort])

  useFrame((_, delta) => {
    lifecycle.frame(attackMotion, delta, { onImpact, onComplete, onAbort }, traceAttack)
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
