import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { CanvasTexture, Sprite } from 'three'
import type { Cell } from '../../../game/grid/grid.types'
import { cellPosition } from './grid'

export default function FloatingDamage({
  position,
  damage,
  onComplete,
}: {
  position: Cell
  damage: number
  onComplete: () => void
}) {
  const sprite = useRef<Sprite>(null)
  const elapsed = useRef(0)
  const completed = useRef(false)
  const textureLifecycle = useRef<{ texture: CanvasTexture | null; generation: number }>({ texture: null, generation: 0 })
  const base = cellPosition(position)
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 96
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Unable to create floating damage canvas')
    context.font = 'bold 64px "Microsoft JhengHei", sans-serif'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.lineWidth = 10
    context.strokeStyle = '#6d261f'
    context.strokeText(`-${damage}`, 128, 48)
    context.fillStyle = '#ff6a45'
    context.fillText(`-${damage}`, 128, 48)
    const result = new CanvasTexture(canvas)
    result.needsUpdate = true
    return result
  }, [damage])

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

  useFrame((_, delta) => {
    if (!sprite.current || completed.current) return
    elapsed.current = Math.min(800, elapsed.current + delta * 1000)
    const progress = elapsed.current / 800
    sprite.current.position.y = 2.05 + progress * 0.65
    sprite.current.material.opacity = 1 - progress
    sprite.current.scale.setScalar(0.8 + Math.sin(Math.min(1, progress * 2) * Math.PI / 2) * 0.25)
    if (progress >= 1) {
      completed.current = true
      sprite.current.visible = false
      onComplete()
    }
  })

  return (
    <sprite ref={sprite} position={[base[0], 2.05, base[2]]} scale={0.8} renderOrder={20} raycast={() => {}}>
      <spriteMaterial map={texture} transparent depthTest={false} />
    </sprite>
  )
}
