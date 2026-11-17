import type { Cell } from '../grid/grid.types'
import type { BattleFaction, BattleUnit } from '../battle/battle.types'
import { CLASS_DEFINITIONS, isUnitClass } from './class.data.ts'
import type { UnitClass } from './class.types'

export interface CreateBattleUnitOptions {
  id: string
  class: UnitClass
  faction: BattleFaction
  position: Cell
  name?: string
}

export function createBattleUnit(options: CreateBattleUnitOptions): BattleUnit {
  if (!isUnitClass(options.class)) throw new Error(`Unknown unit class: ${String(options.class)}`)
  const definition = CLASS_DEFINITIONS[options.class]
  return {
    id: options.id,
    name: options.name ?? definition.name,
    faction: options.faction,
    class: definition.type,
    position: { ...options.position },
    hp: definition.maxHp,
    maxHp: definition.maxHp,
    sp: definition.maxSp,
    maxSp: definition.maxSp,
    atk: definition.atk,
    def: definition.def,
    agi: definition.agi,
    movementPoints: definition.movementPoints,
    attackPattern: definition.attackPattern,
    attackRange: definition.attackRange,
    minAttackRange: definition.minAttackRange,
  }
}
