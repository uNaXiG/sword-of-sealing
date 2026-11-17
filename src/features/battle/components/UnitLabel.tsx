import { useEffect, useMemo } from 'react'
import { CanvasTexture, SRGBColorSpace } from 'three'
import type { BattleUnit } from '../../../game/battle/battle.types'

export default function UnitLabel({ unit }: { unit: BattleUnit }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 112
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Unable to create the unit label canvas')
    context.fillStyle = unit.faction === 'player' ? '#204b60' : '#7e3531'
    context.strokeStyle = unit.faction === 'player' ? '#a9d8ed' : '#edb3a5'
    context.lineWidth = 5
    context.fillRect(3, 3, 506, 106)
    context.strokeRect(3, 3, 506, 106)
    context.fillStyle = '#ffffff'
    context.font = 'bold 47px "Microsoft JhengHei", sans-serif'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText(`${unit.faction === 'player' ? '我方' : '敵方'} · ${unit.name}`, 256, 56, 480)
    const result = new CanvasTexture(canvas)
    result.colorSpace = SRGBColorSpace
    return result
  }, [unit.name, unit.faction])

  useEffect(() => () => texture.dispose(), [texture])

  return (
    <sprite position={[0, 1.65, 0]} scale={[1.3, 0.285, 1]} renderOrder={10} raycast={() => {}}>
      <spriteMaterial map={texture} transparent depthTest={false} />
    </sprite>
  )
}
