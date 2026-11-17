import { useRef, useState } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import { GRID_SIZE } from '../../../game/grid/grid.constants'
import type { Cell } from '../../../game/grid/grid.types'
import { cellKey, sameCell } from '../../../game/grid/grid.utils'
import type { ReachableTile } from '../../../game/grid/movement'
import { TERRAIN_COLORS } from '../../../game/grid/terrain.constants'
import { getTerrainType } from '../../../game/grid/terrain.data'
import { TerrainType } from '../../../game/grid/terrain.types'
import type { BattleObstacle } from '../../../game/battle/obstacles'
import { cellPosition } from './grid'

const CLICK_DRAG_THRESHOLD = 2

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
  obstacles,
  preview,
  onSelect,
  onHover,
}: {
  position: Cell | null
  selected: boolean
  moving: boolean
  reachable: ReadonlyMap<string, ReachableTile>
  obstacles: readonly BattleObstacle[]
  preview: readonly Cell[] | null
  onSelect: (cell: Cell) => void
  onHover: (cell: Cell | null) => void
}) {
  const [hovered, setHovered] = useState<string | null>(null)
  const hoveredRef = useRef<string | null>(null)
  const previewKeys = new Set((preview ?? []).slice(1).map(cellKey))

  return (
    <group>
      {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => {
        const cell = { column: index % GRID_SIZE, row: Math.floor(index / GRID_SIZE) }
        const key = cellKey(cell)
        const occupied = position !== null && sameCell(cell, position)
        const canMove = selected && !moving && reachable.has(key)
        const isOnPreviewPath = selected && !moving && previewKeys.has(key)
        const handleClick = (event: ThreeEvent<MouseEvent>) => {
          event.stopPropagation()
          if (event.delta > CLICK_DRAG_THRESHOLD) return
          onSelect(cell)
        }
        const handlePointerOver = () => {
          hoveredRef.current = key
          setHovered(key)
          onHover(cell)
        }
        const handlePointerOut = () => {
          if (hoveredRef.current !== key) return
          hoveredRef.current = null
          setHovered(null)
          onHover(null)
        }

        return (
          <group key={index} position={cellPosition(cell)}>
            <mesh
              position={[0, 0.035, 0]}
              receiveShadow
              onClick={handleClick}
              onPointerOver={handlePointerOver}
              onPointerOut={handlePointerOut}
            >
              <boxGeometry args={[0.97, 0.07, 0.97]} />
              <meshStandardMaterial
                color={TERRAIN_COLORS[getTerrainType(cell, obstacles)]}
                roughness={getTerrainType(cell, obstacles) === TerrainType.SHALLOW_WATER ? 0.45 : 1}
              />
            </mesh>
            {occupied && selected && !moving && <CellOutline color="#f4d36d" height={0.08} />}
            {(canMove || isOnPreviewPath) && (
              <mesh position={[0, 0.074, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.93, 0.93]} />
                <meshBasicMaterial color={isOnPreviewPath ? '#f5d477' : hovered === key ? '#a4e5ff' : '#4baff0'} transparent opacity={isOnPreviewPath ? 0.68 : hovered === key ? 0.62 : 0.35} depthWrite={false} />
              </mesh>
            )}
            {isOnPreviewPath && <CellOutline color="#fff0b3" height={0.085} />}
            {canMove && hovered === key && !isOnPreviewPath && <CellOutline color="#d2f3ff" height={0.085} />}
          </group>
        )
      })}
    </group>
  )
}
