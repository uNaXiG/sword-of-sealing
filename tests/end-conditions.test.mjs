import assert from 'node:assert/strict'
import test from 'node:test'
import { createBattleUnit } from '../src/game/classes/class.factory.ts'
import {
  dispatchAIControllerAction,
  getAIControllerIntent,
} from '../src/game/battle/battle.ai.gateway.ts'
import { createBattleSession } from '../src/game/battle/battle.session.ts'
import { createBattleState } from '../src/game/battle/battle.state.ts'
import { createBattleConditionContext } from '../src/game/end-conditions/end-condition.context.ts'
import { LossCondition } from '../src/game/end-conditions/loss-condition.ts'
import { resolveBattleOutcome } from '../src/game/end-conditions/outcome-resolver.ts'
import { AllDead as LossAllDead } from '../src/game/end-conditions/loss/all-dead.ts'
import { WinCondition } from '../src/game/end-conditions/win-condition.ts'
import { AllDead as WinAllDead } from '../src/game/end-conditions/win/all-dead.ts'

function makeUnit(id, unitClass, faction, column, row, overrides = {}) {
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

const knight = makeUnit('knight', 'knight', 'player', 3, 3)
const goblin = makeUnit('goblin', 'goblin', 'enemy', 4, 3)

class ConstantCondition {
  constructor(outcome, result, onEvaluate = null) {
    this.outcome = outcome
    this.result = result
    this.onEvaluate = onEvaluate
  }

  evaluate(context) {
    this.onEvaluate?.(context)
    return this.result
  }
}

function createAllDeadSession(units) {
  return createBattleSession({
    units,
    winCondition: new WinCondition([new WinAllDead()]),
    lossCondition: new LossCondition([new LossAllDead()]),
  })
}

function withTurnContext(state, action) {
  return {
    ...action,
    turnId: state.turn.turnId,
    unitId: state.turn.activeUnitId,
  }
}

function beginLethalPlayerAttack(session) {
  let state = session.initialState
  state = session.reducer(state, withTurnContext(state, { type: 'set-mode', mode: 'ATTACK' }))
  state = session.reducer(state, withTurnContext(state, {
    type: 'select-attack-target',
    targetId: goblin.id,
  }))
  state = session.reducer(state, withTurnContext(state, { type: 'confirm-attack' }))
  state = session.reducer(state, { type: 'attack-impact', attackId: state.attackMotion.attackId })
  return state
}

test('Win and loss managers cover single, ANY, ALL, and default ANY truth tables', () => {
  const context = createBattleConditionContext(
    createBattleState([knight, goblin]),
    [knight, goblin],
  )
  const winTrue = new ConstantCondition('VICTORY', true)
  const winFalse = new ConstantCondition('VICTORY', false)
  const lossTrue = new ConstantCondition('DEFEAT', true)
  const lossFalse = new ConstantCondition('DEFEAT', false)

  assert.equal(new WinCondition([winTrue]).evaluate(context), true)
  assert.equal(new WinCondition([winFalse]).evaluate(context), false)
  assert.equal(new LossCondition([lossTrue]).evaluate(context), true)
  assert.equal(new LossCondition([lossFalse]).evaluate(context), false)
  assert.equal(new WinCondition([winTrue, new ConstantCondition('VICTORY', true)]).evaluate(context), true)
  assert.equal(new WinCondition([winFalse, new ConstantCondition('VICTORY', false)]).evaluate(context), false)
  assert.equal(new WinCondition([winTrue, winFalse]).evaluate(context), true)
  assert.equal(new WinCondition([winFalse, winTrue], 'ALL').evaluate(context), false)
  assert.equal(new WinCondition([winFalse, new ConstantCondition('VICTORY', false)], 'ALL').evaluate(context), false)
  assert.equal(new WinCondition([winTrue, new ConstantCondition('VICTORY', true)], 'ALL').evaluate(context), true)
  assert.equal(new LossCondition([lossTrue, new ConstantCondition('DEFEAT', true)]).evaluate(context), true)
  assert.equal(new LossCondition([lossFalse, new ConstantCondition('DEFEAT', false)]).evaluate(context), false)
  assert.equal(new LossCondition([lossFalse, lossTrue]).evaluate(context), true)
  assert.equal(new LossCondition([lossTrue, lossFalse], 'ALL').evaluate(context), false)
  assert.equal(new LossCondition([lossFalse, new ConstantCondition('DEFEAT', false)], 'ALL').evaluate(context), false)
  assert.equal(new LossCondition([lossTrue, new ConstantCondition('DEFEAT', true)], 'ALL').evaluate(context), true)
})

test('condition configuration rejects empty arrays, invalid modes, and invalid strategies', () => {
  assert.throws(() => new WinCondition([]), /At least one end condition/)
  assert.throws(() => new LossCondition([]), /At least one end condition/)
  assert.throws(() => new WinCondition([new ConstantCondition('VICTORY', true)], 'ANYTHING'), /Invalid condition evaluation mode/)
  assert.throws(() => new WinCondition([{}]), /required end condition contract/)
  assert.throws(() => new WinCondition([new ConstantCondition('DEFEAT', true)]), /required end condition contract/)
  assert.throws(() => new WinCondition([new ConstantCondition('VICTORY', 1)]).evaluate(
    createBattleConditionContext(createBattleState([knight, goblin]), [knight, goblin]),
  ), /must return a boolean/)
})

test('manager snapshots its input collection and freezes injected strategies', () => {
  const condition = new ConstantCondition('VICTORY', false)
  const configured = [condition]
  const manager = new WinCondition(configured)
  configured.push(new ConstantCondition('VICTORY', true))

  const context = createBattleConditionContext(createBattleState([knight, goblin]), [knight, goblin])
  assert.equal(manager.evaluate(context), false)
  assert.equal(Object.isFrozen(condition), true)
})

test('test-only parameterized strategies preserve constructor-specific behavior in the injected reducer', () => {
  class MinimumRosterWin {
    outcome = 'VICTORY'

    constructor(minimumUnits) {
      this.minimumUnits = minimumUnits
    }

    evaluate(context) {
      return context.initialUnits.length >= this.minimumUnits
    }
  }

  const createMinimumRosterSession = (minimumUnits) => createBattleSession({
    units: [knight, goblin],
    winCondition: new WinCondition([new MinimumRosterWin(minimumUnits)]),
    lossCondition: new LossCondition([new ConstantCondition('DEFEAT', false)]),
  })
  const smallerRequirement = createMinimumRosterSession(2)
  const largerRequirement = createMinimumRosterSession(3)

  const smallerResult = smallerRequirement.reducer(
    smallerRequirement.initialState,
    withTurnContext(smallerRequirement.initialState, { type: 'standby' }),
  )
  const largerResult = largerRequirement.reducer(
    largerRequirement.initialState,
    withTurnContext(largerRequirement.initialState, { type: 'standby' }),
  )

  assert.equal(smallerResult.outcome, 'VICTORY')
  assert.equal(largerResult.outcome, null)
})

function snapshotNestedTestConfiguration(configuration) {
  return Object.freeze({
    target: Object.freeze({ faction: configuration.target.faction }),
    filters: Object.freeze({
      unitIds: Object.freeze([...configuration.filters.unitIds]),
      minimumCount: configuration.filters.minimumCount,
    }),
  })
}

test('test-only nested configuration strategy snapshots and protects its schema explicitly', () => {
  class NestedConfigurationWin {
    outcome = 'VICTORY'

    constructor(configuration) {
      this.configuration = snapshotNestedTestConfiguration(configuration)
      Object.freeze(this)
    }

    evaluate(context) {
      const { target, filters } = this.configuration
      const matchingUnits = context.initialUnits.filter((unit) =>
        unit.faction === target.faction && filters.unitIds.includes(unit.id),
      )
      return matchingUnits.length >= filters.minimumCount
    }
  }

  const configuration = {
    target: { faction: 'enemy' },
    filters: { unitIds: ['goblin'], minimumCount: 1 },
  }
  const strategy = new NestedConfigurationWin(configuration)
  const manager = new WinCondition([strategy])
  const context = createBattleConditionContext(createBattleState([knight, goblin]), [knight, goblin])

  configuration.target.faction = 'player'
  configuration.filters.unitIds[0] = 'knight'
  configuration.filters.minimumCount = 2

  assert.equal(manager.evaluate(context), true)
  assert.equal(Object.isFrozen(strategy.configuration), true)
  assert.equal(Object.isFrozen(strategy.configuration.target), true)
  assert.equal(Object.isFrozen(strategy.configuration.filters), true)
  assert.equal(Object.isFrozen(strategy.configuration.filters.unitIds), true)
  assert.throws(() => { strategy.configuration.target.faction = 'player' }, TypeError)
  assert.throws(() => strategy.configuration.filters.unitIds.push('knight'), TypeError)
})

test('session initialization is ACTIVE and only valid outcome triggers evaluate initial conditions', () => {
  let winEvaluations = 0
  let lossEvaluations = 0
  const session = createBattleSession({
    units: [knight, goblin],
    winCondition: new WinCondition([
      new ConstantCondition('VICTORY', true, () => { winEvaluations += 1 }),
    ]),
    lossCondition: new LossCondition([
      new ConstantCondition('DEFEAT', false, () => { lossEvaluations += 1 }),
    ]),
  })
  const initial = session.initialState

  assert.equal(initial.outcome, null)
  assert.equal(winEvaluations, 0)
  assert.equal(lossEvaluations, 0)

  const invalidPlayerAction = session.reducer(initial, {
    ...withTurnContext(initial, { type: 'set-mode', mode: 'MOVE' }),
    turnId: initial.turn.turnId + 1,
  })
  const invalidCommand = session.reducer(
    initial,
    withTurnContext(initial, { type: 'confirm-attack' }),
  )
  const unauthorizedAIAction = session.reducer(initial, {
    type: 'ai-standby',
    turnId: initial.turn.turnId,
    unitId: initial.turn.activeUnitId,
  })
  const staleCallback = session.reducer(initial, {
    type: 'finish',
    unitId: knight.id,
    motionId: -1,
  })

  assert.equal(invalidPlayerAction, initial)
  assert.equal(invalidCommand, initial)
  assert.equal(unauthorizedAIAction, initial)
  assert.equal(staleCallback, initial)
  assert.equal(winEvaluations, 0)
  assert.equal(lossEvaluations, 0)

  const resolved = session.reducer(
    initial,
    withTurnContext(initial, { type: 'standby' }),
  )
  assert.equal(resolved.outcome, 'VICTORY')
  assert.equal(winEvaluations, 1)
  assert.equal(lossEvaluations, 1)
})

test('faction elimination requires an initial roster and formal defeated records', () => {
  const initialState = createBattleState([knight, goblin])
  const initialContext = createBattleConditionContext(initialState, [knight, goblin])
  assert.equal(initialContext.isFactionEliminated('enemy'), false)

  const missingEnemyState = {
    ...initialState,
    units: initialState.units.filter((unit) => unit.id !== goblin.id),
  }
  const missingEnemyContext = createBattleConditionContext(missingEnemyState, [knight, goblin])
  assert.equal(missingEnemyContext.isFactionEliminated('enemy'), false)
  assert.equal(missingEnemyContext.getUnitLifeState(goblin.id), null)

  const dyingEnemyState = {
    ...initialState,
    units: initialState.units.map((unit) => unit.id === goblin.id ? { ...unit, hp: 0 } : unit),
    deathMotions: [{
      deathId: 1,
      unitId: goblin.id,
      killerId: knight.id,
      attackId: 1,
      position: goblin.position,
      sourcePosition: knight.position,
    }],
  }
  const dyingContext = createBattleConditionContext(dyingEnemyState, [knight, goblin])
  assert.equal(dyingContext.getUnitLifeState(goblin.id), 'DYING')
  assert.equal(dyingContext.isFactionEliminated('enemy'), false)

  const defeatedEnemyState = {
    ...initialState,
    units: initialState.units.filter((unit) => unit.id !== goblin.id),
    defeatedUnits: [{
      deathId: 1,
      unit: { ...goblin, hp: 0 },
      killerId: knight.id,
      attackId: 1,
    }],
  }
  const defeatedContext = createBattleConditionContext(defeatedEnemyState, [knight, goblin])
  assert.equal(defeatedContext.getUnitLifeState(goblin.id), 'DEAD')
  assert.equal(defeatedContext.isFactionEliminated('enemy'), true)
})

test('empty factions and initially incapacitated units do not satisfy AllDead', () => {
  const noEnemy = createBattleState([knight])
  const noEnemyContext = createBattleConditionContext(noEnemy, [knight])
  assert.equal(noEnemyContext.isFactionEliminated('enemy'), false)
  assert.equal(new WinCondition([new WinAllDead()]).evaluate(noEnemyContext), false)

  const noPlayer = createBattleState([goblin])
  const noPlayerContext = createBattleConditionContext(noPlayer, [goblin])
  assert.equal(noPlayerContext.isFactionEliminated('player'), false)
  assert.equal(new LossCondition([new LossAllDead()]).evaluate(noPlayerContext), false)

  const incapacitated = { ...goblin, hp: 0 }
  const incapacitatedState = createBattleState([knight, incapacitated])
  const incapacitatedContext = createBattleConditionContext(incapacitatedState, [knight, incapacitated])
  assert.equal(incapacitatedContext.isFactionEliminated('enemy'), false)
  assert.equal(new WinCondition([new WinAllDead()]).evaluate(incapacitatedContext), false)
})

test('condition context exposes frozen snapshots instead of mutable battle state', () => {
  const state = createBattleState([knight, goblin])
  const context = createBattleConditionContext(state, [knight, goblin])
  assert.equal(Object.isFrozen(context), true)
  assert.equal(Object.isFrozen(context.initialUnits), true)
  assert.equal(Object.isFrozen(context.initialUnits[0]), true)
  assert.equal(Object.isFrozen(context.initialUnits[0].position), true)
  assert.throws(() => { context.initialUnits[0].position.column = 99 }, TypeError)
  assert.equal(state.units[0].position.column, knight.position.column)
})

test('production session starts ACTIVE and resolves victory only after all death barriers finish', () => {
  const fragileGoblin = { ...goblin, hp: 5 }
  const session = createAllDeadSession([knight, fragileGoblin])
  const initialTurnId = session.initialState.turn.turnId
  assert.equal(session.initialState.outcome, null)

  let state = beginLethalPlayerAttack(session)
  assert.equal(state.outcome, null)
  assert.equal(state.deathMotions.length, 1)

  state = session.reducer(state, { type: 'attack-complete', attackId: state.attackMotion.attackId })
  assert.equal(state.outcome, null)
  assert.equal(state.pendingTurnCompletion?.unitId, knight.id)
  assert.equal(state.turn.turnId, initialTurnId)

  state = session.reducer(state, {
    type: 'death-complete',
    deathId: state.deathMotions[0].deathId,
    unitId: fragileGoblin.id,
  })
  assert.equal(state.outcome, 'VICTORY')
  assert.equal(state.pendingTurnCompletion, null)
  assert.equal(state.deathMotions.length, 0)
  assert.equal(state.attackMotion, null)
  assert.equal(state.defeatedUnits.length, 1)
  assert.equal(state.turn.turnId, initialTurnId)
  assert.equal(state.selectedUnitId, null)
  assert.equal(state.turnAction, null)
})

test('Death Abort completes the death barrier and can resolve victory', () => {
  const fragileGoblin = { ...goblin, hp: 5 }
  const session = createAllDeadSession([knight, fragileGoblin])
  let state = beginLethalPlayerAttack(session)
  state = session.reducer(state, { type: 'attack-complete', attackId: state.attackMotion.attackId })
  state = session.reducer(state, {
    type: 'death-abort',
    deathId: state.deathMotions[0].deathId,
    unitId: fragileGoblin.id,
  })

  assert.equal(state.outcome, 'VICTORY')
  assert.equal(state.defeatedUnits.length, 1)
  assert.equal(state.pendingTurnCompletion, null)
})

test('multiple death motions must all finish before terminal resolution', () => {
  const secondGoblin = makeUnit('goblin-b', 'goblin', 'enemy', 5, 3)
  const session = createAllDeadSession([knight, goblin, secondGoblin])
  const stateBeforeDeath = session.initialState
  const stateWithDeaths = {
    ...stateBeforeDeath,
    units: stateBeforeDeath.units.map((unit) =>
      unit.faction === 'enemy' ? { ...unit, hp: 0 } : unit,
    ),
    deathMotions: [goblin, secondGoblin].map((unit, index) => ({
      deathId: index + 1,
      unitId: unit.id,
      killerId: knight.id,
      attackId: index + 1,
      position: unit.position,
      sourcePosition: knight.position,
    })),
    nextDeathId: 3,
  }

  const firstCompleted = session.reducer(stateWithDeaths, {
    type: 'death-complete',
    deathId: 1,
    unitId: goblin.id,
  })
  assert.equal(firstCompleted.outcome, null)
  assert.equal(firstCompleted.deathMotions.length, 1)
  assert.equal(firstCompleted.defeatedUnits.length, 1)

  const fullyCompleted = session.reducer(firstCompleted, {
    type: 'death-complete',
    deathId: 2,
    unitId: secondGoblin.id,
  })
  assert.equal(fullyCompleted.outcome, 'VICTORY')
  assert.equal(fullyCompleted.deathMotions.length, 0)
  assert.equal(fullyCompleted.defeatedUnits.length, 2)
})

test('defeat resolves after the final player death without advancing PAS', () => {
  const fragileKnight = { ...knight, hp: 5 }
  const fastGoblin = { ...goblin, agi: 20 }
  const session = createAllDeadSession([fragileKnight, fastGoblin])
  let state = session.initialState
  const turnId = state.turn.turnId
  assert.equal(state.turn.activeUnitId, fastGoblin.id)

  let aiAction
  dispatchAIControllerAction(state, (action) => { aiAction = action })
  assert.ok(aiAction)
  state = session.reducer(state, aiAction)
  state = session.reducer(state, { type: 'attack-impact', attackId: state.attackMotion.attackId })
  assert.equal(state.outcome, null)
  state = session.reducer(state, { type: 'attack-complete', attackId: state.attackMotion.attackId })
  assert.equal(state.outcome, null)
  assert.equal(state.pendingTurnCompletion?.unitId, fastGoblin.id)
  assert.equal(state.turn.turnId, turnId)

  state = session.reducer(state, {
    type: 'death-complete',
    deathId: state.deathMotions[0].deathId,
    unitId: fragileKnight.id,
  })
  assert.equal(state.outcome, 'DEFEAT')
  assert.equal(state.pendingTurnCompletion, null)
  assert.equal(state.turn.turnId, turnId)
  assert.equal(state.aiProgress, null)
})

test('simultaneous victory and defeat evaluate the same snapshot with defeat priority', () => {
  const evaluatedContexts = []
  const session = createBattleSession({
    units: [knight, goblin],
    winCondition: new WinCondition([
      new ConstantCondition('VICTORY', true, (context) => evaluatedContexts.push(context)),
    ]),
    lossCondition: new LossCondition([
      new ConstantCondition('DEFEAT', true, (context) => evaluatedContexts.push(context)),
    ]),
  })
  const state = session.reducer(
    session.initialState,
    withTurnContext(session.initialState, { type: 'standby' }),
  )

  assert.equal(state.outcome, 'DEFEAT')
  assert.equal(evaluatedContexts.length, 2)
  assert.equal(evaluatedContexts[0], evaluatedContexts[1])
  assert.equal(resolveBattleOutcome(
    evaluatedContexts[0],
    new WinCondition([new ConstantCondition('VICTORY', true)]),
    new LossCondition([new ConstantCondition('DEFEAT', true)]),
  ), 'DEFEAT')
})

test('terminal outcome blocks player actions, AI intents, and all late lifecycle callbacks', () => {
  const distantKnight = makeUnit('knight', 'knight', 'player', 0, 0)
  const fastGoblin = makeUnit('goblin', 'goblin', 'enemy', 7, 7, {
    agi: 20,
    movementPoints: 0,
  })
  const session = createBattleSession({
    units: [distantKnight, fastGoblin],
    winCondition: new WinCondition([new ConstantCondition('VICTORY', true)]),
    lossCondition: new LossCondition([new ConstantCondition('DEFEAT', false)]),
  })
  const initial = session.initialState
  let aiAction
  const intent = dispatchAIControllerAction(initial, (action) => { aiAction = action })
  assert.equal(intent?.type, 'STANDBY')
  assert.ok(aiAction)
  assert.equal(aiAction.type, 'ai-standby')

  const terminal = session.reducer(initial, aiAction)
  assert.equal(terminal.outcome, 'VICTORY')
  assert.equal(session.reducer(terminal, aiAction), terminal)
  assert.equal(getAIControllerIntent(terminal), null)

  const lateActions = [
    withTurnContext(terminal, { type: 'select', targetId: distantKnight.id }),
    withTurnContext(terminal, { type: 'cell', cell: { column: 2, row: 3 } }),
    withTurnContext(terminal, { type: 'clear' }),
    withTurnContext(terminal, { type: 'set-mode', mode: 'MOVE' }),
    withTurnContext(terminal, { type: 'standby' }),
    withTurnContext(terminal, { type: 'undo' }),
    withTurnContext(terminal, { type: 'confirm-attack' }),
    { type: 'finish', unitId: fastGoblin.id, motionId: 1 },
    { type: 'cancel', unitId: fastGoblin.id, motionId: 1 },
    { type: 'attack-impact', attackId: 1 },
    { type: 'attack-complete', attackId: 1 },
    { type: 'attack-abort', attackId: 1 },
    { type: 'death-complete', deathId: 1, unitId: knight.id },
    { type: 'death-abort', deathId: 1, unitId: knight.id },
    { type: 'consume-impact', impactId: 1 },
  ]

  for (const action of lateActions) {
    assert.equal(session.reducer(terminal, action), terminal, action.type)
  }
  assert.equal(terminal.outcome, 'VICTORY')
})

test('VICTORY and DEFEAT both reject late events without changing their terminal result', () => {
  for (const [winResult, lossResult, expectedOutcome] of [
    [true, false, 'VICTORY'],
    [false, true, 'DEFEAT'],
  ]) {
    const session = createBattleSession({
      units: [knight, goblin],
      winCondition: new WinCondition([
        new ConstantCondition('VICTORY', winResult),
      ]),
      lossCondition: new LossCondition([
        new ConstantCondition('DEFEAT', lossResult),
      ]),
    })
    const initial = session.initialState
    const terminal = session.reducer(
      initial,
      withTurnContext(initial, { type: 'standby' }),
    )
    const lateEvents = [
      { type: 'attack-impact', attackId: 1 },
      { type: 'attack-complete', attackId: 1 },
      { type: 'attack-abort', attackId: 1 },
      { type: 'death-complete', deathId: 1, unitId: goblin.id },
      { type: 'death-abort', deathId: 1, unitId: goblin.id },
      { type: 'finish', unitId: knight.id, motionId: 1 },
    ]

    assert.equal(terminal.outcome, expectedOutcome)
    for (const event of lateEvents) {
      assert.equal(session.reducer(terminal, event), terminal, `${expectedOutcome} ${event.type}`)
    }
    assert.equal(terminal.outcome, expectedOutcome)
  }
})

test('outcome is checked before turn completion schedules the next PAS unit', () => {
  const session = createBattleSession({
    units: [knight, goblin],
    winCondition: new WinCondition([new ConstantCondition('VICTORY', true)]),
    lossCondition: new LossCondition([new ConstantCondition('DEFEAT', false)]),
  })
  const initialTurnId = session.initialState.turn.turnId
  const state = session.reducer(
    session.initialState,
    withTurnContext(session.initialState, { type: 'standby' }),
  )

  assert.equal(state.outcome, 'VICTORY')
  assert.equal(state.turn.turnId, initialTurnId)
  assert.equal(state.pendingTurnCompletion, null)
})

test('outcome stays active during movement and resolves after the motion finishes', () => {
  const session = createBattleSession({
    units: [knight, goblin],
    winCondition: new WinCondition([new ConstantCondition('VICTORY', true)]),
    lossCondition: new LossCondition([new ConstantCondition('DEFEAT', false)]),
  })
  let state = { ...session.initialState, interactionMode: 'MOVE' }
  state = session.reducer(state, withTurnContext(state, {
    type: 'cell',
    cell: { column: 2, row: 3 },
  }))

  assert.ok(state.motion)
  assert.equal(state.outcome, null)

  state = session.reducer(state, {
    type: 'finish',
    unitId: knight.id,
    motionId: state.motion.motionId,
  })
  assert.equal(state.motion, null)
  assert.equal(state.outcome, 'VICTORY')
})

test('a lone Attack Motion and Combat Reservation block outcome until valid completion', () => {
  let evaluations = 0
  const session = createBattleSession({
    units: [knight, goblin],
    winCondition: new WinCondition([
      new ConstantCondition('VICTORY', true, () => { evaluations += 1 }),
    ]),
    lossCondition: new LossCondition([new ConstantCondition('DEFEAT', false)]),
  })
  let state = session.initialState
  const initialTurnId = state.turn.turnId

  state = session.reducer(state, withTurnContext(state, { type: 'set-mode', mode: 'ATTACK' }))
  state = session.reducer(state, withTurnContext(state, {
    type: 'select-attack-target',
    targetId: goblin.id,
  }))
  state = session.reducer(state, withTurnContext(state, { type: 'confirm-attack' }))

  assert.ok(state.attackMotion)
  assert.equal(state.turnAction.combatAction, 'RESERVED')
  assert.equal(state.outcome, null)
  assert.equal(evaluations, 0)

  state = session.reducer(state, { type: 'attack-impact', attackId: state.attackMotion.attackId })
  assert.ok(state.attackMotion)
  assert.equal(state.deathMotions.length, 0)
  assert.equal(state.outcome, null)
  assert.equal(evaluations, 0)

  state = session.reducer(state, { type: 'attack-complete', attackId: state.attackMotion.attackId })
  assert.equal(state.outcome, 'VICTORY')
  assert.equal(state.attackMotion, null)
  assert.equal(state.turn.turnId, initialTurnId)
  assert.equal(evaluations, 1)
})

test('configured AllDead session supports movement, attack, standby, and PAS advancement while active', () => {
  const fastKnight = { ...knight, agi: 20 }
  const slowGoblin = { ...goblin, agi: 5 }
  const session = createAllDeadSession([fastKnight, slowGoblin])
  let state = session.initialState
  const firstTurnId = state.turn.turnId
  assert.equal(state.turn.activeUnitId, fastKnight.id)
  assert.equal(state.outcome, null)

  state = session.reducer(state, withTurnContext(state, { type: 'set-mode', mode: 'MOVE' }))
  state = session.reducer(state, withTurnContext(state, {
    type: 'cell',
    cell: { column: 4, row: 2 },
  }))
  assert.ok(state.motion)
  state = session.reducer(state, {
    type: 'finish',
    unitId: fastKnight.id,
    motionId: state.motion.motionId,
  })
  assert.equal(state.outcome, null)
  assert.equal(state.units.find((unit) => unit.id === fastKnight.id).position.column, 4)

  state = session.reducer(state, withTurnContext(state, { type: 'set-mode', mode: 'ATTACK' }))
  state = session.reducer(state, withTurnContext(state, {
    type: 'select-attack-target',
    targetId: slowGoblin.id,
  }))
  state = session.reducer(state, withTurnContext(state, { type: 'confirm-attack' }))
  state = session.reducer(state, { type: 'attack-impact', attackId: state.attackMotion.attackId })
  assert.ok(state.attackMotion)
  assert.equal(state.deathMotions.length, 0)
  state = session.reducer(state, { type: 'attack-complete', attackId: state.attackMotion.attackId })

  assert.equal(state.outcome, null)
  assert.ok(state.turn.turnId > firstTurnId)

  const activeTurnId = state.turn.turnId
  state = session.reducer(state, withTurnContext(state, { type: 'standby' }))
  assert.equal(state.outcome, null)
  assert.ok(state.turn.turnId > activeTurnId)
})

test('condition strategy category prevents configuring loss rules as victory rules', () => {
  assert.throws(
    () => new WinCondition([new ConstantCondition('DEFEAT', true)]),
    /required end condition contract/,
  )
  assert.throws(
    () => new LossCondition([new ConstantCondition('VICTORY', true)]),
    /required end condition contract/,
  )
})

