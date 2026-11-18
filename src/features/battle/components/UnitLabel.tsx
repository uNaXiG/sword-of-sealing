import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { CanvasTexture, Sprite, SpriteMaterial, SRGBColorSpace } from 'three'
import type { BattleUnit } from '../../../game/battle/battle.types'

export default function UnitLabel({ unit }: { unit: BattleUnit }) {
  const textureLifecycle = useRef<{ texture: CanvasTexture | null; generation: number }>({ texture: null, generation: 0 })
  const bar = useRef<Sprite>(null)
  const barMaterial = useRef<SpriteMaterial>(null)
  const visualHpRatio = useRef(unit.hp / unit.maxHp)
  const targetHpRatio = useRef(unit.hp / unit.maxHp)
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

  useEffect(() => {
    targetHpRatio.current = Math.max(0, Math.min(1, unit.hp / unit.maxHp))
  }, [unit.hp, unit.maxHp])

  useFrame((_, delta) => {
    const smoothing = 1 - Math.exp(-delta * 12)
    visualHpRatio.current += (targetHpRatio.current - visualHpRatio.current) * smoothing
    visualHpRatio.current = Math.max(0, Math.min(1, visualHpRatio.current))
    const width = 1.08 * visualHpRatio.current
    if (bar.current) {
      bar.current.scale.x = width
      bar.current.position.x = -0.54 + width / 2
    }
    if (barMaterial.current) {
      barMaterial.current.color.set(
        visualHpRatio.current === 0 ? '#777b7e'
          : visualHpRatio.current > 0.5 ? '#55bd72'
            : visualHpRatio.current > 0.25 ? '#e4bd49'
              : '#df5555',
      )
    }
  })

  return (
    <group position={[0, 1.75, 0]}>
      <sprite scale={[1.35, 0.38, 1]} renderOrder={10} raycast={() => {}}>
        <spriteMaterial map={texture} transparent depthTest={false} />
      </sprite>
      <sprite position={[0, -0.005, 0.01]} scale={[1.12, 0.07, 1]} renderOrder={11} raycast={() => {}}>
        <spriteMaterial color="#25343a" depthTest={false} />
      </sprite>
      <sprite ref={bar} position={[-0.54, -0.005, 0.02]} scale={[0, 0.045, 1]} renderOrder={12} raycast={() => {}}>
        <spriteMaterial ref={barMaterial} color="#55bd72" depthTest={false} />
      </sprite>
    </group>
  )
}
