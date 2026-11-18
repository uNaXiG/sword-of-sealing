import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'
import { ATTACK_ANIMATION_PROFILES, getAttackTimelineFrame } from '../../../game/battle/battle.animation'
import type { AttackMotion } from '../../../game/battle/battle.types'
import type { AttackAnimationClockRef } from '../hooks/useAttackAnimation'
import { cellPosition } from './grid'

export default function AttackProjectile({
  attackMotion,
  clockRef,
}: {
  attackMotion: AttackMotion
  clockRef: AttackAnimationClockRef
}) {
  const mesh = useRef<Mesh>(null)
  const type = attackMotion.animationType
  const isMagic = type === 'MAGIC_PROJECTILE'
  const isArrow = type === 'RANGED_ARROW'
  const isHoly = type === 'HOLY_STRIKE'
  const hasProjectile = isMagic || isArrow || isHoly
  const start = cellPosition(attackMotion.from)
  const end = cellPosition(attackMotion.to)
  const profile = ATTACK_ANIMATION_PROFILES[type]

  useFrame(() => {
    if (!mesh.current || !hasProjectile) return
    const clock = clockRef.current
    if (!clock || clock.attackId !== attackMotion.attackId) {
      mesh.current.visible = false
      return
    }
    const frame = getAttackTimelineFrame(clock.elapsedMs, profile)
    if (frame.stage === 'WINDUP' || frame.stage === 'COMPLETED') {
      mesh.current.visible = false
      return
    }
    mesh.current.visible = true
    const progress = frame.stage === 'ATTACK' ? frame.stageProgress : 1
    if (isHoly) {
      mesh.current.position.set(end[0], 2.1 - progress * 1.45, end[2])
      mesh.current.rotation.y = progress * Math.PI
    } else {
      mesh.current.position.set(
        start[0] + (end[0] - start[0]) * progress,
        isMagic ? 1.05 + Math.sin(progress * Math.PI) * 0.15 : 0.95,
        start[2] + (end[2] - start[2]) * progress,
      )
      if (isArrow) {
        mesh.current.rotation.y = Math.atan2(end[0] - start[0], end[2] - start[2])
        mesh.current.rotation.z = Math.PI / 2
      }
    }
    mesh.current.scale.setScalar(frame.stage === 'RECOVERY' ? 0.01 : 1)
  })

  if (!hasProjectile) return null

  return (
    <mesh ref={mesh} visible={false} raycast={() => {}}>
      {isMagic ? <sphereGeometry args={[0.13, 16, 12]} />
        : isArrow ? <coneGeometry args={[0.045, 0.42, 8]} />
          : <cylinderGeometry args={[0.08, 0.22, 1.4, 12]} />}
      <meshBasicMaterial
        color={profile.effectColor}
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </mesh>
  )
}
