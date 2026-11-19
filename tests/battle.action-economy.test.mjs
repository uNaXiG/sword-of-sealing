import test from 'node:test'
import assert from 'node:assert/strict'
import { createBattleUnit } from '../src/game/classes/class.factory.ts'
import { battleReducer, createBattleState } from '../src/game/battle/battle.state.ts'
import { canConfirmAttack } from '../src/game/battle/battle.action.ts'
import { activateUnitFixture } from './turn.fixture.mjs'

function createDuel() {
  const player = createBattleUnit({
    id: 'player',
    class: 'knight',
    faction: 'player',
    position: { column: 2, row: 2 },
  })
  const enemy = createBattleUnit({
    id: 'enemy',
    class: 'goblin',
    faction: 'enemy',
    position: { column: 3, row: 2 },
  })
  return { player, enemy, state: activateUnitFixture(createBattleState([player, enemy]), player.id) }
}

function command(state, action) {
  return battleReducer(state, {
    ...action,
    turnId: state.turn.turnId,
    unitId: state.turn.activeUnitId ?? '',
  })
}

function beginAttack() {
  const duel = createDuel()
  let state = command(duel.state, { type: 'set-mode', mode: 'ATTACK' })
  state = command(state, { type: 'select-attack-target', targetId: duel.enemy.id })
  return { ...duel, state }
}

function confirmAttack(state) {
  return command(state, { type: 'confirm-attack' })
}

function completeMove(state, cell = { column: 2, row: 3 }) {
  state = command(state, { type: 'set-mode', mode: 'MOVE' })
  state = command(state, { type: 'cell', cell })
  assert.ok(state.motion)
  return battleReducer(state, {
    type: 'finish',
    unitId: state.motion.unitId,
    motionId: state.motion.motionId,
  })
}

test('Turn Action State 初始化並與 Active Unit、Turn ID 維持單一來源', () => {
  const { state } = createDuel()
  assert.deepEqual(state.turnAction, {
    turnId: state.turn.turnId,
    unitId: state.turn.activeUnitId,
    movementUsed: false,
    movementInitiationLocked: false,
    combatAction: 'AVAILABLE',
    reservedAttackId: null,
  })
  assert.equal(state.pendingTurnCompletion, null)
  assert.equal(state.lastMove, null)
})

test('缺失、錯誤或過期 Context 的 Standby 以 no-op 拒絕', () => {
  const { state } = createDuel()
  assert.equal(battleReducer(state, { type: 'standby' }), state)
  assert.equal(battleReducer(state, {
    type: 'standby',
    turnId: state.turn.turnId + 1,
    unitId: state.turn.activeUnitId,
  }), state)
  assert.equal(battleReducer(state, {
    type: 'standby',
    turnId: state.turn.turnId,
    unitId: 'enemy',
  }), state)

  const staleContext = {
    turnId: state.turn.turnId,
    unitId: state.turn.activeUnitId,
  }
  const next = command(state, { type: 'standby' })
  assert.equal(battleReducer(next, { type: 'standby', ...staleContext }), next)
  assert.equal(next.turn.turnId, state.turn.turnId + 1)
})

test('舊 Turn 指令不可污染 Set Mode、Target Selection、Cancel、Undo 或 Confirm', () => {
  const { state } = createDuel()
  const stale = { turnId: state.turn.turnId, unitId: state.turn.activeUnitId }
  const moved = completeMove(state)
  const next = command(moved, { type: 'standby' })
  const actions = [
    { type: 'set-mode', mode: 'ATTACK' },
    { type: 'select-attack-target', targetId: 'enemy' },
    { type: 'cancel-move-mode' },
    { type: 'cancel-attack' },
    { type: 'confirm-attack' },
    { type: 'undo' },
    { type: 'cell', cell: { column: 2, row: 3 } },
  ]
  for (const action of actions) {
    assert.equal(battleReducer(next, { ...action, ...stale }), next)
  }
})

