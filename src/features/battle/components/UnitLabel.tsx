import { useEffect, useMemo, useRef } from 'react'
import { CanvasTexture, SRGBColorSpace } from 'three'
import type { BattleUnit } from '../../../game/battle/battle.types'

export default function UnitLabel({ unit }: { unit: BattleUnit }) {
  const textureLifecycle = useRef<{ texture: CanvasTexture | null; generation: number }>({ texture: null, generation: 0 })
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 144
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Unable to create the unit label canvas')
    context.fillStyle = unit.faction === 'player' ? '#204b60' : '#7e3531'
    context.strokeStyle = unit.faction === 'player' ? '#a9d8ed' : '#edb3a5'
    context.lineWidth = 5
    context.fillRect(3, 3, 506, 138)
    context.strokeRect(3, 3, 506, 138)
    context.fillStyle = '#ffffff'
    context.font = 'bold 37px "Microsoft JhengHei", sans-serif'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText(`${unit.faction === 'player' ? '我方' : '敵方'} · ${unit.name}`, 256, 32, 480)
    const hpRatio = Math.max(0, Math.min(1, unit.hp / unit.maxHp))
    context.fillStyle = '#25343a'
    context.fillRect(25, 55, 462, 26)
    context.fillStyle = unit.hp === 0 ? '#777b7e'
      : hpRatio > 0.5 ? '#55bd72'
        : hpRatio > 0.25 ? '#e4bd49'
          : '#df5555'
    context.fillRect(29, 59, 454 * hpRatio, 18)
    context.strokeStyle = '#f1ead7'
    context.lineWidth = 2
    context.strokeRect(25, 55, 462, 26)
    context.fillStyle = '#ffffff'
    context.font = 'bold 28px "Microsoft JhengHei", sans-serif'
    const healthText = `HP ${unit.hp} / ${unit.maxHp}${unit.hp === 0 ? ' · 失去戰鬥能力' : ''}`
    context.fillText(healthText, 256, 116, 480)
    const result = new CanvasTexture(canvas)
    result.colorSpace = SRGBColorSpace
    result.needsUpdate = true
    return result
  }, [unit.name, unit.faction, unit.hp, unit.maxHp])

  useEffect(() => {
    const lifecycle = textureLifecycle.current
    lifecycle.texture = texture
    const generation = ++lifecycle.generation
    return () => {
      queueMicrotask(() => {
        if (lifecycle.texture !== texture || lifecycle.generation === generation) texture.dispose()
      })
    }
  }, [texture])

  return (
    <sprite position={[0, 1.75, 0]} scale={[1.35, 0.38, 1]} renderOrder={10} raycast={() => {}}>
      <spriteMaterial map={texture} transparent depthTest={false} />
    </sprite>
  )
}
