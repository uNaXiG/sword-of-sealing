import type { BattleUnit } from './battle.types'

export const INITIAL_UNITS: readonly BattleUnit[] = [
  { id: 'knight', name: '騎士', faction: 'player', class: 'knight', position: { column: 3, row: 3 }, movementPoints: 3, attackRange: 1, hp: 100, maxHp: 100 },
  { id: 'mage', name: '法師', faction: 'player', class: 'mage', position: { column: 2, row: 4 }, movementPoints: 2, attackRange: 1, hp: 65, maxHp: 65 },
  { id: 'rogue', name: '遊俠', faction: 'player', class: 'rogue', position: { column: 4, row: 4 }, movementPoints: 4, attackRange: 1, hp: 80, maxHp: 80 },
  { id: 'goblin', name: '哥布林', faction: 'enemy', class: 'goblin', position: { column: 5, row: 2 }, movementPoints: 3, attackRange: 1, hp: 60, maxHp: 60 },
]