test('合法 Movement Finish 消耗權限，Cancel 不消耗，Undo 恢復', () => {
  const { state, player } = createDuel()
  let moving = command(state, { type: 'set-mode', mode: 'MOVE' })
  moving = command(moving, { type: 'cell', cell: { column: 2, row: 3 } })
  const canceled = battleReducer(moving, {
    type: 'cancel',
    unitId: player.id,
    motionId: moving.motion.motionId,
  })
  assert.equal(canceled.turnAction.movementUsed, false)
  assert.equal(canceled.lastMove, null)

  const moved = completeMove(state)
  assert.equal(moved.turnAction.movementUsed, true)
  assert.ok(moved.lastMove)
  assert.equal(command(moved, { type: 'set-mode', mode: 'MOVE' }), moved)
  const undone = command(moved, { type: 'undo' })
  assert.equal(undone.turnAction.movementUsed, false)
  assert.deepEqual(undone.units[0].position, player.position)
  assert.equal(undone.turn.turnId, moved.turn.turnId)
  assert.equal(undone.turn.battleTime, moved.turn.battleTime)
  assert.notEqual(command(undone, { type: 'set-mode', mode: 'MOVE' }), undone)
})

test('Movement Initiation Lock 單獨禁止 Undo，即使合法 lastMove 仍存在', () => {
  const { state } = createDuel()
  const moved = completeMove(state)
  const lockedWithUndoRecord = {
    ...moved,
    turnAction: {
      ...moved.turnAction,
      movementInitiationLocked: true,
    },
  }

  assert.ok(lockedWithUndoRecord.lastMove)
  assert.equal(command(lockedWithUndoRecord, { type: 'undo' }), lockedWithUndoRecord)
  assert.equal(lockedWithUndoRecord.turnAction.movementUsed, true)
})

test('Confirm Attack 保留 Reservation 與 Movement Lock，未在確認時扣血', () => {
  const { state, enemy } = beginAttack()
  const confirmed = confirmAttack(state)
  assert.equal(confirmed.units.find((unit) => unit.id === enemy.id).hp, enemy.hp)
  assert.equal(confirmed.turnAction.combatAction, 'RESERVED')
  assert.equal(confirmed.turnAction.reservedAttackId, confirmed.attackMotion.attackId)
  assert.equal(confirmed.turnAction.movementInitiationLocked, true)
  assert.equal(confirmed.lastMove, null)
  assert.equal(confirmAttack(confirmed), confirmed)
})

test('Reducer 與共用 Combat Guard 對合法、非法 Context、已消耗及非法目標一致', () => {
  const { state } = beginAttack()
  assert.equal(canConfirmAttack(state), true)
  assert.notEqual(confirmAttack(state), state)

  const invalidContext = {
    ...state,
    turnAction: {
      ...state.turnAction,
      turnId: state.turn.turnId + 1,
    },
  }
  assert.equal(canConfirmAttack(invalidContext), false)
  assert.equal(confirmAttack(invalidContext), invalidContext)

  const consumed = {
    ...state,
    turnAction: {
      ...state.turnAction,
      combatAction: 'CONSUMED',
    },
  }
  assert.equal(canConfirmAttack(consumed), false)
  const rejectedConsumed = confirmAttack(consumed)
  assert.equal(rejectedConsumed.attackMotion, null)
  assert.equal(rejectedConsumed.turnAction.reservedAttackId, null)
  assert.equal(rejectedConsumed.turnAction.combatAction, 'CONSUMED')

  const invalidTarget = {
    ...state,
    selectedAttackTargetId: 'missing',
  }
  assert.equal(canConfirmAttack(invalidTarget), false)
  const rejectedTarget = confirmAttack(invalidTarget)
  assert.equal(rejectedTarget.attackMotion, null)
  assert.equal(rejectedTarget.selectedAttackTargetId, null)
  assert.equal(rejectedTarget.nextAttackId, invalidTarget.nextAttackId)

  const busy = {
    ...state,
    motion: {
      motionId: 1,
      turnId: state.turn.turnId,
      unitId: state.turn.activeUnitId,
      path: [{ column: 2, row: 2 }, { column: 2, row: 3 }],
      cost: 1,
    },
  }
  assert.equal(confirmAttack(busy), busy)
})

