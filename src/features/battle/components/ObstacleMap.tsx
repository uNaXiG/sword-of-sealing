import { obstacleCell, type BattleObstacle } from '../../../game/battle/obstacles'
import { cellPosition } from './grid'

function ObstacleModel({ obstacle }: { obstacle: BattleObstacle }) {
  if (obstacle.type === 'rock') {
    return (
      <mesh position={[0, 0.26, 0]} scale={[0.39, 0.27, 0.36]} castShadow receiveShadow>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#a6a99d" roughness={1} />
      </mesh>
    )
  }
  if (obstacle.type === 'tree') {
    return (
      <group>
        <mesh position={[0, 0.32, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.12, 0.55, 7]} />
          <meshStandardMaterial color="#80634b" />
        </mesh>
        <mesh position={[0, 0.7, 0]} castShadow>
          <coneGeometry args={[0.39, 0.8, 8]} />
          <meshStandardMaterial color="#487b52" />
        </mesh>
        <mesh position={[0, 0.99, 0]} castShadow>
          <coneGeometry args={[0.29, 0.62, 8]} />
          <meshStandardMaterial color="#659961" />
        </mesh>
      </group>
    )
  }
  return (
    <group>
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.82, 0.48, 0.38]} />
        <meshStandardMaterial color="#d3d0be" roughness={1} />
      </mesh>
      {([-1, 1] as const).map((side) => (
        <mesh key={side} position={[side * 0.23, 0.56, 0]} castShadow>
          <boxGeometry args={[0.34, 0.12, 0.4]} />
          <meshStandardMaterial color="#e2decc" roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

export default function ObstacleMap({ obstacles }: { obstacles: readonly BattleObstacle[] }) {
  return (
    <group>
      {obstacles.map((obstacle) => (
        <group key={obstacle.id} position={cellPosition(obstacleCell(obstacle))} onClick={(event) => event.stopPropagation()}>
          <ObstacleModel obstacle={obstacle} />
        </group>
      ))}
    </group>
  )
}
