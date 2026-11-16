import test from 'node:test'
import assert from 'node:assert/strict'
import { findReachablePaths } from '../src/game/grid/movement.ts'

function paths(start, range, obstacles = [], occupied = []) {
  return findReachablePaths({ start, range, size: 8, obstacles, occupied })
}

test('無障礙物時可抵達三步內的格子', () => {
  const result = paths({ column: 3, row: 3 }, 3)
  assert.equal(result.size, 24)
  assert.equal(result.has('3,3'), false)
  assert.equal(result.get('6,3').length - 1, 3)
})

test('移動力不足時不可抵達目標', () => {
  const result = paths({ column: 3, row: 3 }, 2)
  assert.equal(result.has('6,3'), false)
  assert.equal(result.has('5,3'), true)
})

test('障礙物不可通過，繞路須消耗額外步數', () => {
  const start = { column: 1, row: 1 }
  const obstacle = { column: 2, row: 1 }
  assert.equal(paths(start, 3, [obstacle]).has('3,1'), false)
  const path = paths(start, 4, [obstacle]).get('3,1')
  assert.equal(path.length - 1, 4)
  assert.equal(path.some((cell) => cell.column === 2 && cell.row === 1), false)
})

test('其他角色的格子無法進入或穿越', () => {
  const occupied = Array.from({ length: 8 }, (_, row) => ({ column: 1, row }))
  const result = paths({ column: 0, row: 3 }, 7, [], occupied)
  assert.equal(result.has('1,3'), false)
  assert.equal(result.has('2,3'), false)
  assert.equal(result.has('0,7'), true)
})

test('棋盤邊界外不可抵達', () => {
  const result = paths({ column: 0, row: 0 }, 3)
  assert.equal(result.size, 9)
  for (const path of result.values()) {
    for (const cell of path) {
      assert.ok(cell.column >= 0 && cell.column < 8 && cell.row >= 0 && cell.row < 8)
    }
  }
})

test('不能斜向移動，每一步必須沿四個方向', () => {
  const result = paths({ column: 3, row: 3 }, 1)
  assert.equal(result.has('4,4'), false)
  assert.equal(result.size, 4)
  for (const path of paths({ column: 3, row: 3 }, 3).values()) {
    for (let index = 1; index < path.length; index += 1) {
      const previous = path[index - 1]
      const current = path[index]
      assert.equal(Math.abs(current.column - previous.column) + Math.abs(current.row - previous.row), 1)
    }
  }
})

test('無效的起點、移動力或被阻擋的起點會明確報錯', () => {
  assert.throws(() => paths({ column: -1, row: 0 }, 3), RangeError)
  assert.throws(() => paths({ column: 0, row: 0 }, -1), RangeError)
  assert.throws(() => paths({ column: 0, row: 0 }, 3, [{ column: 0, row: 0 }]), RangeError)
})
