export const UNIT_LABEL_LAYOUT = {
  width: 512,
  height: 144,
  panel: { x: 3, y: 3, width: 506, height: 138 },
  title: { x: 256, y: 32, maxWidth: 480 },
  health: { x: 256, y: 116, maxWidth: 480 },
} as const

export const HP_BAR = {
  track: { x: 44, y: 60, width: 424, height: 27 },
  fill: { x: 51, y: 65, width: 410, height: 17 },
} as const

export interface HpBarLayout {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
  readonly ratio: number
}

export function normalizeHpRatio(ratio: number): number {
  return Number.isFinite(ratio) ? Math.max(0, Math.min(1, ratio)) : 0
}

export function getHpBarLayout(ratio: number): HpBarLayout {
  const normalizedRatio = normalizeHpRatio(ratio)
  return {
    x: HP_BAR.fill.x,
    y: HP_BAR.fill.y,
    width: HP_BAR.fill.width * normalizedRatio,
    height: HP_BAR.fill.height,
    ratio: normalizedRatio,
  }
}

export function getHpBarColor(ratio: number): string {
  const normalizedRatio = normalizeHpRatio(ratio)
  return normalizedRatio === 0 ? '#777b7e'
    : normalizedRatio > 0.5 ? '#55bd72'
      : normalizedRatio > 0.25 ? '#e4bd49'
        : '#df5555'
}

export function drawUnitLabel(
  context: CanvasRenderingContext2D,
  unit: { readonly faction: 'player' | 'enemy'; readonly name: string; readonly hp: number; readonly maxHp: number },
  hpRatio: number,
): void {
  const ratio = normalizeHpRatio(hpRatio)
  const fill = getHpBarLayout(ratio)
  context.setTransform(1, 0, 0, 1, 0, 0)
  context.clearRect(0, 0, UNIT_LABEL_LAYOUT.width, UNIT_LABEL_LAYOUT.height)

  context.fillStyle = unit.faction === 'player' ? '#204b60' : '#7e3531'
  context.strokeStyle = unit.faction === 'player' ? '#a9d8ed' : '#edb3a5'
  context.lineWidth = 5
  context.fillRect(
    UNIT_LABEL_LAYOUT.panel.x,
    UNIT_LABEL_LAYOUT.panel.y,
    UNIT_LABEL_LAYOUT.panel.width,
    UNIT_LABEL_LAYOUT.panel.height,
  )
  context.strokeRect(
    UNIT_LABEL_LAYOUT.panel.x,
    UNIT_LABEL_LAYOUT.panel.y,
    UNIT_LABEL_LAYOUT.panel.width,
    UNIT_LABEL_LAYOUT.panel.height,
  )

  context.fillStyle = '#ffffff'
  context.font = 'bold 37px "Microsoft JhengHei", sans-serif'
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillText(
    `${unit.faction === 'player' ? '我方' : '敵方'} · ${unit.name}`,
    UNIT_LABEL_LAYOUT.title.x,
    UNIT_LABEL_LAYOUT.title.y,
    UNIT_LABEL_LAYOUT.title.maxWidth,
  )

  context.fillStyle = '#25343a'
  context.fillRect(HP_BAR.track.x, HP_BAR.track.y, HP_BAR.track.width, HP_BAR.track.height)
  if (fill.width > 0) {
    context.fillStyle = getHpBarColor(ratio)
    context.fillRect(fill.x, fill.y, fill.width, fill.height)
  }

  context.fillStyle = '#ffffff'
  context.font = 'bold 28px "Microsoft JhengHei", sans-serif'
  context.fillText(
    `HP ${unit.hp} / ${unit.maxHp}${unit.hp === 0 ? ' · 失去戰鬥能力' : ''}`,
    UNIT_LABEL_LAYOUT.health.x,
    UNIT_LABEL_LAYOUT.health.y,
    UNIT_LABEL_LAYOUT.health.maxWidth,
  )
}
