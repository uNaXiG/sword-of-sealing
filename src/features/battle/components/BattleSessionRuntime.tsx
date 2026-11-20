import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, OrthographicCamera } from '@react-three/drei'
import { MOUSE, type Object3D } from 'three'
import { useCallback, useMemo, useRef, useState, type RefObject } from 'react'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import GridMap from './GridMap'
import UnitPlaceholder from './UnitPlaceholder'
import AttackAnimationController from './AttackAnimationController'
import DeathAnimationController from './DeathAnimationController'
import Environment from './Environment'
import ObstacleMap from './ObstacleMap'
import { useBattleMovement } from '../hooks/useBattleMovement'
import type { Cell } from '../../../game/grid/grid.types'
import { cellKey, sameCell } from '../../../game/grid/grid.utils'
import { obstacleCell } from '../../../game/battle/obstacles'
import '../BattleScene.css'
import { useAttackAnimation } from '../hooks/useAttackAnimation'
import { useDeathAnimation } from '../hooks/useDeathAnimation'
import BattleHUD from './BattleHUD'
import BattleResultOverlay from './BattleResultOverlay'
import TurnOrderTimeline from './TurnOrderTimeline'
import { canInspectUnit, canShowBattleActionRadial, selectInspectedUnit } from '../battleHud'
import BattleCameraController from './BattleCameraController'
import { calculateInitialCameraPosition, calculateInitialCameraZoom } from '../battleCameraMath'
import { BATTLE_CAMERA_CONFIG } from '../battleCameraConfig'

function BattleOrthographicCamera() {
  const { size } = useThree()
  const [initialCamera] = useState(() => ({
    position: calculateInitialCameraPosition(),
    zoom: calculateInitialCameraZoom(size),
  }))
  return <OrthographicCamera makeDefault position={initialCamera.position} zoom={initialCamera.zoom} near={0.1} far={100} />
}

