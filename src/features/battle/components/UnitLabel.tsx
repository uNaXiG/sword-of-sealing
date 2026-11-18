import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { CanvasTexture, SpriteMaterial, SRGBColorSpace } from 'three'
import type { BattleUnit } from '../../../game/battle/battle.types'
import { drawUnitLabel, normalizeHpRatio, UNIT_LABEL_LAYOUT } from './unitLabel.utils'

interface LabelSurface {
  readonly canvas: HTMLCanvasElement
  readonly context: CanvasRenderingContext2D
  readonly texture: CanvasTexture
}

export default function UnitLabel({ unit }: { unit: BattleUnit }) {
  const surfaceRef = useRef<LabelSurface | null>(null)
  const materialRef = useRef<SpriteMaterial>(null)
  const visualHpRatio = useRef(normalizeHpRatio(unit.hp / unit.maxHp))
  const targetHpRatio = useRef(normalizeHpRatio(unit.hp / unit.maxHp))
  const lastDrawn = useRef<{
    readonly name: string
    readonly faction: BattleUnit['faction']
    readonly hp: number
    readonly maxHp: number
    readonly ratio: number
  } | null>(null)

  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.width = UNIT_LABEL_LAYOUT.width
    canvas.height = UNIT_LABEL_LAYOUT.height
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Unable to create the unit label canvas')
    const labelTexture = new CanvasTexture(canvas)
    labelTexture.colorSpace = SRGBColorSpace
    labelTexture.needsUpdate = true
    const surface = { canvas, context, texture: labelTexture }
    surfaceRef.current = surface
    const material = materialRef.current
    if (material) {
      material.map = labelTexture
      material.needsUpdate = true
    }

    return () => {
      if (surfaceRef.current === surface) surfaceRef.current = null
      if (material?.map === labelTexture) {
        material.map = null
        material.needsUpdate = true
      }
      labelTexture.dispose()
    }
  }, [])

  useEffect(() => {
    targetHpRatio.current = normalizeHpRatio(unit.hp / unit.maxHp)
  }, [unit.hp, unit.maxHp])

  useFrame((_, delta) => {
    const target = targetHpRatio.current
    const difference = target - visualHpRatio.current
    if (Math.abs(difference) < 0.001) {
      visualHpRatio.current = target
    } else {
      const smoothing = 1 - Math.exp(-Math.max(0, delta) * 12)
      visualHpRatio.current = normalizeHpRatio(visualHpRatio.current + difference * smoothing)
    }

    const ratio = visualHpRatio.current
    const previous = lastDrawn.current
    const contentChanged = !previous
      || previous.name !== unit.name
      || previous.faction !== unit.faction
      || previous.hp !== unit.hp
      || previous.maxHp !== unit.maxHp
    const ratioChanged = !previous || Math.abs(previous.ratio - ratio) >= 0.001
    const surface = surfaceRef.current
    if (surface && (contentChanged || ratioChanged)) {
      drawUnitLabel(surface.context, unit, ratio)
      surface.texture.needsUpdate = true
      lastDrawn.current = {
        name: unit.name,
        faction: unit.faction,
        hp: unit.hp,
        maxHp: unit.maxHp,
        ratio,
      }
    }
  })

  return (
    <group position={[0, 1.75, 0]}>
      <sprite scale={[1.35, 0.38, 1]} renderOrder={10} raycast={() => {}}>
        <spriteMaterial ref={materialRef} transparent depthTest={false} />
      </sprite>
    </group>
  )
}
