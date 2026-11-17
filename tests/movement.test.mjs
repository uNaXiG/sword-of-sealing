import test from 'node:test'
import assert from 'node:assert/strict'
import { calculatePathCost, findLowestCostPath, findReachablePaths, getReachableTiles } from '../src/game/grid/movement.ts'

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

test('Dijkstra 會選擇總成本較低的繞行路徑', () => {
  const start = { column: 0, row: 1 }
  const target = { column: 2, row: 1 }
  const movementCostAt = (cell) => cell.column === 1 && cell.row === 1 ? 4 : 1
  const options = { start, size: 8, obstacles: [], occupied: [], movementCostAt }
  const reachable = getReachableTiles({ ...options, budget: 4 })
  const tile = reachable.get('2,1')

  assert.ok(tile)
  assert.equal(tile.cost, 4)
  assert.equal(tile.path.length - 1, 4)
  assert.notDeepEqual(tile.path[1], { column: 1, row: 1 })
  assert.equal(calculatePathCost(tile.path, movementCostAt), tile.cost)
  assert.deepEqual(findLowestCostPath(options, target), tile.path)
})

test('成本等於 MP 預算可達，超過預算不可達，且起點不計成本', () => {
  const start = { column: 3, row: 3 }
  const movementCostAt = (cell) => cell.column === start.column && cell.row === start.row ? 100 : 2
  const withinBudget = getReachableTiles({
    start,
    budget: 2,
    size: 8,
    obstacles: [],
    occupied: [],
    movementCostAt,
  })
  const overBudget = getReachableTiles({
    start,
    budget: 1,
    size: 8,
    obstacles: [],
    occupied: [],
    movementCostAt,
  })

  assert.equal(withinBudget.get('4,3')?.cost, 2)
  assert.equal(overBudget.has('4,3'), false)
  assert.equal(withinBudget.has('3,3'), false)
})

test('不可通行成本與佔位格都會阻斷尋路', () => {
  const start = { column: 0, row: 0 }
  const target = { column: 2, row: 0 }
  const blockedColumn = [{ column: 1, row: 0 }]
  const movementCostAt = (cell) => cell.column === 1 && cell.row === 1 ? Number.POSITIVE_INFINITY : 1

  assert.equal(getReachableTiles({
    start, budget: 8, size: 8, obstacles: [], occupied: blockedColumn, movementCostAt,
  }).has('2,0'), true)
  assert.equal(getReachableTiles({
    start, budget: 8, size: 8, obstacles: [], occupied: [{ column: 1, row: 0 }, { column: 0, row: 1 }], movementCostAt,
  }).has('2,0'), false)
  assert.equal(calculatePathCost([start, { column: 1, row: 1 }], movementCostAt), Number.POSITIVE_INFINITY)
})

test('等成本路徑依固定方向順序產生，並且無法斜向抵達', () => {
  const options = { start: { column: 0, row: 0 }, size: 8, obstacles: [], occupied: [] }
  const firstPath = findLowestCostPath(options, { column: 1, row: 1 })
  const secondPath = findLowestCostPath(options, { column: 1, row: 1 })
  assert.deepEqual(firstPath, [
    { column: 0, row: 0 },
    { column: 1, row: 0 },
    { column: 1, row: 1 },
  ])
  assert.deepEqual(secondPath, firstPath)
})
