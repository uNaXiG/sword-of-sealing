import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, OrthographicCamera } from '@react-three/drei'
import { MOUSE } from 'three'
import { useMemo, useState, type RefObject } from 'react'
import GridMap from './GridMap'
import UnitPlaceholder from './UnitPlaceholder'
import AttackAnimationController from './AttackAnimationController'
import DeathAnimationController from './DeathAnimationController'
import Environment from './Environment'
import ObstacleMap from './ObstacleMap'
import { useBattleMovement } from '../hooks/useBattleMovement'
import type { Cell } from '../../../game/grid/grid.types'
import { cellKey } from '../../../game/grid/grid.utils'
import '../BattleScene.css'
import { useAttackAnimation } from '../hooks/useAttackAnimation'
import { useDeathAnimation } from '../hooks/useDeathAnimation'
import BattleHUD from './BattleHUD'
import BattleResultOverlay from './BattleResultOverlay'

function FitCamera() {
  const { size } = useThree()
  return <OrthographicCamera makeDefault position={[12, 16, 12]} zoom={Math.min(size.width / 16, size.height / 14)} near={0.1} far={100} />
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
    units, obstacles, selectedUnit, selectedAttackTarget, selectedAttackTargetDistance, lastAttackResult,
    motion, lastMove, reachable, interactionMode, selectedAttackTargetId,
    attackRange, attackableTargets, attackableTargetIds, attackableTargetCells,
    canUndoMove, canEnterMoveMode, canEnterAttackMode, canConfirmAttack, canStandby, battleBusy, selectUnit, clearSelection, standby, selectCell,
    finishMove, cancelMove, undoMove, setInteractionMode, cancelMoveMode, cancelAttack, confirmAttack,
    impactAttack, completeAttack, abortAttack, attackMotion, confirmedImpacts, deathMotions, defeatedUnits,
    consumeImpact, completeDeath, abortDeath,
    activeUnit,
    pendingTurnCompletion,
  } = useBattleMovement()
  const { clockRef, onImpact, onComplete, onAbort } = useAttackAnimation(impactAttack, completeAttack, abortAttack)
  const {
    deathClockRef,
    onComplete: onDeathComplete,
    onAbort: onDeathAbort,
  } = useDeathAnimation(completeDeath, abortDeath)
  const [hoveredCell, setHoveredCell] = useState<Cell | null>(null)
  const [indicatorPortalElement, setIndicatorPortalElement] = useState<HTMLDivElement | null>(null)
  const indicatorPortal = useMemo<RefObject<HTMLElement> | null>(
    () => indicatorPortalElement ? { current: indicatorPortalElement } : null,
    [indicatorPortalElement],
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
  const activityMessage = attackMotion
    ? `${units.find((unit) => unit.id === attackMotion.attackerId)?.name ?? '角色'}正在攻擊……`
    : deathMotions.length > 0
      ? units.length > 0 ? '正在結算死亡動畫……' : '正在結算戰鬥單位……'
      : null
  const combatFeedback = lastAttackResult && attackResultAttacker && attackResultTarget
    ? `${attackResultAttacker.name} 對 ${attackResultTarget.name} 造成 ${lastAttackResult.damage} 點傷害${
      lastAttackResult.appliedDamage !== lastAttackResult.damage
        ? `（實際扣除 ${lastAttackResult.appliedDamage} 點 HP）`
        : ''
    }${lastAttackResult.isDefeated ? `；${attackResultTarget.name}失去戰鬥能力。` : '。'}`
    : null
  const clearBattleSelection = () => {
    setHoveredCell(null)
    clearSelection()
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
  }
  const handleConfirmAttack = () => {
    setHoveredCell(null)
    confirmAttack()
  }
  const handleRestart = () => requestRestart(generation)

  return (
    <main className="battle-screen">
      <div className="battle-canvas">
        <Canvas
          orthographic
          shadows
          onPointerMissed={clearBattleSelection}
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
            onSelect={selectCell}
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
              onSelect={selectUnit}
              onMoveComplete={finishMove}
              onMoveCancelled={cancelMove}
            />
          ))}
          <FitCamera />
          <OrbitControls makeDefault enableDamping minZoom={12} maxZoom={140} maxPolarAngle={Math.PI / 2.1} target={[0, 0, 0]} mouseButtons={{ LEFT: MOUSE.PAN, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.ROTATE }} />
        </Canvas>
      </div>
      <div className="battle-world-indicator-layer" ref={setIndicatorPortalElement} aria-hidden="true" />
      <BattleHUD
        activeUnit={activeUnit}
        selectedUnit={selectedUnit}
        interactionMode={interactionMode}
        canEnterMoveMode={canEnterMoveMode}
        canEnterAttackMode={canEnterAttackMode}
        canConfirmAttack={canConfirmAttack}
        canStandby={canStandby}
        canUndoMove={canUndoMove}
        hasUndoRecord={lastMove?.unitId === selectedUnit?.id}
        battleBusy={battleBusy}
        pendingTurnCompletion={pendingTurnCompletion !== null}
        attackableTargetCount={attackableTargets.length}
        selectedAttackTarget={selectedAttackTarget}
        selectedAttackTargetDistance={selectedAttackTargetDistance}
        activityMessage={activityMessage}
        combatFeedback={combatFeedback}
        onMoveMode={handleMoveMode}
        onAttackMode={handleAttackMode}
        onUndoMove={handleUndoMove}
        onStandby={handleStandby}
        onCancelMoveMode={handleCancelMoveMode}
        onConfirmAttack={handleConfirmAttack}
        onCancelAttack={handleCancelAttack}
      />
      {outcome !== null && (
        <BattleResultOverlay outcome={outcome} onRestart={handleRestart} />
      )}
    </main>
  )
}
