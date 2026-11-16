import { useState } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import { GRID_SIZE } from '../../../game/grid/grid.constants'
import type { Cell } from '../../../game/grid/grid.types'
import { cellKey, sameCell } from '../../../game/grid/grid.utils'
import { cellPosition } from './grid'

function CellOutline({ color, height }: { color: string; height: number }) {
  return (
    <group position={[0, height, 0]}>
      {([-1, 1] as const).map((side) => (
        <group key={side}>
          <mesh position={[side * 0.465, 0, 0]}>
            <boxGeometry args={[0.035, 0.014, 0.965]} />
            <meshBasicMaterial color={color} />
          </mesh>
          <mesh position={[0, 0, side * 0.465]}>
            <boxGeometry args={[0.965, 0.014, 0.035]} />
            <meshBasicMaterial color={color} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export default function GridMap({
  position,
  selected,
  moving,
  reachable,
  onSelect,
}: {
  position: Cell
  selected: boolean
  moving: boolean
  reachable: ReadonlyMap<string, Cell[]>
  onSelect: (cell: Cell) => void
}) {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <group>
      {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => {
        const cell = { column: index % GRID_SIZE, row: Math.floor(index / GRID_SIZE) }
        const key = cellKey(cell)
        const occupied = sameCell(cell, position)
        const canMove = selected && !moving && reachable.has(key)
        const handleClick = (event: ThreeEvent<MouseEvent>) => {
          event.stopPropagation()
          onSelect(cell)
        }

        return (
          <group key={index} position={cellPosition(cell)}>
            <mesh
              position={[0, 0.035, 0]}
              receiveShadow
              onClick={handleClick}
              onPointerOver={() => setHovered(key)}
              onPointerOut={() => setHovered(null)}
            >
              <boxGeometry args={[0.97, 0.07, 0.97]} />
              <meshStandardMaterial color={(cell.column + cell.row) % 2 === 0 ? '#81b878' : '#75aa6d'} roughness={1} />
            </mesh>
            {occupied && selected && !moving && <CellOutline color="#f4d36d" height={0.08} />}
            {canMove && (
              <mesh position={[0, 0.074, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.93, 0.93]} />
                <meshBasicMaterial color={hovered === key ? '#a4e5ff' : '#4baff0'} transparent opacity={hovered === key ? 0.62 : 0.35} depthWrite={false} />
              </mesh>
            )}
            {canMove && hovered === key && <CellOutline color="#d2f3ff" height={0.085} />}
          </group>
        )
      })}
    </group>
  )
}
