import test from 'node:test'
import assert from 'node:assert/strict'
import {
  createAIAction,
  decideEnemyTurn,
  isAuthorizedAIAction,
} from '../src/game/battle/battle.ai.ts'
import { battleReducer, createBattleState } from '../src/game/battle/battle.state.ts'
import { createBattleUnit } from '../src/game/classes/class.factory.ts'
import { canAttackTarget } from '../src/game/battle/battle.attack.ts'
import { calculatePathCost } from '../src/game/grid/movement.ts'
import { TERRAIN_MOVEMENT_COST } from '../src/game/grid/terrain.constants.ts'
import { getTerrainType } from '../src/game/grid/terrain.data.ts'
import { activateUnitFixture } from './turn.fixture.mjs'
import { getAIControllerIntent } from '../src/features/battle/hooks/useBattleAI.ts'

function unit(id, unitClass, faction, column, row, overrides = {}) {
  return {
    ...createBattleUnit({
      id,
      class: unitClass,
      faction,
      position: { column, row },
    }),
    ...overrides,
  }
}

function enemyState(units, enemyId, obstacles = []) {
  return activateUnitFixture(createBattleState(units, obstacles), enemyId)
}

function aiAction(state, type, payload = {}) {
  return createAIAction({
    type,
    turnId: state.turn.turnId,
    unitId: state.turn.activeUnitId,
    ...payload,
  })
}

function completeMove(state) {
  assert.ok(state.motion)
  return battleReducer(state, {
    type: 'finish',
    unitId: state.motion.unitId,
    motionId: state.motion.motionId,
  })
}

test('AI Capability Factory 是受控入口，來源字串無法偽造授權', () => {
  const state = enemyState([
    unit('enemy', 'goblin', 'enemy', 3, 3),
    unit('player', 'knight', 'player', 3, 4),
  ], 'enemy')
  const authorized = aiAction(state, 'ai-attack', { targetId: 'player' })
  assert.equal(isAuthorizedAIAction(authorized), true)
  const forged = {
    type: 'ai-attack',
    source: 'ai',
    turnId: state.turn.turnId,
    unitId: 'enemy',
    targetId: 'player',
  }
  assert.equal(isAuthorizedAIAction(forged), false)
  assert.equal(battleReducer(state, forged), state)
})

test('AI 決策為純函式、確定性且相同輸入不被修改', () => {
  const state = enemyState([
    unit('enemy', 'goblin', 'enemy', 2, 2),
    unit('target-b', 'knight', 'player', 3, 2),
    unit('target-a', 'knight', 'player', 2, 3),
  ], 'enemy')
  const snapshot = structuredClone(state)
  assert.deepEqual(decideEnemyTurn(state), decideEnemyTurn(state))
  assert.deepEqual(state, snapshot)
})

test('有直接合法攻擊時不移動，且無論遠處更高傷害仍直接攻擊', () => {
  const state = enemyState([
    unit('enemy', 'goblin', 'enemy', 3, 3),
    unit('near', 'knight', 'player', 3, 4, { hp: 100, def: 14 }),
    unit('far', 'assassin', 'player', 7, 7, { hp: 10, def: 0 }),
  ], 'enemy')
  assert.deepEqual(decideEnemyTurn(state), { type: 'ATTACK', targetId: 'near' })
})

test('直接攻擊目標排序優先擊倒而非較高非致命 Applied Damage', () => {
  const state = enemyState([
    unit('enemy', 'goblin', 'enemy', 3, 3),
    unit('lethal', 'knight', 'player', 3, 4, { hp: 5, def: 10 }),
    unit('heavy', 'knight', 'player', 2, 3, { hp: 100, def: 5 }),
  ], 'enemy')
  assert.deepEqual(decideEnemyTurn(state), { type: 'ATTACK', targetId: 'lethal' })
})

test('直接攻擊 Applied Damage、Initial Order 與 Unit ID 依序穩定比較', () => {
  const damageState = enemyState([
    unit('enemy', 'goblin', 'enemy', 3, 3),
    unit('armored', 'knight', 'player', 2, 3, { hp: 100, def: 10 }),
    unit('exposed', 'knight', 'player', 3, 4, { hp: 100, def: 5 }),
  ], 'enemy')
  assert.deepEqual(decideEnemyTurn(damageState), { type: 'ATTACK', targetId: 'exposed' })

  const orderState = enemyState([
    unit('enemy', 'goblin', 'enemy', 3, 3),
    unit('later', 'knight', 'player', 2, 3),
    unit('earlier', 'knight', 'player', 3, 4),
  ], 'enemy')
  assert.equal(decideEnemyTurn(orderState).targetId, 'later')

  const idState = {
    ...orderState,
    turn: { ...orderState.turn, timeline: [] },
  }
  assert.equal(decideEnemyTurn(idState).targetId, 'earlier')
})