test('已移動後 Confirm Attack 清除 Undo，但維持已消耗 Movement Action', () => {
  const { state, enemy } = createDuel()
  const moved = completeMove(state)
  let attacking = command(moved, { type: 'set-mode', mode: 'ATTACK' })
  attacking = command(attacking, {
    type: 'select-attack-target',
    targetId: enemy.id,
  })
  const confirmed = confirmAttack(attacking)
  assert.equal(confirmed.lastMove, null)
  assert.equal(confirmed.turnAction.movementUsed, true)
  assert.equal(confirmed.turnAction.movementInitiationLocked, true)
})

test('合法 Impact 原子消耗 Combat Action，重複 Impact 與 Complete 冪等', () => {
  const { state, enemy } = beginAttack()
  const confirmed = confirmAttack(state)
  const impacted = battleReducer(confirmed, {
    type: 'attack-impact',
    attackId: confirmed.attackMotion.attackId,
  })
  assert.equal(impacted.turnAction.combatAction, 'CONSUMED')
  assert.equal(impacted.turnAction.reservedAttackId, null)
  assert.equal(impacted.units.find((unit) => unit.id === enemy.id).hp, enemy.hp - 15)
  assert.equal(battleReducer(impacted, {
    type: 'attack-impact',
    attackId: confirmed.attackMotion.attackId,
  }), impacted)

  const complete = battleReducer(impacted, {
    type: 'attack-complete',
    attackId: confirmed.attackMotion.attackId,
  })
  assert.equal(complete.turn.turnId, impacted.turn.turnId + 1)
  assert.equal(battleReducer(complete, {
    type: 'attack-complete',
    attackId: confirmed.attackMotion.attackId,
  }), complete)
})

test('Pre-impact Abort 釋放 Reservation、保留 Movement Lock 且可重攻或待命', () => {
  const { state } = beginAttack()
  const confirmed = confirmAttack(state)
  const aborted = battleReducer(confirmed, {
    type: 'attack-abort',
    attackId: confirmed.attackMotion.attackId,
  })
  assert.equal(aborted.turn.turnId, confirmed.turn.turnId)
  assert.equal(aborted.turnAction.combatAction, 'AVAILABLE')
  assert.equal(aborted.turnAction.reservedAttackId, null)
  assert.equal(aborted.turnAction.movementInitiationLocked, true)
  assert.equal(aborted.turnAction.movementUsed, false)
  assert.equal(command(aborted, { type: 'set-mode', mode: 'MOVE' }), aborted)
  assert.notEqual(command(aborted, { type: 'set-mode', mode: 'ATTACK' }), aborted)
  assert.notEqual(command(aborted, { type: 'standby' }), aborted)
})

test('Pre-impact Abort 不恢復已使用移動或 Undo Record', () => {
  const { state, enemy } = createDuel()
  const moved = completeMove(state)
  let attacking = command(moved, { type: 'set-mode', mode: 'ATTACK' })
  attacking = command(attacking, {
    type: 'select-attack-target',
    targetId: enemy.id,
  })
  const confirmed = confirmAttack(attacking)
  const aborted = battleReducer(confirmed, {
    type: 'attack-abort',
    attackId: confirmed.attackMotion.attackId,
  })
  assert.equal(aborted.turnAction.movementUsed, true)
  assert.equal(aborted.lastMove, null)
  assert.equal(command(aborted, { type: 'undo' }), aborted)
})

