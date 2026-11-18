import type { DeathMotion } from './battle.types'
import type { Cell } from '../grid/grid.types'

export interface DeathAnimationProfile {
  readonly hitReactionMs: number
  readonly collapseMs: number
  readonly dissolveMs: number
}

export const DEATH_ANIMATION_PROFILE: Readonly<DeathAnimationProfile> = {
  hitReactionMs: 200,
  collapseMs: 350,
  dissolveMs: 650,
}

export type DeathAnimationStage = 'HIT_REACTION' | 'COLLAPSE' | 'DISSOLVE' | 'COMPLETED'

export interface DeathTimelineFrame {
  readonly stage: DeathAnimationStage
  readonly stageProgress: number
  readonly elapsedMs: number
  readonly elapsedRatio: number
  readonly completed: boolean
}

export function getDeathTotalMs(profile: DeathAnimationProfile = DEATH_ANIMATION_PROFILE): number {
  return profile.hitReactionMs + profile.collapseMs + profile.dissolveMs
}

export function getDeathTimelineFrame(
  elapsedMs: number,
  profile: DeathAnimationProfile = DEATH_ANIMATION_PROFILE,
): DeathTimelineFrame {
  const finiteElapsed = Number.isFinite(elapsedMs) ? Math.max(0, elapsedMs) : 0
  const collapseAt = profile.hitReactionMs
  const dissolveAt = profile.hitReactionMs + profile.collapseMs
  const totalMs = getDeathTotalMs(profile)
  const clampedElapsed = Math.min(finiteElapsed, totalMs)
  let stage: DeathAnimationStage
  let stageProgress: number

  if (clampedElapsed < collapseAt) {
    stage = 'HIT_REACTION'
    stageProgress = collapseAt === 0 ? 1 : clampedElapsed / collapseAt
  } else if (clampedElapsed < dissolveAt) {
    stage = 'COLLAPSE'
    stageProgress = profile.collapseMs === 0 ? 1 : (clampedElapsed - collapseAt) / profile.collapseMs
  } else if (clampedElapsed < totalMs) {
    stage = 'DISSOLVE'
    stageProgress = profile.dissolveMs === 0 ? 1 : (clampedElapsed - dissolveAt) / profile.dissolveMs
  } else {
    stage = 'COMPLETED'
    stageProgress = 1
  }

  return {
    stage,
    stageProgress: Math.max(0, Math.min(1, stageProgress)),
    elapsedMs: clampedElapsed,
    elapsedRatio: totalMs === 0 ? 1 : clampedElapsed / totalMs,
    completed: finiteElapsed >= totalMs,
  }
}

export function getDeathTimelineEvents(
  previousElapsedMs: number,
  nextElapsedMs: number,
  profile: DeathAnimationProfile = DEATH_ANIMATION_PROFILE,
): { complete: boolean } {
  const previous = Number.isFinite(previousElapsedMs) ? Math.max(0, previousElapsedMs) : 0
  const next = Number.isFinite(nextElapsedMs) ? Math.max(0, nextElapsedMs) : 0
  return { complete: previous < getDeathTotalMs(profile) && next >= getDeathTotalMs(profile) }
}

export function getDeathDirection(motion: DeathMotion): Cell {
  const x = motion.position.column - motion.sourcePosition.column
  const y = motion.position.row - motion.sourcePosition.row
  if (x === 0 && y === 0) return { column: 0, row: 1 }
  return { column: x, row: y }
}

for (const duration of Object.values(DEATH_ANIMATION_PROFILE)) {
  if (!Number.isFinite(duration) || duration <= 0) {
    throw new RangeError('Death animation durations must be finite positive values')
  }
}
