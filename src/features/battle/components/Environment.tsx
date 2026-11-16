function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.12, 0.18, 0.96, 7]} />
        <meshStandardMaterial color="#80634b" />
      </mesh>
      <mesh castShadow position={[0, 1.15, 0]}>
        <coneGeometry args={[0.68, 1.3, 8]} />
        <meshStandardMaterial color="#487b52" />
      </mesh>
      <mesh castShadow position={[0, 1.62, 0]}>
        <coneGeometry args={[0.48, 1.05, 8]} />
        <meshStandardMaterial color="#659961" />
      </mesh>
    </group>
  )
}

function Tower({ x }: { x: number }) {
  return (
    <group position={[x, 0, -7.3]}>
      <mesh castShadow receiveShadow position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.75, 0.85, 2.6, 8]} />
        <meshStandardMaterial color="#e2dfcd" />
      </mesh>
      <mesh castShadow position={[0, 3.05, 0]}>
        <coneGeometry args={[1.02, 1.05, 8]} />
        <meshStandardMaterial color="#6684a0" />
      </mesh>
    </group>
  )
}

export default function Environment() {
  const trees: [number, number, number][] = [
    [-6.2, 0, -5], [-7.2, 0, -2.2], [-6, 0, 1], [-7.1, 0, 4.7],
    [6.3, 0, -4.7], [7, 0, -1.5], [6.2, 0, 2], [7, 0, 5],
  ]
  const rocks: [number, number, number][] = [
    [-5, 0.19, -4.8], [-5.7, 0.19, 3.4], [5.2, 0.19, -2.4],
    [5.4, 0.19, 4.8], [-3.8, 0.19, 5.5], [3.8, 0.19, 5.6],
  ]

  return (
    <group>
      <mesh receiveShadow position={[0, -0.06, 0]}>
        <boxGeometry args={[18, 0.12, 18]} />
        <meshStandardMaterial color="#a1c88c" roughness={1} />
      </mesh>
      {trees.map((position, index) => <Tree key={index} position={position} scale={index % 2 === 0 ? 1 : 0.8} />)}
      {rocks.map((position, index) => (
        <mesh key={index} position={position} rotation={[0, index, 0]} scale={[0.55, 0.35, 0.42]} castShadow receiveShadow>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={index % 2 ? '#a9aaa0' : '#c1c2b4'} roughness={1} />
        </mesh>
      ))}
      <mesh castShadow receiveShadow position={[0, 0.8, -7.3]}>
        <boxGeometry args={[10, 1.6, 0.7]} />
        <meshStandardMaterial color="#e6e2d0" />
      </mesh>
      {Array.from({ length: 11 }, (_, index) => (
        <mesh key={index} castShadow position={[index - 5, 1.72, -7.3]}>
          <boxGeometry args={[0.55, 0.25, 0.75]} />
          <meshStandardMaterial color="#ece7d4" />
        </mesh>
      ))}
      <Tower x={-5.2} />
      <Tower x={5.2} />
    </group>
  )
}