export default function BattleSessionRuntime({
  generation,
  requestRestart,
}: {
  generation: number
  requestRestart: (sourceGeneration: number) => void
}) {
  const {
    outcome,
    units, obstacles, selectedUnit, selectedAttackTarget, lastAttackResult,
    motion, lastMove, reachable, interactionMode, selectedAttackTargetId,
    attackRange, attackableTargetIds, attackableTargetCells,
    canUndoMove, canEnterMoveMode, canEnterAttackMode, canConfirmAttack, canStandby, battleBusy, selectUnit, standby, selectCell,
    finishMove, cancelMove, undoMove, setInteractionMode, cancelMoveMode, cancelAttack, confirmAttack,
    impactAttack, completeAttack, abortAttack, attackMotion, confirmedImpacts, deathMotions, defeatedUnits,
    consumeImpact, completeDeath, abortDeath,
    activeUnit,
    pendingTurnCompletion,
    turn,
    upcomingTurns,
  } = useBattleMovement()
  const { clockRef, onImpact, onComplete, onAbort } = useAttackAnimation(impactAttack, completeAttack, abortAttack)
  const {
    deathClockRef,
    onComplete: onDeathComplete,
    onAbort: onDeathAbort,
  } = useDeathAnimation(completeDeath, abortDeath)
  const [hoveredCell, setHoveredCell] = useState<Cell | null>(null)
  const [inspection, setInspection] = useState<{ unitId: string; turnId: number } | null>(null)
  const [attackInspection, setAttackInspection] = useState<{ unitId: string; turnId: number } | null>(null)
  const [unfocusedTurnId, setUnfocusedTurnId] = useState<number | null>(null)
  const [indicatorPortalElement, setIndicatorPortalElement] = useState<HTMLDivElement | null>(null)
  const [actionPortalElement, setActionPortalElement] = useState<HTMLDivElement | null>(null)
  const safeAreaRootRef = useRef<HTMLElement | null>(null)
  const controlsRef = useRef<OrbitControlsImpl | null>(null)
  const unitGroupsRef = useRef(new Map<string, Object3D>())
  const registerUnitGroup = useCallback((unitId: string, group: Object3D | null) => {
    if (group) unitGroupsRef.current.set(unitId, group)
    else unitGroupsRef.current.delete(unitId)
  }, [])
  const indicatorPortal = useMemo<RefObject<HTMLElement> | null>(
    () => indicatorPortalElement ? { current: indicatorPortalElement } : null,
    [indicatorPortalElement],
  )
  const actionPortal = useMemo<RefObject<HTMLElement> | null>(
    () => actionPortalElement ? { current: actionPortalElement } : null,
    [actionPortalElement],
  )
  const preview = interactionMode === 'MOVE' && hoveredCell ? reachable.get(cellKey(hoveredCell)) ?? null : null
  const attackResultAttacker = lastAttackResult
    ? units.find((unit) => unit.id === lastAttackResult.attackerId) ?? null
    : null
  const attackResultTarget = lastAttackResult
    ? units.find((unit) => unit.id === lastAttackResult.targetId)
      ?? defeatedUnits.find((record) => record.unit.id === lastAttackResult.targetId)?.unit
      ?? null
    : null
  const combatFeedback = lastAttackResult && attackResultAttacker && attackResultTarget
    ? `${attackResultAttacker.name} 對 ${attackResultTarget.name} 造成 ${lastAttackResult.damage} 點傷害`
    : null
  const inspectedUnitId = inspection?.turnId === turn.turnId ? inspection.unitId : null
  const focusUnit = unfocusedTurnId === turn.turnId
    ? null
    : selectInspectedUnit(units, inspectedUnitId, activeUnit?.id ?? null)
  const displayUnit = focusUnit && attackInspection?.turnId === turn.turnId
    ? selectInspectedUnit(units, attackInspection.unitId, focusUnit.id)
    : focusUnit
  const canInspect = canInspectUnit(interactionMode, battleBusy)
  const showActionRadial = canShowBattleActionRadial({
    activeUnit,
    selectedUnitId: selectedUnit?.id ?? null,
    displayUnitId: displayUnit?.id ?? null,
    interactionMode,
    battleBusy,
    pendingTurnCompletion: pendingTurnCompletion !== null,
  })
  const handleBlankClick = () => {
    if (interactionMode !== 'COMMAND' || battleBusy || outcome !== null) return
    setHoveredCell(null)
    setInspection(null)
    setAttackInspection(null)
    setUnfocusedTurnId(turn.turnId)
  }
  const handleCellClick = (cell: Cell) => {
    if (interactionMode === 'COMMAND' &&
      !units.some((unit) => sameCell(unit.position, cell)) &&
      !obstacles.some((obstacle) => sameCell(obstacleCell(obstacle), cell))
    ) {
      handleBlankClick()
      return
    }
    selectCell(cell)
  }
  const handleUndoMove = () => {
    setHoveredCell(null)
    undoMove()
  }
  const handleObstacleClick = (cell: Cell) => {
    if (interactionMode === 'ATTACK') {
      setHoveredCell(null)
      selectCell(cell)
    }
  }
  const handleAttackMode = () => {
    setHoveredCell(null)
    setInteractionMode('ATTACK')
  }
  const handleMoveMode = () => {
    setHoveredCell(null)
    setInteractionMode('MOVE')
  }
  const handleCancelMoveMode = () => {
    setHoveredCell(null)
    cancelMoveMode()
  }
  const handleStandby = () => {
    setHoveredCell(null)
    standby()
  }
  const handleCancelAttack = () => {
    setHoveredCell(null)
    cancelAttack()
    setInspection(null)
    setAttackInspection(null)
  }
  const handleConfirmAttack = () => {
    setHoveredCell(null)
    confirmAttack()
  }
  const handleInspectUnit = (unitId: string) => {
    if (!canInspect) return
    const unit = units.find((candidate) => candidate.id === unitId)
    if (unit && unit.hp > 0) {
      setInspection({ unitId: unit.id, turnId: turn.turnId })
      setAttackInspection(null)
      setUnfocusedTurnId(null)
    }
  }
  const handleUnitSelect = (unitId: string) => {
    if (!canInspect) return
    if (interactionMode === 'COMMAND') handleInspectUnit(unitId)
    if (interactionMode === 'ATTACK') {
      const unit = units.find((candidate) => candidate.id === unitId)
      if (unit && unit.hp > 0) {
        setAttackInspection({ unitId: unit.id, turnId: turn.turnId })
      }
    }
    if (interactionMode !== 'COMMAND' || unitId === activeUnit?.id) selectUnit(unitId)
  }
  const handleRestart = () => requestRestart(generation)

  return (
    <main className="battle-screen" ref={safeAreaRootRef}>
      <div className="battle-canvas">
        <Canvas
          orthographic
          shadows
          onPointerMissed={handleBlankClick}
          fallback={<div className="battle-error">無法啟用 WebGL，請使用支援 WebGL 的瀏覽器。</div>}
        >
          <color attach="background" args={['#c8e3eb']} />
          <ambientLight intensity={1.2} />
          <directionalLight position={[5, 12, 7]} intensity={2} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12} />
          <Environment />
          <GridMap
            position={selectedUnit?.position ?? null}
            selected={selectedUnit !== null && interactionMode === 'MOVE'}
            moving={motion !== null}
            reachable={reachable}
            obstacles={obstacles}
            interactionMode={interactionMode}
            attackRange={attackRange}
            attackableTargetCells={attackableTargetCells}
            selectedAttackTargetCell={selectedAttackTarget?.position ?? null}
            preview={preview?.path ?? null}
            onSelect={handleCellClick}
            onHover={setHoveredCell}
          />
          <ObstacleMap obstacles={obstacles} onObstacleClick={handleObstacleClick} />
          <AttackAnimationController
            attackMotion={attackMotion}
            confirmedImpacts={confirmedImpacts}
            clockRef={clockRef}
            onImpact={onImpact}
            onComplete={onComplete}
            onAbort={onAbort}
            onFeedbackComplete={consumeImpact}
          />
          <DeathAnimationController
            motions={deathMotions}
            deathClockRef={deathClockRef}
            onComplete={onDeathComplete}
            onAbort={onDeathAbort}
          />
          {units.map((unit) => (
            <UnitPlaceholder
              key={unit.id}
              unit={unit}
              selected={unit.id === selectedUnit?.id}
              activeUnitId={activeUnit?.id ?? null}
              indicatorPortal={indicatorPortal}
              attackableTarget={attackableTargetIds.has(unit.id)}
              selectedAttackTarget={unit.id === selectedAttackTargetId}
              path={motion?.unitId === unit.id ? motion.path : null}
              motionId={motion?.unitId === unit.id ? motion.motionId : null}
              attackMotion={attackMotion}
              attackClockRef={clockRef}
              confirmedImpacts={confirmedImpacts}
              deathMotion={deathMotions.find((death) => death.unitId === unit.id) ?? null}
              deathClockRef={deathClockRef}
              battleBusy={battleBusy}
              registerUnitGroup={registerUnitGroup}
              actionMenu={showActionRadial && actionPortal && unit.id === activeUnit?.id ? {
                portal: actionPortal,
                activeUnit: unit,
                canEnterMoveMode,
                canEnterAttackMode,
                canStandby,
                canUndoMove,
                hasUndoRecord: lastMove?.unitId === unit.id,
                onMoveMode: handleMoveMode,
                onAttackMode: handleAttackMode,
                onUndoMove: handleUndoMove,
                onStandby: handleStandby,
              } : null}
              onSelect={handleUnitSelect}
              onMoveComplete={finishMove}
              onMoveCancelled={cancelMove}
            />
          ))}
          <BattleOrthographicCamera />
          <BattleCameraController
            controlsRef={controlsRef}
            unitGroupsRef={unitGroupsRef}
            safeAreaRootRef={safeAreaRootRef}
            focusUnitId={focusUnit?.id ?? null}
          />
          <OrbitControls
            ref={controlsRef}
            makeDefault
            enableDamping
            enablePan={focusUnit === null}
            minZoom={BATTLE_CAMERA_CONFIG.minZoom}
            maxZoom={BATTLE_CAMERA_CONFIG.maxZoom}
            minPolarAngle={BATTLE_CAMERA_CONFIG.fixedPolarAngle}
            maxPolarAngle={BATTLE_CAMERA_CONFIG.fixedPolarAngle}
            mouseButtons={{ LEFT: MOUSE.PAN, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.ROTATE }}
          />
        </Canvas>
      </div>
      <div className="battle-world-indicator-layer" ref={setIndicatorPortalElement} aria-hidden="true" />
      <div className="battle-world-action-layer" ref={setActionPortalElement} />
      <BattleHUD
        activeUnit={activeUnit}
        displayUnit={displayUnit}
        selectedUnit={selectedUnit}
        interactionMode={interactionMode}
        canConfirmAttack={canConfirmAttack}
        battleBusy={battleBusy}
        pendingTurnCompletion={pendingTurnCompletion !== null}
        combatFeedback={combatFeedback}
        onCancelMoveMode={handleCancelMoveMode}
        onConfirmAttack={handleConfirmAttack}
        onCancelAttack={handleCancelAttack}
      />
      <TurnOrderTimeline
        turn={turn}
        units={units}
        upcomingTurns={upcomingTurns}
        inspectedUnitId={displayUnit?.id ?? null}
        baseUrl={import.meta.env.BASE_URL}
        canInspect={canInspect}
        onInspectUnit={handleInspectUnit}
      />
      {outcome !== null && (
        <BattleResultOverlay outcome={outcome} onRestart={handleRestart} />
      )}
    </main>
  )
}
