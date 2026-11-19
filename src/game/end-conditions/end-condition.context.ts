import type {
  BattleFaction,
  BattleState,
  BattleUnit,
  DefeatedUnitRecord,
  UnitLifeState,
} from '../battle/battle.types'
import { getUnitLifeState } from '../battle/battle.unit.ts'

export type ReadonlyBattleUnit =
  Readonly<Omit<BattleUnit, 'position'>> &
  { readonly position: Readonly<BattleUnit['position']> }

export type ReadonlyDefeatedUnitRecord =
  Readonly<Omit<DefeatedUnitRecord, 'unit'>> &
  { readonly unit: ReadonlyBattleUnit }

export interface BattleConditionContext {
  readonly factions: readonly BattleFaction[]
  readonly initialUnits: readonly ReadonlyBattleUnit[]
  readonly activeUnits: readonly ReadonlyBattleUnit[]
  readonly defeatedUnits: readonly ReadonlyDefeatedUnitRecord[]
  getUnitLifeState(unitId: string): UnitLifeState | null
  isFactionEliminated(faction: BattleFaction): boolean
}

function snapshotUnit(unit: BattleUnit): ReadonlyBattleUnit {
  const position = Object.freeze({ ...unit.position })
  return Object.freeze({ ...unit, position })
}

function snapshotDefeatedUnit(record: DefeatedUnitRecord): ReadonlyDefeatedUnitRecord {
  return Object.freeze({
    ...record,
    unit: snapshotUnit(record.unit),
  })
}

export function createBattleConditionContext(
  state: BattleState,
  initialUnits: readonly BattleUnit[],
): BattleConditionContext {
  const initialSnapshots = Object.freeze(initialUnits.map(snapshotUnit))
  const activeSnapshots = Object.freeze(state.units.map(snapshotUnit))
  const defeatedSnapshots = Object.freeze(state.defeatedUnits.map(snapshotDefeatedUnit))
  const initialIds = new Set(initialSnapshots.map((unit) => unit.id))

  const context: BattleConditionContext = {
    factions: Object.freeze(['player', 'enemy'] as const),
    initialUnits: initialSnapshots,
    activeUnits: activeSnapshots,
    defeatedUnits: defeatedSnapshots,
    getUnitLifeState(unitId) {
      if (!initialIds.has(unitId)) return null
      const activeUnit = state.units.find((unit) => unit.id === unitId)
      if (activeUnit) return getUnitLifeState(state, unitId)
      const defeated = state.defeatedUnits.find((record) => record.unit.id === unitId)
      return defeated?.unit.hp === 0 ? 'DEAD' : null
    },
    isFactionEliminated(faction) {
      const members = initialSnapshots.filter((unit) => unit.faction === faction)
      if (members.length === 0) return false

      return members.every((member) => {
        if (state.units.some((unit) => unit.id === member.id)) return false
        const record = state.defeatedUnits.find((candidate) => candidate.unit.id === member.id)
        if (!record) return false
        return record.unit.faction === faction && record.unit.hp === 0
      })
    },
  }
  return Object.freeze(context)
}