test('無直接攻擊時產生本回合合法的 Move-to-Attack', () => {
  const state = enemyState([
    unit('enemy', 'goblin', 'enemy', 2, 2),
    unit('player', 'knight', 'player', 6, 2),
  ], 'enemy')
  const decision = decideEnemyTurn(state)
  assert.equal(decision.type, 'MOVE_ATTACK')
  const hypothetical = {
    ...state,
    units: state.units.map((candidate) => candidate.id === 'enemy'
      ? { ...candidate, position: decision.destination }
      : candidate),
  }
  assert.equal(canAttackTarget(hypothetical.units, 'enemy', decision.targetId), true)
  assert.ok(state.units.find((candidate) => candidate.id === 'enemy').movementPoints >= 1)
})

test('Move-to-Attack 候選在 Damage 後優先最小移動成本', () => {
  const state = enemyState([
    unit('enemy', 'goblin', 'enemy', 3, 3),
    unit('player-a', 'knight', 'player', 6, 3),
    unit('player-b', 'knight', 'player', 3, 5),
  ], 'enemy')
  const decision = decideEnemyTurn(state)
  assert.equal(decision.type, 'MOVE_ATTACK')
  assert.deepEqual(decision.destination, { column: 3, row: 4 })
  assert.equal(decision.targetId, 'player-b')
})

test('Move-to-Attack 保持最小與最大射程及 SQUARE/CROSS 幾何', () => {
  const rangerState = enemyState([
    unit('ranger-enemy', 'ranger', 'enemy', 1, 1),
    unit('player', 'knight', 'player', 7, 1),
  ], 'ranger-enemy')
  const decision = decideEnemyTurn(rangerState)
  assert.equal(decision.type, 'MOVE_ATTACK')
  const moved = rangerState.units.map((candidate) => candidate.id === 'ranger-enemy'
    ? { ...candidate, position: decision.destination }
    : candidate)
  assert.equal(canAttackTarget(moved, 'ranger-enemy', 'player'), true)
})

test('Approach 使用可通行路徑成本並選擇可證明改善的位置', () => {
  const state = enemyState([
    unit('enemy', 'goblin', 'enemy', 0, 0, { movementPoints: 3 }),
    unit('player', 'knight', 'player', 7, 0),
  ], 'enemy')
  const decision = decideEnemyTurn(state)
  assert.equal(decision.type, 'APPROACH')
  assert.equal(decision.destination.column > 0, true)
})

test('沒有可改善接近路徑時不為移動而移動', () => {
  const obstacles = [
    { id: 'block-east', type: 'wall', position: { x: 1, y: 0 }, walkable: false },
    { id: 'block-south', type: 'wall', position: { x: 0, y: 1 }, walkable: false },
  ]
  const state = enemyState([
    unit('enemy', 'goblin', 'enemy', 0, 0),
    unit('player', 'knight', 'player', 7, 7),
  ], 'enemy', obstacles)
  assert.deepEqual(decideEnemyTurn(state), { type: 'STANDBY' })
})

test('友軍佔位不得成為 AI 移動目的地，敵方障礙與地形成本沿用既有規則', () => {
  const state = enemyState([
    unit('enemy', 'goblin', 'enemy', 0, 6),
    unit('ally', 'goblin', 'enemy', 1, 6),
    unit('player', 'knight', 'player', 6, 0),
  ], 'enemy')
  const decision = decideEnemyTurn(state)
  assert.notEqual(decision.type, 'STANDBY')
  if (decision.type === 'APPROACH' || decision.type === 'MOVE_ATTACK') {
    assert.notDeepEqual(decision.destination, state.units.find((candidate) => candidate.id === 'ally').position)
  }
  const forestPath = [{ column: 0, row: 0 }, { column: 0, row: 1 }]
  assert.equal(calculatePathCost(
    forestPath,
    (cell) => TERRAIN_MOVEMENT_COST[getTerrainType(cell)],
  ), 2)
  assert.equal(calculatePathCost(
    [{ column: 6, row: 0 }, { column: 7, row: 0 }],
    (cell) => TERRAIN_MOVEMENT_COST[getTerrainType(cell)],
  ), 2)
})

