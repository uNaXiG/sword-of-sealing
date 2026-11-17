import { createBattleUnit } from '../classes/class.factory.ts'
import type { BattleUnit } from './battle.types'

export const INITIAL_UNITS: readonly BattleUnit[] = [
  createBattleUnit({ id: 'knight', class: 'knight', faction: 'player', position: { column: 3, row: 3 } }),
  createBattleUnit({ id: 'assassin', class: 'assassin', faction: 'player', position: { column: 1, row: 5 } }),
  createBattleUnit({ id: 'mage', class: 'mage', faction: 'player', position: { column: 2, row: 4 } }),
  createBattleUnit({ id: 'cleric', class: 'cleric', faction: 'player', position: { column: 3, row: 6 } }),
  createBattleUnit({ id: 'ranger', class: 'ranger', faction: 'player', position: { column: 4, row: 4 } }),
  createBattleUnit({ id: 'goblin', name: '哥布林 A', class: 'goblin', faction: 'enemy', position: { column: 5, row: 2 } }),
  createBattleUnit({ id: 'goblin-b', name: '哥布林 B', class: 'goblin', faction: 'enemy', position: { column: 5, row: 3 } }),
  createBattleUnit({ id: 'goblin-c', name: '哥布林 C', class: 'goblin', faction: 'enemy', position: { column: 7, row: 3 } }),
]