test('Impact Snapshot 驗證失敗一致釋放 Reservation；舊 Abort 不影響新 Reservation', () => {
  const { state } = beginAttack()
  const confirmed = confirmAttack(state)
  const movedTarget = {
    ...confirmed,
    units: confirmed.units.map((unit) => unit.id === 'enemy'
      ? { ...unit, position: { column: 4, row: 2 } }
      : unit),
  }
  const aborted = battleReducer(movedTarget, {
    type: 'attack-impact',
    attackId: confirmed.attackMotion.attackId,
  })
  assert.equal(aborted.attackMotion, null)
  assert.equal(aborted.turnAction.combatAction, 'AVAILABLE')
  assert.equal(aborted.turnAction.reservedAttackId, null)

  const repaired = {
    ...aborted,
    units: aborted.units.map((unit) => unit.id === 'enemy'
      ? { ...unit, position: { column: 3, row: 2 } }
      : unit),
  }
  const attackMode = command(repaired, { type: 'set-mode', mode: 'ATTACK' })
  const retargeted = command(attackMode, { type: 'select-attack-target', targetId: 'enemy' })
  const reservedAgain = confirmAttack(retargeted)
  assert.equal(reservedAgain.turnAction.reservedAttackId, 2)
  assert.equal(battleReducer(reservedAgain, {
    type: 'attack-abort',
    attackId: confirmed.attackMotion.attackId,
  }), reservedAgain)
})

test('Post-impact Abort 保留傷害、消耗狀態並安全切換 Turn', () => {
  const { state, enemy } = beginAttack()
  const confirmed = confirmAttack(state)
  const impacted = battleReducer(confirmed, {
    type: 'attack-impact',
    attackId: confirmed.attackMotion.attackId,
  })
  const completed = battleReducer(impacted, {
    type: 'attack-abort',
    attackId: confirmed.attackMotion.attackId,
  })
  assert.equal(completed.units.find((unit) => unit.id === enemy.id).hp, enemy.hp - 15)
  assert.equal(completed.turn.turnId, impacted.turn.turnId + 1)
  assert.deepEqual(completed.turnAction, {
    turnId: completed.turn.turnId,
    unitId: completed.turn.activeUnitId,
    movementUsed: false,
    movementInitiationLocked: false,
    combatAction: 'AVAILABLE',
    reservedAttackId: null,
  })
})

test('Turn Reset 僅清理 Turn-scoped State 並保留 Persistent State 與單調 ID', () => {
  const { state, enemy } = beginAttack()
  const confirmed = confirmAttack(state)
  const impacted = battleReducer(confirmed, {
    type: 'attack-impact',
    attackId: confirmed.attackMotion.attackId,
  })
  const completed = battleReducer(impacted, {
    type: 'attack-complete',
    attackId: confirmed.attackMotion.attackId,
  })
  assert.equal(completed.units.find((unit) => unit.id === enemy.id).hp, enemy.hp - 15)
  assert.deepEqual(completed.units.map(({ id, hp, sp, movementPoints, position }) => ({
    id, hp, sp, movementPoints, position,
  })), impacted.units.map(({ id, hp, sp, movementPoints, position }) => ({
    id, hp, sp, movementPoints, position,
  })))
  assert.equal(completed.confirmedImpacts.length, 1)
  assert.equal(completed.nextAttackId, impacted.nextAttackId)
  assert.equal(completed.nextMotionId, impacted.nextMotionId)
  assert.equal(completed.nextDeathId, impacted.nextDeathId)
  assert.equal(completed.lastMove, null)
  assert.equal(completed.pendingTurnCompletion, null)
})

