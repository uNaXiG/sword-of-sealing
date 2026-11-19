import {
  getAttackTimelineFrame,
  type AttackAnimationProfile,
} from '../../../game/battle/battle.animation.ts'
import type { AttackAnimationClock } from './useAttackAnimation.ts'

export function ensureAttackAnimationClock(
  current: AttackAnimationClock | null,
  attackId: number,
  profile: AttackAnimationProfile,
): AttackAnimationClock {
  return current?.attackId === attackId
    ? current
    : {
      attackId,
      elapsedMs: 0,
      frame: getAttackTimelineFrame(0, profile),
    }
}
