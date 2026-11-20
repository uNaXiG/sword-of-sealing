import { createBattleUnit } from '../classes/class.factory.ts'
import type { BattleUnit } from './battle.types'

export const INITIAL_UNITS: readonly BattleUnit[] = [
  createBattleUnit({ id: 'knight', name: '迪歐', class: 'knight', faction: 'player', position: { column: 3, row: 3 } }),
  createBattleUnit({ id: 'assassin', name: '奧黛', class: 'assassin', faction: 'player', position: { column: 1, row: 5 } }),
  createBattleUnit({ id: 'goblin', name: '哥布林 A', class: 'goblin', faction: 'enemy', position: { column: 5, row: 2 } }),
  createBattleUnit({ id: 'goblin-b', name: '哥布林 B', class: 'goblin', faction: 'enemy', position: { column: 5, row: 3 } }),
  createBattleUnit({ id: 'goblin-c', name: '哥布林 C', class: 'goblin', faction: 'enemy', position: { column: 7, row: 3 } }),
]
