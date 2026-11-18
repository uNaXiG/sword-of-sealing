import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { BufferAttribute, BufferGeometry, Points, PointsMaterial } from 'three'
import { getDeathTimelineFrame, getDeathTotalMs } from '../../../game/battle/battle.death'
import type { DeathMotion } from '../../../game/battle/battle.types'
import type { DeathAnimationClockMapRef } from '../hooks/useDeathAnimation'
import { cellPosition } from './grid'

const PARTICLE_COUNT = 24

export default function DeathParticleEffect({
  motion,
  deathClockRef,
}: {
  motion: DeathMotion
  deathClockRef: DeathAnimationClockMapRef
}) {
  const points = useRef<Points>(null)
  const material = useRef<PointsMaterial>(null)
  const base = cellPosition(motion.position)
  const seeds = useMemo(() => Array.from({ length: PARTICLE_COUNT }, (_, index) => ({
    angle: index * 2.399963,
    radius: 0.12 + (index % 7) * 0.035,
    speed: 0.7 + (index % 5) * 0.11,
    offset: (index % 6) * 0.08,
  })), [])
  const geometry = useMemo(() => {
    const result = new BufferGeometry()
    result.setAttribute('position', new BufferAttribute(new Float32Array(PARTICLE_COUNT * 3), 3))
    return result
  }, [])

  useEffect(() => () => geometry.dispose(), [geometry])

  useFrame(() => {
    if (!points.current || !material.current) return
    const clock = deathClockRef.current.get(motion.deathId)
    if (!clock || clock.deathId !== motion.deathId) {
      points.current.visible = false
      return
    }
    const frame = getDeathTimelineFrame(clock.elapsedMs)
    const dissolveProgress = frame.stage === 'DISSOLVE' ? frame.stageProgress : frame.stage === 'COMPLETED' ? 1 : 0
    points.current.visible = dissolveProgress > 0 && clock.elapsedMs < getDeathTotalMs()
    material.current.opacity = dissolveProgress <= 0 ? 0 : 1 - dissolveProgress
    const attribute = geometry.getAttribute('position') as BufferAttribute
    const array = attribute.array as Float32Array
    seeds.forEach((seed, index) => {
      const positionIndex = index * 3
      const rise = dissolveProgress * seed.speed
      const spread = seed.radius * dissolveProgress
      array[positionIndex] = base[0] + Math.cos(seed.angle) * spread
      array[positionIndex + 1] = 0.16 + seed.offset + rise
      array[positionIndex + 2] = base[2] + Math.sin(seed.angle) * spread
    })
    attribute.needsUpdate = true
  })

  return (
    <points ref={points} geometry={geometry} visible={false} raycast={() => {}}>
      <pointsMaterial
        ref={material}
        color="#ffe9bc"
        size={0.075}
        transparent
        opacity={0}
        depthWrite={false}
      />
    </points>
  )
}
