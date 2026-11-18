import { UNIT_CLASSES } from '../classes/class.data.ts'
import type { UnitClass } from '../classes/class.types'

export type AttackAnimationType =
  | 'MELEE_SLASH'
  | 'MELEE_STAB'
  | 'MAGIC_PROJECTILE'
  | 'HOLY_STRIKE'
  | 'RANGED_ARROW'
  | 'MELEE_BASH'

export interface AttackAnimationProfile {
  readonly type: AttackAnimationType
  readonly windupMs: number
  readonly attackMs: number
  readonly recoveryMs: number
  readonly lungeDistance: number
  readonly effectColor: string
}

export const ATTACK_ANIMATION_PROFILES: Readonly<Record<AttackAnimationType, AttackAnimationProfile>> = {
  MELEE_SLASH: { type: 'MELEE_SLASH', windupMs: 150, attackMs: 300, recoveryMs: 550, lungeDistance: 0.45, effectColor: '#c9efff' },
  MELEE_STAB: { type: 'MELEE_STAB', windupMs: 100, attackMs: 200, recoveryMs: 400, lungeDistance: 0.6, effectColor: '#d8c7ff' },
  MAGIC_PROJECTILE: { type: 'MAGIC_PROJECTILE', windupMs: 450, attackMs: 500, recoveryMs: 450, lungeDistance: 0, effectColor: '#8b7dff' },
  HOLY_STRIKE: { type: 'HOLY_STRIKE', windupMs: 450, attackMs: 300, recoveryMs: 550, lungeDistance: 0, effectColor: '#ffe7a0' },
  RANGED_ARROW: { type: 'RANGED_ARROW', windupMs: 300, attackMs: 400, recoveryMs: 400, lungeDistance: 0, effectColor: '#d6f5d2' },
  MELEE_BASH: { type: 'MELEE_BASH', windupMs: 150, attackMs: 250, recoveryMs: 500, lungeDistance: 0.4, effectColor: '#ff8c5a' },
}

export const CLASS_ATTACK_ANIMATION: Readonly<Record<UnitClass, AttackAnimationType>> = {
  knight: 'MELEE_SLASH',
  assassin: 'MELEE_STAB',
  mage: 'MAGIC_PROJECTILE',
  cleric: 'HOLY_STRIKE',
  ranger: 'RANGED_ARROW',
  goblin: 'MELEE_BASH',
}

export type AnimationStage = 'WINDUP' | 'ATTACK' | 'RECOVERY' | 'COMPLETED'

export interface AttackTimelineFrame {
  readonly stage: AnimationStage
  readonly stageProgress: number
  readonly elapsedMs: number
  readonly elapsedRatio: number
  readonly impactReached: boolean
  readonly completed: boolean
}

export interface AttackTimelineEvents {
  readonly impact: boolean
  readonly complete: boolean
}

export function getAttackProfile(unitClass: UnitClass): AttackAnimationProfile {
  return ATTACK_ANIMATION_PROFILES[CLASS_ATTACK_ANIMATION[unitClass]]
}

export function getImpactMs(profile: AttackAnimationProfile): number {
  return profile.windupMs + profile.attackMs
}

export function getTotalMs(profile: AttackAnimationProfile): number {
  return profile.windupMs + profile.attackMs + profile.recoveryMs
}

export function getAttackTimelineFrame(elapsedMs: number, profile: AttackAnimationProfile): AttackTimelineFrame {
  const finiteElapsed = Number.isFinite(elapsedMs) ? Math.max(0, elapsedMs) : 0
  const impactMs = getImpactMs(profile)
  const totalMs = getTotalMs(profile)
  const clampedElapsed = Math.min(finiteElapsed, totalMs)
  let stage: AnimationStage
  let stageProgress: number

  if (clampedElapsed < profile.windupMs) {
    stage = 'WINDUP'
    stageProgress = profile.windupMs === 0 ? 1 : clampedElapsed / profile.windupMs
  } else if (clampedElapsed < impactMs) {
    stage = 'ATTACK'
    stageProgress = profile.attackMs === 0 ? 1 : (clampedElapsed - profile.windupMs) / profile.attackMs
  } else if (clampedElapsed < totalMs) {
    stage = 'RECOVERY'
    stageProgress = profile.recoveryMs === 0 ? 1 : (clampedElapsed - impactMs) / profile.recoveryMs
  } else {
    stage = 'COMPLETED'
    stageProgress = 1
  }

  return {
    stage,
    stageProgress: Math.max(0, Math.min(1, stageProgress)),
    elapsedMs: clampedElapsed,
    elapsedRatio: totalMs === 0 ? 1 : clampedElapsed / totalMs,
    impactReached: finiteElapsed >= impactMs,
    completed: finiteElapsed >= totalMs,
  }
}

export function getAttackTimelineEvents(
  previousElapsedMs: number,
  nextElapsedMs: number,
  profile: AttackAnimationProfile,
): AttackTimelineEvents {
  const previous = Number.isFinite(previousElapsedMs) ? Math.max(0, previousElapsedMs) : 0
  const next = Number.isFinite(nextElapsedMs) ? Math.max(0, nextElapsedMs) : 0
  const impactMs = getImpactMs(profile)
  const totalMs = getTotalMs(profile)
  return {
    impact: previous < impactMs && next >= impactMs,
    complete: previous < totalMs && next >= totalMs,
  }
}

for (const unitClass of UNIT_CLASSES) {
  if (!CLASS_ATTACK_ANIMATION[unitClass]) throw new Error(`Missing attack animation mapping: ${unitClass}`)
}

for (const profile of Object.values(ATTACK_ANIMATION_PROFILES)) {
  if (
    !Number.isFinite(profile.windupMs) || profile.windupMs <= 0 ||
    !Number.isFinite(profile.attackMs) || profile.attackMs <= 0 ||
    !Number.isFinite(profile.recoveryMs) || profile.recoveryMs <= 0 ||
    !Number.isFinite(profile.lungeDistance) || profile.lungeDistance < 0 ||
    profile.effectColor.trim().length === 0
  ) {
    throw new RangeError(`Invalid attack animation profile: ${profile.type}`)
  }
}
