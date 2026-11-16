import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, OrthographicCamera } from '@react-three/drei'
import { MOUSE } from 'three'
import GridMap from './components/GridMap'
import UnitPlaceholder from './components/UnitPlaceholder'
import Environment from './components/Environment'
import ObstacleMap from './components/ObstacleMap'
import { useBattleMovement } from './hooks/useBattleMovement'
import './BattleScene.css'

function FitCamera() {
  const { size } = useThree()
  return <OrthographicCamera makeDefault position={[12, 16, 12]} zoom={Math.min(size.width / 16, size.height / 14)} near={0.1} far={100} />
}

export default function BattleScene() {
  const { units, obstacles, selectedUnit, motion, reachable, selectUnit, clearSelection, selectCell, finishMove } = useBattleMovement()

  return (
    <main className="battle-screen">
      <div className="battle-canvas">
        <Canvas
          orthographic
          shadows
          onPointerMissed={clearSelection}
          fallback={<div className="battle-error">無法啟用 WebGL，請使用支援 WebGL 的瀏覽器。</div>}
        >
          <color attach="background" args={['#c8e3eb']} />
          <ambientLight intensity={1.2} />
          <directionalLight position={[5, 12, 7]} intensity={2} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12} />
          <Environment />
          <GridMap position={selectedUnit?.position ?? null} selected={selectedUnit !== null} moving={motion !== null} reachable={reachable} onSelect={selectCell} />
          <ObstacleMap obstacles={obstacles} />
          {units.map((unit) => (
            <UnitPlaceholder
              key={unit.id}
              unit={unit}
              selected={unit.id === selectedUnit?.id}
              path={motion?.unitId === unit.id ? motion.path : null}
              onSelect={selectUnit}
              onMoveComplete={finishMove}
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
        <p><span className="battle-swatch occupied" />金色：選取的我方角色</p>
        <p><span className="battle-swatch selected" />藍色：可移動範圍</p>
        <div className="battle-selection">
          {selectedUnit && (
            <>
              <p>{selectedUnit.name}：({selectedUnit.position.column}, {selectedUnit.position.row})</p>
              <p>生命：{selectedUnit.hp} / {selectedUnit.maxHp} · 移動力：{selectedUnit.movement}</p>
            </>
          )}
          <p>{motion ? '移動中，請稍候' : selectedUnit ? '請選擇藍色格子' : '點擊我方角色以選取'}</p>
        </div>
        {selectedUnit && !motion && <button className="battle-deselect" type="button" onClick={clearSelection}>取消選取</button>}
      </aside>
      <footer className="battle-hint">左鍵平移 · 右鍵旋轉 · 滾輪縮放 | 觸控：單指旋轉、雙指縮放與平移</footer>
    </main>
  )
}