test('無存活玩家時選擇安全待命且沒有自主 Terminal Outcome', () => {
  const state = enemyState([
    unit('enemy-a', 'goblin', 'enemy', 2, 2),
    unit('enemy-b', 'goblin', 'enemy', 5, 5),
  ], 'enemy-a')
  assert.deepEqual(decideEnemyTurn(state), { type: 'STANDBY' })
  assert.equal('outcome' in state, false)
})

test('玩家 Active Turn 與錯誤 Faction 的 AI 指令均被拒絕', () => {
  const player = unit('player', 'knight', 'player', 2, 2)
  const enemy = unit('enemy', 'goblin', 'enemy', 3, 2)
  const state = activateUnitFixture(createBattleState([player, enemy]), player.id)
  assert.equal(battleReducer(state, aiAction(state, 'ai-attack', { targetId: enemy.id })), state)

  const enemyTurn = activateUnitFixture(state, enemy.id)
  const wrongFaction = aiAction(enemyTurn, 'ai-attack', { targetId: player.id, unitId: player.id })
  assert.equal(battleReducer(enemyTurn, wrongFaction), enemyTurn)
})

test('過期 Turn、錯誤 Unit、Busy、Pending 與重播 AI Action 均為 no-op', () => {
  const state = enemyState([
    unit('enemy', 'goblin', 'enemy', 2, 2),
    unit('player', 'knight', 'player', 3, 2),
  ], 'enemy')
  assert.equal(battleReducer(state, aiAction(state, 'ai-attack', {
    targetId: 'player',
    turnId: state.turn.turnId + 1,
  })), state)
  assert.equal(battleReducer(state, aiAction(state, 'ai-attack', {
    targetId: 'player',
    unitId: 'missing',
  })), state)
  const busy = { ...state, motion: {
    motionId: 1,
    turnId: state.turn.turnId,
    unitId: 'enemy',
    path: [{ column: 2, row: 2 }, { column: 2, row: 3 }],
    cost: 1,
  } }
  assert.equal(battleReducer(busy, aiAction(busy, 'ai-standby')), busy)

  const reserved = battleReducer(state, aiAction(state, 'ai-attack', { targetId: 'player' }))
  assert.equal(battleReducer(reserved, aiAction(state, 'ai-attack', { targetId: 'player' })), reserved)
})

test('直接 AI Attack 使用既有 Reservation、Impact、Confirmed Event 與 Combat Action', () => {
  const state = enemyState([
    unit('enemy', 'goblin', 'enemy', 2, 2),
    unit('player', 'knight', 'player', 3, 2),
  ], 'enemy')
  const reserved = battleReducer(state, aiAction(state, 'ai-attack', { targetId: 'player' }))
  assert.equal(reserved.attackMotion.phase, 'PENDING_IMPACT')
  assert.equal(reserved.turnAction.combatAction, 'RESERVED')
  assert.equal(reserved.units.find((candidate) => candidate.id === 'player').hp, 100)

  const impacted = battleReducer(reserved, {
    type: 'attack-impact',
    attackId: reserved.attackMotion.attackId,
  })
  assert.equal(impacted.units.find((candidate) => candidate.id === 'player').hp, 95)
  assert.equal(impacted.turnAction.combatAction, 'CONSUMED')
  assert.equal(impacted.confirmedImpacts.length, 1)
  assert.equal(battleReducer(impacted, {
    type: 'attack-impact',
    attackId: reserved.attackMotion.attackId,
  }), impacted)
})

test('Enemy AI Move-to-Attack 使用 Motion Finish 後才可建立 Reservation', () => {
  const state = enemyState([
    unit('enemy', 'goblin', 'enemy', 2, 2),
    unit('player', 'knight', 'player', 6, 2),
  ], 'enemy')
  const decision = decideEnemyTurn(state)
  assert.equal(decision.type, 'MOVE_ATTACK')
  const moving = battleReducer(state, aiAction(state, 'ai-move', {
    destination: decision.destination,
    targetId: decision.targetId,
  }))
  assert.ok(moving.motion)
  assert.equal(moving.turnAction.movementUsed, false)
  assert.equal(battleReducer(moving, aiAction(state, 'ai-attack', {
    targetId: decision.targetId,
  })), moving)

  const moved = completeMove(moving)
  assert.equal(moved.turnAction.movementUsed, true)
  assert.equal(moved.aiProgress.phase, 'MOVE_COMPLETED')
  assert.deepEqual(getAIControllerIntent(moved), {
    type: 'ATTACK',
    targetId: decision.targetId,
  })
  assert.deepEqual(moved.units.find((candidate) => candidate.id === 'enemy').position, decision.destination)
  const attacking = battleReducer(moved, aiAction(moved, 'ai-attack', {
    targetId: decision.targetId,
  }))
  assert.equal(attacking.attackMotion.attackerId, 'enemy')
  assert.equal(attacking.turnAction.movementInitiationLocked, true)
})

