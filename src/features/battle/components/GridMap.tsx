import type { ThreeEvent } from '@react-three/fiber'
import { cellPosition, knightCell, type Cell } from './grid'

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
  selected,
  onSelect,
}: {
  selected: Cell | null
  onSelect: (cell: Cell) => void
}) {
  return (
    <group>
      {Array.from({ length: 64 }, (_, index) => {
        const cell = { column: index % 8, row: Math.floor(index / 8) }
        const occupied = cell.column === knightCell.column && cell.row === knightCell.row
        const isSelected = selected?.column === cell.column && selected.row === cell.row
        const handleClick = (event: ThreeEvent<MouseEvent>) => {
          event.stopPropagation()
          onSelect(cell)
        }

        return (
          <group key={index} position={cellPosition(cell)}>
            <mesh position={[0, 0.035, 0]} receiveShadow onClick={handleClick}>
              <boxGeometry args={[0.97, 0.07, 0.97]} />
              <meshStandardMaterial color={(cell.column + cell.row) % 2 === 0 ? '#81b878' : '#75aa6d'} roughness={1} />
            </mesh>
            {occupied && <CellOutline color="#f4d36d" height={0.08} />}
            {isSelected && <CellOutline color="#5bbff4" height={0.1} />}
          </group>
        )
      })}
    </group>
  )
}
