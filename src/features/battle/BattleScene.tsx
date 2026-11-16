import { useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, OrthographicCamera } from '@react-three/drei'
import { MOUSE } from 'three'
import GridMap from './components/GridMap'
import type { Cell } from './components/grid'
import KnightPlaceholder from './components/KnightPlaceholder'
import Environment from './components/Environment'
import './BattleScene.css'

function FitCamera() {
  const { size } = useThree()
  return <OrthographicCamera makeDefault position={[12, 16, 12]} zoom={Math.min(size.width / 16, size.height / 14)} near={0.1} far={100} />
}

export default function BattleScene() {
  const [selected, setSelected] = useState<Cell | null>(null)

  return (
    <main className="battle-screen">
      <div className="battle-canvas">
        <Canvas
          orthographic
          shadows
          fallback={<div className="battle-error">無法啟用 WebGL，請使用支援 WebGL 的瀏覽器。</div>}
        >
          <color attach="background" args={['#c8e3eb']} />
          <ambientLight intensity={1.2} />
          <directionalLight position={[5, 12, 7]} intensity={2} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12} />
          <Environment />
          <GridMap selected={selected} onSelect={setSelected} />
          <KnightPlaceholder />
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
        <p><span className="battle-swatch occupied" />金色：騎士所在格</p>
        <p><span className="battle-swatch selected" />藍色：選取的格子</p>
        <div className="battle-selection">
          {selected ? `已選取：第 ${selected.column + 1} 欄，第 ${selected.row + 1} 列` : '點擊格子以選取'}
        </div>
      </aside>
      <footer className="battle-hint">左鍵平移 · 右鍵旋轉 · 滾輪縮放 | 觸控：單指旋轉、雙指縮放與平移</footer>
    </main>
  )
}