test('相同角色再次取得 Individual Turn 時重置全部行動權且舊 Context 失效', () => {
  const { state } = createDuel()
  const staleContext = {
    turnId: state.turn.turnId,
    unitId: state.turn.activeUnitId,
  }
  const moved = completeMove(state)
  const playerTurn = command(moved, { type: 'standby' })
  assert.equal(playerTurn.turn.activeUnitId, 'player')
  assert.equal(playerTurn.turnAction.turnId, playerTurn.turn.turnId)
  assert.equal(playerTurn.turnAction.unitId, 'player')
  assert.equal(playerTurn.turnAction.movementUsed, false)
  assert.equal(playerTurn.turnAction.movementInitiationLocked, false)
  assert.equal(playerTurn.turnAction.combatAction, 'AVAILABLE')
  assert.equal(battleReducer(playerTurn, { type: 'standby', ...staleContext }), playerTurn)
  assert.notEqual(command(playerTurn, { type: 'set-mode', mode: 'MOVE' }), playerTurn)
})

test('不同玩家在相同 Battle Time 連續取得 Turn 時舊 Standby 只完成原 Turn', () => {
  const first = createBattleUnit({
    id: 'first',
    class: 'knight',
    faction: 'player',
    position: { column: 1, row: 1 },
  })
  const second = createBattleUnit({
    id: 'second',
    class: 'knight',
    faction: 'player',
    position: { column: 4, row: 4 },
  })
  const activated = activateUnitFixture(createBattleState([first, second]), first.id)
  const state = {
    ...activated,
    turn: {
      ...activated.turn,
      timeline: activated.turn.timeline.map((entry) =>
        entry.unitId === second.id ? { ...entry, remainingDistance: 0 } : entry),
    },
  }
  const stale = { turnId: state.turn.turnId, unitId: first.id }
  const next = command(state, { type: 'standby' })
  assert.equal(next.turn.activeUnitId, second.id)
  assert.equal(next.turn.turnId, state.turn.turnId + 1)
  assert.equal(next.turn.battleTime, state.turn.battleTime)
  assert.equal(battleReducer(next, { type: 'standby', ...stale }), next)
})

test('Direct Reducer 拒絕缺失、過期、錯誤 Context 及舊 Confirm／Standby', () => {
  const { state, enemy } = createDuel()
  const valid = {
    turnId: state.turn.turnId,
    unitId: state.turn.activeUnitId,
  }

  assert.equal(battleReducer(state, { type: 'standby', unitId: valid.unitId }), state)
  assert.equal(battleReducer(state, { type: 'standby', turnId: valid.turnId }), state)
  assert.equal(battleReducer(state, {
    type: 'standby',
    turnId: valid.turnId - 1,
    unitId: valid.unitId,
  }), state)
  assert.equal(battleReducer(state, {
    type: 'standby',
    turnId: valid.turnId,
    unitId: enemy.id,
  }), state)

  let attack = battleReducer(state, { type: 'set-mode', mode: 'ATTACK', ...valid })
  attack = battleReducer(attack, {
    type: 'select-attack-target',
    targetId: enemy.id,
    ...valid,
  })
  assert.equal(battleReducer(attack, {
    type: 'confirm-attack',
    turnId: valid.turnId - 1,
    unitId: valid.unitId,
  }), attack)

  const first = createBattleUnit({
    id: 'first',
    class: 'knight',
    faction: 'player',
    position: { column: 1, row: 1 },
  })
  const second = createBattleUnit({
    id: 'second',
    class: 'knight',
    faction: 'player',
    position: { column: 4, row: 4 },
  })
  const activated = activateUnitFixture(createBattleState([first, second]), first.id)
  const consecutive = {
    ...activated,
    turn: {
      ...activated.turn,
      timeline: activated.turn.timeline.map((entry) =>
        entry.unitId === second.id ? { ...entry, remainingDistance: 0 } : entry),
    },
  }
  const oldStandby = {
    type: 'standby',
    turnId: consecutive.turn.turnId,
    unitId: first.id,
  }
  const next = battleReducer(consecutive, oldStandby)
  assert.equal(next.turn.activeUnitId, second.id)
  assert.equal(next.turn.turnId, consecutive.turn.turnId + 1)
  assert.equal(battleReducer(next, oldStandby), next)
})
