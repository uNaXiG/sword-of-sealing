import { useCallback, useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color, MeshBasicMaterial, MeshStandardMaterial, type Group, type Mesh } from 'three'
import { ATTACK_ANIMATION_PROFILES } from '../../../game/battle/battle.animation'
import type {
  AttackMotion,
  BattleUnit,
  ConfirmedImpactEvent,
  DeathMotion,
} from '../../../game/battle/battle.types'
import { getDeathDirection, getDeathTimelineFrame } from '../../../game/battle/battle.death'
import type { Cell } from '../../../game/grid/grid.types'
import { cellPosition } from './grid'
import UnitLabel from './UnitLabel'
import ActiveUnitIndicator from './ActiveUnitIndicator'
import { getUnitOverheadPresentation } from '../unitPresentation'
import type { RefObject } from 'react'
import type { AttackAnimationClockRef } from '../hooks/useAttackAnimation'
import type { DeathAnimationClockMapRef } from '../hooks/useDeathAnimation'
import BattleActionRadialOverlay from './BattleActionRadialOverlay'

const unitColors: Record<BattleUnit['class'], { armor: string; accent: string; head: string }> = {
  knight: { armor: '#e2e8ec', accent: '#486e9b', head: '#edf1f3' },
  assassin: { armor: '#4d5368', accent: '#8f4d68', head: '#d9b79d' },
  mage: { armor: '#e4dbf0', accent: '#8667a4', head: '#f0d7bc' },
  cleric: { armor: '#f1ead0', accent: '#c8a94f', head: '#efd4b6' },
  ranger: { armor: '#abc8b4', accent: '#3e806d', head: '#e4c4a4' },
  goblin: { armor: '#a77b70', accent: '#983f3a', head: '#8ebc73' },
}

function isCurrentGeneration(generationRef: { current: number }, generation: number): boolean {
  return generationRef.current === generation
}

