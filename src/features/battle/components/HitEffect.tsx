import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, MeshBasicMaterial } from 'three'
import { ATTACK_ANIMATION_PROFILES } from '../../../game/battle/battle.animation'
import type { ConfirmedImpactEvent } from '../../../game/battle/battle.types'
import { cellPosition } from './grid'

export default function HitEffect({
  impact,
}: {
  impact: ConfirmedImpactEvent
}) {
  const group = useRef<Group>(null)
  const material = useRef<MeshBasicMaterial>(null)
  const elapsed = useRef(0)
  const position = cellPosition(impact.position)
  const profile = ATTACK_ANIMATION_PROFILES[impact.animationType]

  useFrame((_, delta) => {
    if (!group.current || !material.current) return
    elapsed.current += Number.isFinite(delta) && delta >= 0 ? delta * 1000 : 0
    const sinceImpact = elapsed.current
    if (sinceImpact > 420) {
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
      {impact.animationType === 'MELEE_SLASH' && (
        <mesh position={[0, 0.35, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.8, 0.04, 0.04]} />
          <meshBasicMaterial color={profile.effectColor} transparent opacity={0.8} depthWrite={false} />
        </mesh>
      )}
    </group>
  )
}
