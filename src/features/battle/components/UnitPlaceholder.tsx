import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import type { BattleUnit } from '../../../game/battle/battle.types'
import type { Cell } from '../../../game/grid/grid.types'
import { cellPosition } from './grid'
import UnitLabel from './UnitLabel'

const unitColors: Record<BattleUnit['class'], { armor: string; accent: string; head: string }> = {
  knight: { armor: '#e2e8ec', accent: '#486e9b', head: '#edf1f3' },
  mage: { armor: '#e4dbf0', accent: '#8667a4', head: '#f0d7bc' },
  rogue: { armor: '#abc8b4', accent: '#3e806d', head: '#e4c4a4' },
  goblin: { armor: '#a77b70', accent: '#983f3a', head: '#8ebc73' },
}

export default function UnitPlaceholder({
  unit,
  selected,
  path,
  onSelect,
  onMoveComplete,
}: {
  unit: BattleUnit
  selected: boolean
  path: Cell[] | null
  onSelect: (unitId: string) => void
  onMoveComplete: (unitId: string) => void
}) {
  const group = useRef<Group>(null)
  const progress = useRef(0)
  const completed = useRef(false)

  useEffect(() => {
    progress.current = 0
    completed.current = false
    if (!path) return

    return () => {
      if (completed.current) return
      completed.current = true
      onMoveComplete(unit.id)
    }
  }, [path, unit.id, onMoveComplete])

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
      onMoveComplete(unit.id)
    }
  })

  return (
    <group ref={group} position={cellPosition(unit.position)}>
      <UnitLabel unit={unit} />
      <mesh position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.31, selected ? 0.43 : 0.36, 32]} />
        <meshBasicMaterial color={selected ? '#ffe475' : unit.faction === 'enemy' ? '#e27063' : '#91c9ef'} />
      </mesh>
      <group
        position={[0, 0.08, 0]}
        rotation={[0, Math.PI / 4, 0]}
        onClick={(event) => { event.stopPropagation(); onSelect(unit.id) }}
      >
        <mesh castShadow position={[-0.13, 0.23, 0]}>
          <boxGeometry args={[0.18, 0.4, 0.22]} />
          <meshStandardMaterial color={unitColors[unit.class].armor} metalness={0.35} roughness={0.45} />
        </mesh>
        <mesh castShadow position={[0.13, 0.23, 0]}>
          <boxGeometry args={[0.18, 0.4, 0.22]} />
          <meshStandardMaterial color={unitColors[unit.class].armor} metalness={0.35} roughness={0.45} />
        </mesh>
        <mesh castShadow position={[0, 0.62, 0]}>
          <boxGeometry args={[0.48, 0.48, 0.3]} />
          <meshStandardMaterial color={unitColors[unit.class].armor} metalness={0.45} roughness={0.35} />
        </mesh>
        <mesh castShadow position={[0, 0.62, 0.16]}>
          <boxGeometry args={[0.09, 0.38, 0.02]} />
          <meshStandardMaterial color={unitColors[unit.class].accent} />
        </mesh>
        <mesh castShadow position={[0, 1.02, 0]}>
          <sphereGeometry args={[0.22, 16, 12]} />
          <meshStandardMaterial color={unitColors[unit.class].head} metalness={unit.class === 'knight' ? 0.6 : 0} roughness={0.4} />
        </mesh>
        {unit.class === 'knight' && (
          <mesh position={[0, 1.02, 0.2]}>
            <boxGeometry args={[0.28, 0.07, 0.04]} />
            <meshStandardMaterial color="#45627a" />
          </mesh>
        )}
        {unit.class === 'mage' && (
          <mesh castShadow position={[0, 1.34, 0]}>
            <coneGeometry args={[0.25, 0.42, 12]} />
            <meshStandardMaterial color={unitColors.mage.accent} />
          </mesh>
        )}
        {unit.class === 'goblin' && ([-1, 1] as const).map((side) => (
          <mesh key={side} position={[side * 0.25, 1.02, 0]} rotation={[0, 0, side * -1]}>
            <coneGeometry args={[0.08, 0.25, 8]} />
            <meshStandardMaterial color={unitColors.goblin.head} />
          </mesh>
        ))}
        <mesh castShadow position={[-0.34, 0.65, 0]} rotation={[0, 0, -0.15]}>
          <boxGeometry args={[0.16, 0.42, 0.2]} />
          <meshStandardMaterial color={unitColors[unit.class].armor} metalness={0.35} roughness={0.4} />
        </mesh>
        <mesh castShadow position={[0.34, 0.65, 0]} rotation={[0, 0, 0.15]}>
          <boxGeometry args={[0.16, 0.42, 0.2]} />
          <meshStandardMaterial color={unitColors[unit.class].armor} metalness={0.35} roughness={0.4} />
        </mesh>
        <mesh castShadow position={[-0.4, 0.62, 0.16]}>
          <boxGeometry args={[0.3, 0.4, 0.08]} />
          <meshStandardMaterial color={unitColors[unit.class].accent} metalness={0.3} roughness={0.45} />
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
