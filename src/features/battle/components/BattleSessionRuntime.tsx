import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, OrthographicCamera } from '@react-three/drei'
import { MOUSE } from 'three'
import { useState } from 'react'
import GridMap from './GridMap'
import UnitPlaceholder from './UnitPlaceholder'
import AttackAnimationController from './AttackAnimationController'
import DeathAnimationController from './DeathAnimationController'
import Environment from './Environment'
import ObstacleMap from './ObstacleMap'
import { useBattleMovement } from '../hooks/useBattleMovement'
import type { Cell } from '../../../game/grid/grid.types'
import { cellKey } from '../../../game/grid/grid.utils'
import { CLASS_DEFINITIONS } from '../../../game/classes/class.data'
import { ATTACK_PATTERN_NAMES } from '../../../game/classes/class.types'
import '../BattleScene.css'
import { useAttackAnimation } from '../hooks/useAttackAnimation'
import { useDeathAnimation } from '../hooks/useDeathAnimation'
import BattleTurnHUD from './BattleTurnHUD'
import TurnOrderTimeline from './TurnOrderTimeline'
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
    turn, activeUnit, upcomingTurns,
    pendingTurnCompletion,
  } = useBattleMovement()
  const { clockRef, onImpact, onComplete, onAbort } = useAttackAnimation(impactAttack, completeAttack, abortAttack)
  const {
    deathClockRef,
    onComplete: onDeathComplete,
    onAbort: onDeathAbort,
  } = useDeathAnimation(completeDeath, abortDeath)
  const [hoveredCell, setHoveredCell] = useState<Cell | null>(null)
  const preview = interactionMode === 'MOVE' && hoveredCell ? reachable.get(cellKey(hoveredCell)) ?? null : null
  const attackResultAttacker = lastAttackResult
    ? units.find((unit) => unit.id === lastAttackResult.attackerId) ?? null
    : null
  const attackResultTarget = lastAttackResult
    ? units.find((unit) => unit.id === lastAttackResult.targetId)
      ?? defeatedUnits.find((record) => record.unit.id === lastAttackResult.targetId)?.unit
      ?? null
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
              active={unit.id === activeUnit?.id}
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
      <header className="battle-header">
        <div>
          <p>封印之劍 · 場景預覽</p>
          <h1>王國邊境</h1>
          <span>8 × 8 戰場測試</span>
        </div>
        <a href="#">返回主選單</a>
      </header>
      <BattleTurnHUD turn={turn} activeUnit={activeUnit} />
      <TurnOrderTimeline turn={turn} units={units} upcomingTurns={upcomingTurns} />
      <aside className="battle-info" aria-live="polite">
        <div className="battle-info-title">✦ 戰場資訊</div>
        {selectedUnit && (
          <div className="battle-selection">
            <p>{selectedUnit.name} · {CLASS_DEFINITIONS[selectedUnit.class].name}</p>
            <p>HP：{selectedUnit.hp} / {selectedUnit.maxHp} · SP：{selectedUnit.sp} / {selectedUnit.maxSp}</p>
            <p>ATK：{selectedUnit.atk} · DEF：{selectedUnit.def} · AGI：{selectedUnit.agi} · MOV：{selectedUnit.movementPoints}</p>
            <p>
              攻擊距離：{selectedUnit.minAttackRange === selectedUnit.attackRange
                ? selectedUnit.attackRange
                : `${selectedUnit.minAttackRange}–${selectedUnit.attackRange}`}（{ATTACK_PATTERN_NAMES[selectedUnit.attackPattern]}）
            </p>
          </div>
        )}
        {attackMotion && (
          <p className="battle-animation-status" role="status">
            {units.find((unit) => unit.id === attackMotion.attackerId)?.name ?? '角色'}正在攻擊……
          </p>
        )}
        {!attackMotion && deathMotions.length > 0 && (
          <p className="battle-animation-status" role="status">
            {units.length > 0 ? '正在結算死亡動畫……' : '正在結算戰鬥單位……'}
          </p>
        )}
        {selectedUnit && !battleBusy && !pendingTurnCompletion && interactionMode === 'COMMAND' && (
          <div className="battle-actions">
            {canEnterMoveMode && (
              <button className="battle-deselect" type="button" onClick={handleMoveMode}>移動</button>
            )}
            {canEnterAttackMode && (
              <button className="battle-deselect" type="button" onClick={handleAttackMode}>攻擊</button>
            )}
            {lastMove?.unitId === selectedUnit.id && (
              <button className="battle-deselect battle-undo" type="button" disabled={!canUndoMove} onClick={handleUndoMove}>
                取消
              </button>
            )}
            <button className="battle-deselect" type="button" disabled={!canStandby} onClick={handleStandby}>待命</button>
          </div>
        )}
        {selectedUnit && !motion && interactionMode === 'MOVE' && (
          <div className="battle-actions">
            <button className="battle-deselect" type="button" onClick={handleCancelMoveMode}>取消移動</button>
          </div>
        )}
        {selectedUnit && interactionMode === 'ATTACK' && (
          <div className="battle-combat-details">
            <p>攻擊距離：{selectedUnit.attackRange} · 合法目標：{attackableTargets.length}</p>
            {selectedAttackTarget && (
              <p>目標：{selectedAttackTarget.name} · 距離：{selectedAttackTargetDistance} 格</p>
            )}
            <div className="battle-actions">
              <button className="battle-deselect" type="button" disabled={!canConfirmAttack} onClick={handleConfirmAttack}>
                確認攻擊
              </button>
              <button className="battle-deselect" type="button" onClick={handleCancelAttack}>
                取消攻擊
              </button>
            </div>
          </div>
        )}
        {lastAttackResult && attackResultAttacker && attackResultTarget && (
          <p className="battle-combat-feedback" role="status">
            {attackResultAttacker.name} 對 {attackResultTarget.name} 造成 {lastAttackResult.damage} 點傷害
            {lastAttackResult.appliedDamage !== lastAttackResult.damage && `（實際扣除 ${lastAttackResult.appliedDamage} 點 HP）`}
            {lastAttackResult.isDefeated && `；${attackResultTarget.name}失去戰鬥能力。`}
            {!lastAttackResult.isDefeated && '。'}
          </p>
        )}
      </aside>
      {outcome !== null && (
        <BattleResultOverlay outcome={outcome} onRestart={handleRestart} />
      )}
    </main>
  )
}
