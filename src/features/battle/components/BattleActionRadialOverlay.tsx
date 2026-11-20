import { Html } from '@react-three/drei'
import { useCallback, useEffect, useMemo, useRef, type RefObject } from 'react'
import { Object3D, Vector3, type Camera } from 'three'
import type { BattleUnit } from '../../../game/battle/battle.types'
import { calculateRadialScreenPosition, type ScreenRect } from '../battleRadialMenuProjection'
import BattleActionRadialMenu from './BattleActionRadialMenu'

export default function BattleActionRadialOverlay({
  activeUnit,
  portal,
  canEnterMoveMode,
  canEnterAttackMode,
  canStandby,
  canUndoMove,
  hasUndoRecord,
  onMoveMode,
  onAttackMode,
  onUndoMove,
  onStandby,
}: {
  activeUnit: BattleUnit
  portal: RefObject<HTMLElement>
  canEnterMoveMode: boolean
  canEnterAttackMode: boolean
  canStandby: boolean
  canUndoMove: boolean
  hasUndoRecord: boolean
  onMoveMode: () => void
  onAttackMode: () => void
  onUndoMove: () => void
  onStandby: () => void
}) {
  const projected = useMemo(() => new Vector3(), [])
  const reservedRegions = useRef<ScreenRect[]>([])
  const calculatePosition = useCallback(
    (object: Object3D, camera: Camera, size: { width: number; height: number }) =>
      calculateRadialScreenPosition(object, camera, size, projected, reservedRegions.current),
    [projected],
  )

  useEffect(() => {
    const root = portal.current?.parentElement
    if (!root) return
    const updateReservedRegions = () => {
      reservedRegions.current = [...root.querySelectorAll('.turn-timeline, .battle-hud__status')]
        .map((element) => element.getBoundingClientRect())
        .map(({ left, top, right, bottom }) => ({ left, top, right, bottom }))
    }
    updateReservedRegions()
    const elements = [...root.querySelectorAll('.turn-timeline, .battle-hud__status')]
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateReservedRegions)
      return () => window.removeEventListener('resize', updateReservedRegions)
    }
    const observer = new ResizeObserver(updateReservedRegions)
    for (const element of elements) observer.observe(element)
    window.addEventListener('resize', updateReservedRegions)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateReservedRegions)
    }
  }, [portal])

  return (
    <Html
      center
      portal={portal}
      position={[0, 0.95, 0]}
      pointerEvents="none"
      zIndexRange={[8, 8]}
      calculatePosition={calculatePosition}
    >
      <BattleActionRadialMenu
        activeUnit={activeUnit}
        canEnterMoveMode={canEnterMoveMode}
        canEnterAttackMode={canEnterAttackMode}
        canStandby={canStandby}
        canUndoMove={canUndoMove}
        hasUndoRecord={hasUndoRecord}
        onMoveMode={onMoveMode}
        onAttackMode={onAttackMode}
        onUndoMove={onUndoMove}
        onStandby={onStandby}
      />
    </Html>
  )
}
