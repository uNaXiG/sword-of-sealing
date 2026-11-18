import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, MeshBasicMaterial } from 'three'
import { ATTACK_ANIMATION_PROFILES } from '../../../game/battle/battle.animation'
import type { AttackMotion } from '../../../game/battle/battle.types'
import type { AttackAnimationClockRef } from '../hooks/useAttackAnimation'
import { cellPosition } from './grid'

export default function HitEffect({
  attackMotion,
  clockRef,
}: {
  attackMotion: AttackMotion
  clockRef: AttackAnimationClockRef
}) {
  const group = useRef<Group>(null)
  const material = useRef<MeshBasicMaterial>(null)
  const position = cellPosition(attackMotion.to)
  const profile = ATTACK_ANIMATION_PROFILES[attackMotion.animationType]
  const impactAt = profile.windupMs + profile.attackMs

  useFrame(() => {
    const clock = clockRef.current
    if (!group.current || !material.current || !clock || clock.attackId !== attackMotion.attackId) return
    const sinceImpact = clock.elapsedMs - impactAt
    if (attackMotion.phase !== 'IMPACTED' || sinceImpact < 0 || sinceImpact > 420) {
      group.current.visible = false
      return
    }
    const progress = Math.min(1, sinceImpact / 420)
    group.current.visible = true
    group.current.scale.setScalar(0.3 + progress * 1.1)
    group.current.rotation.y = progress * Math.PI * 0.5
    material.current.opacity = (1 - progress) * 0.85
  })

  return (
    <group ref={group} position={[position[0], 0.68, position[2]]} visible={false} raycast={() => {}}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.22, 0.34, 32]} />
        <meshBasicMaterial ref={material} color={profile.effectColor} transparent opacity={0} depthWrite={false} />
      </mesh>
      {attackMotion.animationType === 'MELEE_SLASH' && (
        <mesh position={[0, 0.35, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.8, 0.04, 0.04]} />
          <meshBasicMaterial color={profile.effectColor} transparent opacity={0.8} depthWrite={false} />
        </mesh>
      )}
    </group>
  )
}
