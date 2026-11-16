import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import type { Cell } from '../../../game/grid/grid.types'
import { cellPosition } from './grid'

export default function KnightPlaceholder({
  position,
  selected,
  path,
  onSelect,
  onMoveComplete,
}: {
  position: Cell
  selected: boolean
  path: Cell[] | null
  onSelect: () => void
  onMoveComplete: () => void
}) {
  const group = useRef<Group>(null)
  const progress = useRef(0)
  const completed = useRef(false)

  useEffect(() => {
    progress.current = 0
    completed.current = false
  }, [path])

  useFrame((_, delta) => {
    if (!path || !group.current || completed.current) return
    progress.current = Math.min(progress.current + delta * 3, path.length - 1)
    const segment = Math.min(Math.floor(progress.current), path.length - 2)
    const fraction = progress.current - segment
    const start = cellPosition(path[segment])
    const end = cellPosition(path[segment + 1])
    group.current.position.set(
      start[0] + (end[0] - start[0]) * fraction,
      0,
      start[2] + (end[2] - start[2]) * fraction,
    )
    if (progress.current >= path.length - 1) {
      completed.current = true
      onMoveComplete()
    }
  })

  return (
    <group ref={group} position={cellPosition(position)} onClick={(event) => { event.stopPropagation(); onSelect() }}>
      <mesh position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.31, selected ? 0.43 : 0.36, 32]} />
        <meshBasicMaterial color={selected ? '#ffe475' : '#dacb91'} />
      </mesh>
      <group position={[0, 0.08, 0]} rotation={[0, Math.PI / 4, 0]}>
        <mesh castShadow position={[-0.13, 0.23, 0]}>
          <boxGeometry args={[0.18, 0.4, 0.22]} />
          <meshStandardMaterial color="#aebdcb" metalness={0.55} roughness={0.35} />
        </mesh>
        <mesh castShadow position={[0.13, 0.23, 0]}>
          <boxGeometry args={[0.18, 0.4, 0.22]} />
          <meshStandardMaterial color="#aebdcb" metalness={0.55} roughness={0.35} />
        </mesh>
        <mesh castShadow position={[0, 0.62, 0]}>
          <boxGeometry args={[0.48, 0.48, 0.3]} />
          <meshStandardMaterial color="#e2e8ec" metalness={0.55} roughness={0.3} />
        </mesh>
        <mesh castShadow position={[0, 0.62, 0.16]}>
          <boxGeometry args={[0.09, 0.38, 0.02]} />
          <meshStandardMaterial color="#486e9b" />
        </mesh>
        <mesh castShadow position={[0, 1.02, 0]}>
          <sphereGeometry args={[0.22, 16, 12]} />
          <meshStandardMaterial color="#edf1f3" metalness={0.6} roughness={0.28} />
        </mesh>
        <mesh position={[0, 1.02, 0.2]}>
          <boxGeometry args={[0.28, 0.07, 0.04]} />
          <meshStandardMaterial color="#45627a" />
        </mesh>
        <mesh castShadow position={[-0.34, 0.65, 0]} rotation={[0, 0, -0.15]}>
          <boxGeometry args={[0.16, 0.42, 0.2]} />
          <meshStandardMaterial color="#cbd6df" metalness={0.5} roughness={0.35} />
        </mesh>
        <mesh castShadow position={[0.34, 0.65, 0]} rotation={[0, 0, 0.15]}>
          <boxGeometry args={[0.16, 0.42, 0.2]} />
          <meshStandardMaterial color="#cbd6df" metalness={0.5} roughness={0.35} />
        </mesh>
        <mesh castShadow position={[-0.4, 0.62, 0.16]}>
          <boxGeometry args={[0.3, 0.4, 0.08]} />
          <meshStandardMaterial color="#668bb1" metalness={0.4} roughness={0.4} />
        </mesh>
        <mesh castShadow position={[0.43, 0.72, 0.1]} rotation={[0, 0, -0.15]}>
          <boxGeometry args={[0.07, 0.65, 0.06]} />
          <meshStandardMaterial color="#f3f5ef" metalness={0.65} roughness={0.25} />
        </mesh>
        <mesh position={[0.43, 0.42, 0.1]} rotation={[0, 0, -0.15]}>
          <boxGeometry args={[0.23, 0.05, 0.08]} />
          <meshStandardMaterial color="#d4b775" metalness={0.5} />
        </mesh>
      </group>
    </group>
  )
}