test('Controller 在合法 Direct Attack State 提交 Attack Intent，不誤選 Standby', () => {
  const state = enemyState([
    unit('enemy', 'goblin', 'enemy', 3, 3),
    unit('player', 'knight', 'player', 3, 4),
  ], 'enemy')
  assert.deepEqual(getAIControllerIntent(state), {
    type: 'ATTACK',
    targetId: 'player',
  })
})

test('正式初始戰場 Goblin A 移動完成的相鄰 Ranger 必須進入 Attack', () => {
  const state = enemyState([
    unit('goblin-a', 'goblin', 'enemy', 4, 3),
    unit('ranger', 'ranger', 'player', 4, 4),
  ], 'goblin-a')
  assert.deepEqual(getAIControllerIntent(state), {
    type: 'ATTACK',
    targetId: 'ranger',
  })
})

test('Move-to-Attack 完整 Reducer Transition 建立 Attack、Impact 並完成 Turn', () => {
  const state = enemyState([
    unit('enemy', 'goblin', 'enemy', 2, 2),
    unit('player', 'knight', 'player', 6, 2),
  ], 'enemy')
  const decision = decideEnemyTurn(state)
  let next = battleReducer(state, aiAction(state, 'ai-move', {
    destination: decision.destination,
    targetId: decision.targetId,
  }))
  next = completeMove(next)
  const intent = getAIControllerIntent(next)
  assert.equal(intent.type, 'ATTACK')
  next = battleReducer(next, aiAction(next, 'ai-attack', { targetId: intent.targetId }))
  assert.equal(next.attackMotion.phase, 'PENDING_IMPACT')
  next = battleReducer(next, { type: 'attack-impact', attackId: next.attackMotion.attackId })
  assert.equal(next.units.find((candidate) => candidate.id === 'player').hp, 95)
  next = battleReducer(next, { type: 'attack-complete', attackId: next.attackMotion.attackId })
  assert.equal(next.turn.turnId, state.turn.turnId + 1)
})

test('Move 完成後原目標失效可重新驗證並攻擊另一個合法目標', () => {
  const state = enemyState([
    unit('enemy', 'goblin', 'enemy', 2, 2),
    unit('original', 'knight', 'player', 3, 3),
    unit('alternate', 'knight', 'player', 7, 7),
  ], 'enemy')
  const moving = battleReducer(state, aiAction(state, 'ai-move', {
    destination: { column: 2, row: 3 },
    targetId: 'original',
  }))
  const moved = completeMove(moving)
  const retargeted = {
    ...moved,
    units: moved.units.map((candidate) => {
      if (candidate.id === 'original') return { ...candidate, position: { column: 7, row: 6 } }
      if (candidate.id === 'alternate') return { ...candidate, position: { column: 3, row: 3 } }
      return candidate
    }),
  }
  assert.deepEqual(getAIControllerIntent(retargeted), {
    type: 'ATTACK',
    targetId: 'alternate',
  })
  const attacking = battleReducer(retargeted, aiAction(retargeted, 'ai-attack', {
    targetId: 'alternate',
  }))
  assert.equal(attacking.attackMotion.targetId, 'alternate')
})

test('Movement Initiation Lock 不禁止 Move-completed AI Attack', () => {
  const state = enemyState([
    unit('enemy', 'goblin', 'enemy', 2, 2),
    unit('player', 'knight', 'player', 4, 2),
  ], 'enemy')
  let moved = battleReducer(state, aiAction(state, 'ai-move', {
    destination: { column: 3, row: 2 },
    targetId: 'player',
  }))
  moved = completeMove(moved)
  moved = {
    ...moved,
    turnAction: { ...moved.turnAction, movementInitiationLocked: true },
  }
  const attacking = battleReducer(moved, aiAction(moved, 'ai-attack', {
    targetId: 'player',
  }))
  assert.equal(attacking.attackMotion.targetId, 'player')
  assert.equal(attacking.turnAction.combatAction, 'RESERVED')
})

