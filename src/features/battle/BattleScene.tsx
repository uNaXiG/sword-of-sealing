import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, OrthographicCamera } from '@react-three/drei'
import { MOUSE } from 'three'
import { useState } from 'react'
import GridMap from './components/GridMap'
import UnitPlaceholder from './components/UnitPlaceholder'
import Environment from './components/Environment'
import ObstacleMap from './components/ObstacleMap'
import { useBattleMovement } from './hooks/useBattleMovement'
import type { Cell } from '../../game/grid/grid.types'
import { cellKey } from '../../game/grid/grid.utils'
import './BattleScene.css'

function FitCamera() {
  const { size } = useThree()
  return <OrthographicCamera makeDefault position={[12, 16, 12]} zoom={Math.min(size.width / 16, size.height / 14)} near={0.1} far={100} />
}

export default function BattleScene() {
  const {
    units, obstacles, selectedUnit, selectedAttackTarget, selectedAttackTargetDistance,
    motion, lastMove, reachable, interactionMode, selectedAttackTargetId, lastAttackCommand,
    attackRange, attackableTargets, attackableTargetIds, attackableTargetCells,
    canUndoMove, canConfirmAttack, selectUnit, clearSelection, selectCell,
    finishMove, cancelMove, undoMove, setInteractionMode, cancelMoveMode, cancelAttack, confirmAttack,
  } = useBattleMovement()
  const [hoveredCell, setHoveredCell] = useState<Cell | null>(null)
  const preview = interactionMode === 'MOVE' && hoveredCell ? reachable.get(cellKey(hoveredCell)) ?? null : null
  const attackResultAttacker = lastAttackCommand
    ? units.find((unit) => unit.id === lastAttackCommand.attackerId) ?? null
    : null
  const attackResultTarget = lastAttackCommand
    ? units.find((unit) => unit.id === lastAttackCommand.targetId) ?? null
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
  const handleCancelAttack = () => {
    setHoveredCell(null)
    cancelAttack()
  }
  const handleConfirmAttack = () => {
    setHoveredCell(null)
    confirmAttack()
  }

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
          {units.map((unit) => (
            <UnitPlaceholder
              key={unit.id}
              unit={unit}
              selected={unit.id === selectedUnit?.id}
              attackableTarget={attackableTargetIds.has(unit.id)}
              selectedAttackTarget={unit.id === selectedAttackTargetId}
              path={motion?.unitId === unit.id ? motion.path : null}
              motionId={motion?.unitId === unit.id ? motion.motionId : null}
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
      <aside className="battle-info" aria-live="polite">
        <div className="battle-info-title">✦ 戰場資訊</div>
        {selectedUnit && (
          <div className="battle-selection">
            <p>{selectedUnit.name}</p>
            <p>生命：{selectedUnit.hp} / {selectedUnit.maxHp} · 行動力：{selectedUnit.movementPoints}</p>
          </div>
        )}
        {selectedUnit && !motion && interactionMode === 'COMMAND' && (
          <div className="battle-actions">
            {lastMove?.unitId !== selectedUnit.id && (
              <button className="battle-deselect" type="button" onClick={handleMoveMode}>移動</button>
            )}
            <button className="battle-deselect" type="button" onClick={handleAttackMode}>攻擊</button>
            {lastMove?.unitId === selectedUnit.id && (
              <button className="battle-deselect battle-undo" type="button" disabled={!canUndoMove} onClick={handleUndoMove}>
                取消
              </button>
            )}
            <button className="battle-deselect" type="button" onClick={clearBattleSelection}>待命</button>
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
        {attackResultAttacker && attackResultTarget && (
          <p className="battle-combat-feedback" role="status">
            {attackResultAttacker.name} 對 {attackResultTarget.name} 執行攻擊指令。
          </p>
        )}
      </aside>
    </main>
  )
}