export default function UnitPlaceholder({
  unit,
  selected,
  selectedHighlight,
  activeUnitId,
  indicatorPortal,
  attackableTarget,
  selectedAttackTarget,
  path,
  motionId,
  attackMotion,
  attackClockRef,
  confirmedImpacts,
  deathMotion,
  deathClockRef,
  battleBusy,
  actionMenu,
  registerUnitGroup,
  onSelect,
  onMoveComplete,
  onMoveCancelled,
}: {
  unit: BattleUnit
  selected: boolean
  selectedHighlight: boolean
  activeUnitId: string | null
  indicatorPortal: RefObject<HTMLElement> | null
  attackableTarget: boolean
  selectedAttackTarget: boolean
  path: Cell[] | null
  motionId: number | null
  attackMotion: AttackMotion | null
  attackClockRef: AttackAnimationClockRef
  confirmedImpacts: readonly ConfirmedImpactEvent[]
  deathMotion: DeathMotion | null
  deathClockRef: DeathAnimationClockMapRef
  battleBusy: boolean
  registerUnitGroup: (unitId: string, group: Group | null) => void
  actionMenu: {
    portal: RefObject<HTMLElement>
    activeUnit: BattleUnit
    canEnterMoveMode: boolean
    canEnterAttackMode: boolean
    canStandby: boolean
    canUndoMove: boolean
    hasUndoRecord: boolean
    onMoveMode: () => void
    onAttackMode: () => void
    onUndoMove: () => void
    onStandby: () => void
  } | null
  onSelect: (unitId: string) => void
  onMoveComplete: (unitId: string, motionId: number) => void
  onMoveCancelled: (unitId: string, motionId: number) => void
}) {
  const overheadPresentation = getUnitOverheadPresentation(unit, activeUnitId)
  const active = unit.id === activeUnitId
  const group = useRef<Group>(null)
  const visualRoot = useRef<Group>(null)
  const deathPivot = useRef<Group>(null)
  const labelRoot = useRef<Group>(null)
  const selectionRing = useRef<Group>(null)
  const selectedHighlightRing = useRef<Mesh>(null)
  const selectedHighlightMaterial = useRef<MeshBasicMaterial>(null)
  const reducedMotion = useRef(false)
  const highlightElapsed = useRef(0)
  const [hoveredAttackTarget, setHoveredAttackTarget] = useState(false)
  const progress = useRef(0)
  const completed = useRef(false)
  const effectGeneration = useRef(0)
  const ringColor = selectedAttackTarget ? '#f0444c'
    : hoveredAttackTarget && attackableTarget ? '#ff8585'
      : attackableTarget ? '#d95b56'
        : selectedHighlight ? '#f2ce68'
          : selected ? '#ffe475'
        : unit.faction === 'enemy' ? '#e27063' : '#91c9ef'
  const ringRadius = selectedAttackTarget ? 0.55
    : hoveredAttackTarget && attackableTarget ? 0.53
      : attackableTarget ? 0.48
        : selected ? 0.43 : 0.36
  const materialEmissive = useRef(new WeakMap<MeshStandardMaterial, Color>())
  const materialEmissiveIntensity = useRef(new WeakMap<MeshStandardMaterial, number>())
  const materialOpacity = useRef(new WeakMap<MeshStandardMaterial, number>())
  const impactElapsed = useRef(new Map<number, number>())
  const setGroupRef = useCallback((value: Group | null) => {
    group.current = value
    registerUnitGroup(unit.id, value)
  }, [registerUnitGroup, unit.id])

  useEffect(() => {
    const generation = ++effectGeneration.current
    progress.current = 0
    completed.current = false
    if (!path || motionId === null) {
      const position = cellPosition(unit.position)
      group.current?.position.set(position[0], position[1], position[2])
      return
    }

    return () => {
      queueMicrotask(() => {
        if (!isCurrentGeneration(effectGeneration, generation) || completed.current) return
        completed.current = true
        onMoveCancelled(unit.id, motionId)
      })
    }
  }, [path, motionId, unit.id, unit.position, onMoveCancelled])

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => { reducedMotion.current = preference.matches }
    update()
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])

  useFrame((_, delta) => {
    if (path && group.current && !completed.current) {
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
        if (motionId !== null) onMoveComplete(unit.id, motionId)
      }
    }

    updateAttackVisual(
      visualRoot.current,
      unit.id,
      attackMotion,
      attackClockRef.current,
      materialEmissive.current,
      materialEmissiveIntensity.current,
    )
    updateConfirmedHitVisual(
      visualRoot.current,
      unit.id,
      confirmedImpacts,
      impactElapsed.current,
      delta,
      materialEmissive.current,
      materialEmissiveIntensity.current,
    )
    updateDeathVisual(
      deathPivot.current,
      visualRoot.current,
      labelRoot.current,
      selectionRing.current,
      deathMotion,
      deathClockRef.current,
      materialOpacity.current,
    )
    if (selectedHighlightMaterial.current) {
      if (selectedHighlight && !reducedMotion.current) {
        highlightElapsed.current += Math.max(0, delta)
        const pulse = (Math.sin(highlightElapsed.current * Math.PI * 2 / 1.25) + 1) / 2
        selectedHighlightMaterial.current.opacity = 0.62 + pulse * 0.28
        selectedHighlightRing.current?.scale.setScalar(0.98 + pulse * 0.04)
      } else {
        selectedHighlightMaterial.current.opacity = 0.82
        selectedHighlightRing.current?.scale.setScalar(1)
      }
    }
  })

  return (
    <group ref={setGroupRef} position={cellPosition(unit.position)}>
      {overheadPresentation.showNameAndHealth && (
        <group ref={labelRoot}>
          <UnitLabel unit={unit} />
        </group>
      )}
      {overheadPresentation.showActiveIndicator && indicatorPortal && (
        <ActiveUnitIndicator portal={indicatorPortal} />
      )}
      {active && actionMenu && (
        <BattleActionRadialOverlay {...actionMenu} />
      )}
      <group ref={selectionRing}>
        {active && (
          <mesh position={[0, 0.085, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.53, 0.58, 32]} />
            <meshBasicMaterial color="#82f0c3" />
          </mesh>
        )}
        {selectedHighlight && (
          <mesh
            ref={selectedHighlightRing}
            position={[0, 0.115, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            raycast={() => null}
          >
            <ringGeometry args={[0.61, 0.68, 40]} />
            <meshBasicMaterial
              ref={selectedHighlightMaterial}
              color="#f4cf67"
              transparent
              depthWrite={false}
              opacity={0.82}
            />
          </mesh>
        )}
        <mesh position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.31, ringRadius, 32]} />
          <meshBasicMaterial color={ringColor} />
        </mesh>
      </group>
      <group ref={deathPivot}>
      <group ref={visualRoot}>
      <group
        position={[0, 0.08, 0]}
        rotation={[0, Math.PI / 4, 0]}
        onPointerOver={() => {
          if (attackableTarget) setHoveredAttackTarget(true)
        }}
        onPointerOut={() => setHoveredAttackTarget(false)}
        onClick={(event) => {
          event.stopPropagation()
          if (!battleBusy) onSelect(unit.id)
        }}
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
        {(unit.class === 'mage' || unit.class === 'cleric') && (
          <group>
            <mesh castShadow position={[0, 1.34, 0]}>
              <coneGeometry args={[0.25, 0.42, 12]} />
              <meshStandardMaterial color={unitColors[unit.class].accent} />
            </mesh>
            {unit.class === 'cleric' && (
              <mesh position={[0, 1.6, 0]}>
                <torusGeometry args={[0.13, 0.035, 8, 16]} />
                <meshStandardMaterial color="#f3d982" emissive="#9d7a25" emissiveIntensity={0.25} />
              </mesh>
            )}
          </group>
        )}
        {unit.class === 'ranger' && (
          <mesh castShadow position={[-0.46, 0.74, 0]} rotation={[0, 0, 0.1]}>
            <torusGeometry args={[0.34, 0.025, 6, 16, Math.PI * 1.5]} />
            <meshStandardMaterial color="#79542e" />
          </mesh>
        )}
        {unit.class === 'assassin' && (
          <mesh castShadow position={[0.54, 0.68, 0]} rotation={[0, 0, 0.25]}>
            <boxGeometry args={[0.05, 0.5, 0.05]} />
            <meshStandardMaterial color="#dbe1e5" metalness={0.7} roughness={0.2} />
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
      </group>
    </group>
  )
}

function updateAttackVisual(
  visualRoot: Group | null,
  unitId: string,
  motion: AttackMotion | null,
  clock: AttackAnimationClockRef['current'],
  emissiveColors: WeakMap<MeshStandardMaterial, Color>,
  emissiveIntensities: WeakMap<MeshStandardMaterial, number>,
) {
  if (!visualRoot) return
  if (!motion || !clock || motion.attackId !== clock.attackId) {
    visualRoot.position.set(0, 0, 0)
    visualRoot.rotation.set(0, 0, 0)
    setHitFlash(visualRoot, 0, emissiveColors, emissiveIntensities)
    return
  }

  const profile = ATTACK_ANIMATION_PROFILES[motion.animationType]
  const frame = clock.frame
  const isAttacker = motion.attackerId === unitId
  const start = cellPosition(motion.from)
  const end = cellPosition(motion.to)
  const directionX = end[0] - start[0]
  const directionZ = end[2] - start[2]
  const directionLength = Math.hypot(directionX, directionZ)
  const normalizedX = directionLength > 0 ? directionX / directionLength : 0
  const normalizedZ = directionLength > 0 ? directionZ / directionLength : 0

  visualRoot.position.set(0, 0, 0)
  visualRoot.rotation.set(0, 0, 0)
  if (isAttacker) {
    visualRoot.rotation.y = Math.atan2(normalizedX, normalizedZ) - Math.PI / 4
    const melee = profile.lungeDistance > 0
    const attackProgress = frame.stage === 'ATTACK' ? frame.stageProgress : frame.stage === 'RECOVERY' ? 1 - frame.stageProgress : 0
    const offset = melee ? Math.sin(Math.max(0, Math.min(1, attackProgress)) * Math.PI / 2) * profile.lungeDistance : 0
    visualRoot.position.set(normalizedX * offset, 0, normalizedZ * offset)
    visualRoot.rotation.z = melee && frame.stage !== 'COMPLETED' ? -Math.sin(frame.elapsedRatio * Math.PI * 2) * 0.08 : 0
  }

}

function updateConfirmedHitVisual(
  visualRoot: Group | null,
  unitId: string,
  impacts: readonly ConfirmedImpactEvent[],
  elapsedByImpact: Map<number, number>,
  delta: number,
  emissiveColors: WeakMap<MeshStandardMaterial, Color>,
  emissiveIntensities: WeakMap<MeshStandardMaterial, number>,
) {
  if (!visualRoot) return
  const impact = impacts.findLast((candidate) => candidate.targetId === unitId)
  const activeIds = new Set(impacts.map((candidate) => candidate.impactId))
  for (const id of elapsedByImpact.keys()) if (!activeIds.has(id)) elapsedByImpact.delete(id)
  if (!impact) {
    setHitFlash(visualRoot, 0, emissiveColors, emissiveIntensities)
    return
  }
  const elapsed = (elapsedByImpact.get(impact.impactId) ?? 0) + Math.max(0, Number.isFinite(delta) ? delta * 1000 : 0)
  elapsedByImpact.set(impact.impactId, elapsed)
  if (elapsed <= 160) {
    const strength = 1 - elapsed / 160
    visualRoot.position.x = Math.sin(elapsed * 0.18) * 0.06 * strength
    visualRoot.position.z = Math.cos(elapsed * 0.14) * 0.035 * strength
    setHitFlash(visualRoot, Math.min(1, 1 - elapsed / 130), emissiveColors, emissiveIntensities)
  } else {
    setHitFlash(visualRoot, 0, emissiveColors, emissiveIntensities)
  }
}

function updateDeathVisual(
  pivot: Group | null,
  visualRoot: Group | null,
  labelRoot: Group | null,
  selectionRing: Group | null,
  motion: DeathMotion | null,
  clockMap: DeathAnimationClockMapRef['current'],
  materialOpacity: WeakMap<MeshStandardMaterial, number>,
) {
  if (!pivot || !visualRoot) return
  if (!motion) {
    pivot.rotation.set(0, 0, 0)
    pivot.position.set(0, 0, 0)
    if (labelRoot) labelRoot.visible = true
    if (selectionRing) selectionRing.visible = true
    setModelOpacity(visualRoot, 1, materialOpacity)
    return
  }
  const clock = clockMap.get(motion.deathId)
  const frame = getDeathTimelineFrame(clock?.elapsedMs ?? 0)
  const direction = getDeathDirection(motion)
  const length = Math.hypot(direction.column, direction.row)
  const x = length > 0 ? direction.column / length : 0
  const z = length > 0 ? direction.row / length : 1
  const collapseProgress = frame.stage === 'COLLAPSE'
    ? frame.stageProgress
    : frame.stage === 'DISSOLVE' || frame.stage === 'COMPLETED'
      ? 1
      : 0
  const angle = collapseProgress * Math.PI / 2
  pivot.rotation.x = z * angle
  pivot.rotation.z = -x * angle
  pivot.position.y = collapseProgress * 0.04
  if (selectionRing) selectionRing.visible = false
  if (labelRoot) labelRoot.visible = frame.stage !== 'DISSOLVE' && frame.stage !== 'COMPLETED'
  setModelOpacity(
    visualRoot,
    frame.stage === 'DISSOLVE' ? 1 - frame.stageProgress : frame.stage === 'COMPLETED' ? 0 : 1,
    materialOpacity,
  )
}

function setHitFlash(
  root: Group,
  amount: number,
  emissiveColors: WeakMap<MeshStandardMaterial, Color>,
  emissiveIntensities: WeakMap<MeshStandardMaterial, number>,
) {
  root.traverse((object) => {
    if (!(object as Mesh).isMesh) return
    const mesh = object as Mesh
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    for (const material of materials) {
      if (!(material instanceof MeshStandardMaterial)) continue
      if (!emissiveColors.has(material)) {
        emissiveColors.set(material, material.emissive.clone())
        emissiveIntensities.set(material, material.emissiveIntensity)
      }

      const baseColor = emissiveColors.get(material)!
      const baseIntensity = emissiveIntensities.get(material) ?? 1
      material.emissive.copy(baseColor).lerp(new Color('#ffffff'), amount)
      material.emissiveIntensity = baseIntensity + amount * 2
    }
  })
}

function setModelOpacity(
  root: Group,
  amount: number,
  materialOpacity: WeakMap<MeshStandardMaterial, number>,
) {
  root.traverse((object) => {
    if (!(object as Mesh).isMesh) return
    const mesh = object as Mesh
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    for (const material of materials) {
      if (!(material instanceof MeshStandardMaterial)) continue
      if (!materialOpacity.has(material)) materialOpacity.set(material, material.opacity)
      material.opacity = materialOpacity.get(material)! * amount
      material.transparent = amount < 1 || materialOpacity.get(material)! < 1
      material.depthWrite = amount >= 0.99
    }
  })
}