test('Reducer 拒絕移動後無法攻擊指定目標的 AI Move Intent', () => {
  const state = enemyState([
    unit('enemy', 'goblin', 'enemy', 2, 2),
    unit('player', 'knight', 'player', 7, 7),
  ], 'enemy')
  const invalid = aiAction(state, 'ai-move', {
    destination: { column: 2, row: 3 },
    targetId: 'player',
  })
  assert.equal(battleReducer(state, invalid), state)
})

test('AI 攻擊後再移動被 Action Economy 與 Progress 拒絕', () => {
  const state = enemyState([
    unit('enemy', 'goblin', 'enemy', 2, 2),
    unit('player', 'knight', 'player', 3, 2),
  ], 'enemy')
  const reserved = battleReducer(state, aiAction(state, 'ai-attack', { targetId: 'player' }))
  assert.equal(battleReducer(reserved, aiAction(state, 'ai-move', {
    destination: { column: 2, row: 3 },
    targetId: null,
  })), reserved)
})

test('Pre-impact AI Abort 不扣血、保留 Movement Lock，Standby 有限結束 Turn', () => {
  const state = enemyState([
    unit('enemy', 'goblin', 'enemy', 2, 2),
    unit('player', 'knight', 'player', 3, 2),
  ], 'enemy')
  const reserved = battleReducer(state, aiAction(state, 'ai-attack', { targetId: 'player' }))
  const aborted = battleReducer(reserved, {
    type: 'attack-abort',
    attackId: reserved.attackMotion.attackId,
  })
  assert.equal(aborted.units.find((candidate) => candidate.id === 'player').hp, 100)
  assert.equal(aborted.turnAction.combatAction, 'AVAILABLE')
  assert.equal(aborted.turnAction.movementInitiationLocked, true)
  assert.equal(aborted.aiProgress.phase, 'ATTACKING')
  const completed = battleReducer(aborted, aiAction(aborted, 'ai-standby'))
  assert.equal(completed.turn.turnId, aborted.turn.turnId + 1)
  assert.equal(completed.aiProgress, null)
})

test('Post-impact AI Abort 保留傷害且不重複扣血', () => {
  const state = enemyState([
    unit('enemy', 'goblin', 'enemy', 2, 2),
    unit('player', 'knight', 'player', 3, 2),
  ], 'enemy')
  const reserved = battleReducer(state, aiAction(state, 'ai-attack', { targetId: 'player' }))
  const impacted = battleReducer(reserved, {
    type: 'attack-impact',
    attackId: reserved.attackMotion.attackId,
  })
  const completed = battleReducer(impacted, {
    type: 'attack-abort',
    attackId: reserved.attackMotion.attackId,
  })
  assert.equal(completed.units.find((candidate) => candidate.id === 'player').hp, 95)
  assert.equal(completed.turn.turnId, impacted.turn.turnId + 1)
  assert.equal(battleReducer(completed, {
    type: 'attack-impact',
    attackId: reserved.attackMotion.attackId,
  }), completed)
})

test('致命 AI Impact 建立 Death Motion，死亡完成後才切 Turn', () => {
  const state = enemyState([
    unit('enemy', 'goblin', 'enemy', 2, 2),
    unit('player', 'knight', 'player', 3, 2, { hp: 5 }),
  ], 'enemy')
  const reserved = battleReducer(state, aiAction(state, 'ai-attack', { targetId: 'player' }))
  const impacted = battleReducer(reserved, {
    type: 'attack-impact',
    attackId: reserved.attackMotion.attackId,
  })
  assert.equal(impacted.deathMotions.length, 1)
  const recovered = battleReducer(impacted, {
    type: 'attack-complete',
    attackId: reserved.attackMotion.attackId,
  })
  assert.equal(recovered.turn.turnId, impacted.turn.turnId)
  assert.ok(recovered.pendingTurnCompletion)

  const completed = battleReducer(recovered, {
    type: 'death-complete',
    deathId: recovered.deathMotions[0].deathId,
    unitId: 'player',
  })
  assert.equal(completed.turn.turnId, impacted.turn.turnId + 1)
  assert.equal(completed.units.some((candidate) => candidate.id === 'player'), false)
})

test('AI Turn Reset 清除 Progress，不污染下一位並拒絕舊 Context', () => {
  const state = enemyState([
    unit('enemy', 'goblin', 'enemy', 2, 2),
    unit('player', 'knight', 'player', 3, 2),
  ], 'enemy')
  const staleAction = aiAction(state, 'ai-standby')
  const completed = battleReducer(state, staleAction)
  assert.equal(completed.aiProgress, null)
  assert.equal(completed.turnAction.turnId, completed.turn.turnId)
  assert.equal(battleReducer(completed, staleAction), completed)
})
