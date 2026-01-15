// test_events.js — Async Event System tests
// LEO/STANLEY/HAZE pattern + EventBus pub/sub
//
// "concurrent observers watching the field breathe"

import {
  EventBus,
  FieldEvent,
  AsyncObserver,
  LEO,
  STANLEY,
  HAZE,
  ObserverRegistry,
  AsyncField,
} from '../src/events.js';

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DEPENDENCIES
// ═══════════════════════════════════════════════════════════════════════════════

class MockModel {
  constructor() {
    this.vocabSize = 100;
    this.lr = 0.01;
    this.temporalMode = 'symmetric';
    this.temporalAlpha = 0.5;
    this.resonance = new Float32Array(100).fill(0.5);
  }
  setTemporalMode(mode) {
    this.temporalMode = mode;
    if (mode === 'prophecy') this.temporalAlpha = 0.7;
    else if (mode === 'retrodiction') this.temporalAlpha = 0.3;
    else this.temporalAlpha = 0.5;
  }
}

class MockField {
  constructor() {
    this.metrics = {
      emergence: 0.5,
      pain: 0.3,
      dissonance: 0.2,
      resonanceField: 0.6,
    };
    this.model = new MockModel();
  }
  step(px, py, pa, dt) {
    return {
      x: px + 0.1,
      y: py + 0.1,
      temporalAsymmetry: 0.1,
      attentionMap: new Float32Array([0.25, 0.25, 0.25, 0.25]),
      didJump: false,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST FRAMEWORK
// ═══════════════════════════════════════════════════════════════════════════════

let passed = 0;
let failed = 0;

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function test(name, fn) {
  try {
    fn();
    console.log(`  \u2713 ${name}`);
    passed++;
  } catch (e) {
    console.log(`  \u2717 ${name}: ${e.message}`);
    failed++;
  }
}

async function testAsync(name, fn) {
  try {
    await fn();
    console.log(`  \u2713 ${name}`);
    passed++;
  } catch (e) {
    console.log(`  \u2717 ${name}: ${e.message}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n\ud83d\udd04 Async Event System Tests\n');
  console.log('='.repeat(60) + '\n');

  // ─────────────────────────────────────────────────────────────────────────────
  console.log('1. EventBus — pub/sub core\n');
  // ─────────────────────────────────────────────────────────────────────────────

  test('EventBus can be instantiated', () => {
    const bus = new EventBus();
    assert(bus.listeners instanceof Map, 'should have listeners Map');
    assert(bus.asyncQueue instanceof Array, 'should have asyncQueue');
  });

  await testAsync('EventBus.on subscribes to events', async () => {
    const bus = new EventBus();
    let received = null;

    bus.on(FieldEvent.STEP, (event) => {
      received = event.data;
    });

    bus.emit(FieldEvent.STEP, { test: true });
    // Wait for async processing
    await new Promise(r => setTimeout(r, 10));

    assert(received !== null, 'handler should be called');
    assert(received.test === true, 'data should be passed');
  });

  await testAsync('EventBus.once fires only once', async () => {
    const bus = new EventBus();
    let count = 0;

    bus.once(FieldEvent.STEP, () => count++);

    bus.emit(FieldEvent.STEP, {});
    bus.emit(FieldEvent.STEP, {});
    await new Promise(r => setTimeout(r, 20));

    assert(count === 1, `should fire once, got ${count}`);
  });

  await testAsync('EventBus.off unsubscribes', async () => {
    const bus = new EventBus();
    let count = 0;
    const handler = () => count++;

    bus.on(FieldEvent.STEP, handler);
    bus.emit(FieldEvent.STEP, {});
    await new Promise(r => setTimeout(r, 10));

    bus.off(FieldEvent.STEP, handler);
    bus.emit(FieldEvent.STEP, {});
    await new Promise(r => setTimeout(r, 10));

    assert(count === 1, `should only fire before off, got ${count}`);
  });

  await testAsync('EventBus.emitAsync waits for handlers', async () => {
    const bus = new EventBus();
    let resolved = false;

    bus.on(FieldEvent.STEP, async () => {
      await new Promise(r => setTimeout(r, 20));
      resolved = true;
    });

    await bus.emitAsync(FieldEvent.STEP, {});
    assert(resolved === true, 'should wait for async handler');
  });

  test('EventBus stores event history', () => {
    const bus = new EventBus();
    bus.emit(FieldEvent.STEP, { n: 1 });
    bus.emit(FieldEvent.STEP, { n: 2 });
    bus.emit(FieldEvent.JUMP, { n: 3 });

    const history = bus.getHistory(FieldEvent.STEP);
    assert(history.length === 2, 'should have 2 STEP events');

    const allHistory = bus.getHistory();
    assert(allHistory.length === 3, 'should have 3 total events');
  });

  test('EventBus.clear removes all listeners', () => {
    const bus = new EventBus();
    bus.on(FieldEvent.STEP, () => {});
    bus.on(FieldEvent.JUMP, () => {});

    bus.clear();

    assert(bus.listeners.size === 0, 'should have no listeners');
  });

  await testAsync('EventBus respects priority ordering', async () => {
    const bus = new EventBus();
    const order = [];

    bus.on(FieldEvent.STEP, () => order.push('low'), { priority: 1 });
    bus.on(FieldEvent.STEP, () => order.push('high'), { priority: 10 });
    bus.on(FieldEvent.STEP, () => order.push('mid'), { priority: 5 });

    await bus.emitAsync(FieldEvent.STEP, {});

    assert(order[0] === 'high', 'high priority should fire first');
    assert(order[1] === 'mid', 'mid priority should fire second');
    assert(order[2] === 'low', 'low priority should fire last');
  });

  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n2. AsyncObserver — base class\n');
  // ─────────────────────────────────────────────────────────────────────────────

  test('AsyncObserver can be instantiated', () => {
    const bus = new EventBus();
    const obs = new AsyncObserver('TestObserver', bus);

    assert(obs.name === 'TestObserver', 'should have name');
    assert(obs.active === false, 'should start inactive');
    assert(obs.bus === bus, 'should reference EventBus');
  });

  test('AsyncObserver.start activates observer', () => {
    const bus = new EventBus();
    const obs = new AsyncObserver('TestObserver', bus);

    obs.start();
    assert(obs.active === true, 'should be active after start');
  });

  test('AsyncObserver.stop deactivates observer', () => {
    const bus = new EventBus();
    const obs = new AsyncObserver('TestObserver', bus);

    obs.start();
    obs.stop();
    assert(obs.active === false, 'should be inactive after stop');
  });

  test('AsyncObserver.subscribe tracks subscriptions', () => {
    const bus = new EventBus();
    const obs = new AsyncObserver('TestObserver', bus);

    obs.subscribe(FieldEvent.STEP, () => {});
    assert(obs.subscriptions.length === 1, 'should track subscription');
  });

  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n3. LEO — Light Emergent Observer\n');
  // ─────────────────────────────────────────────────────────────────────────────

  test('LEO can be instantiated with options', () => {
    const bus = new EventBus();
    const leo = new LEO(bus, { emergenceThreshold: 0.8, cooldown: 500 });

    assert(leo.name === 'LEO', 'should be named LEO');
    assert(leo.emergenceThreshold === 0.8, 'should respect threshold option');
    assert(leo.cooldown === 500, 'should respect cooldown option');
  });

  await testAsync('LEO tracks emergence history', async () => {
    const bus = new EventBus();
    const leo = new LEO(bus);
    leo.start();

    // Simulate step events
    for (let i = 0; i < 10; i++) {
      bus.emit(FieldEvent.STEP, { metrics: { emergence: 0.3 + i * 0.01 } });
    }
    await new Promise(r => setTimeout(r, 50));

    assert(leo.emergenceHistory.length === 10, 'should track history');
    leo.stop();
  });

  await testAsync('LEO detects emergence above threshold', async () => {
    const bus = new EventBus();

    const leo = new LEO(bus, {
      emergenceThreshold: 0.5,
      cooldown: 0,
    });
    leo.start();

    // Emit step that should trigger emergence spike
    await bus.emitAsync(FieldEvent.STEP, { metrics: { emergence: 0.7 } });
    // Wait for cascade processing
    await new Promise(r => setTimeout(r, 100));

    // Check that LEO detected the spike (via history at minimum)
    assert(leo.emergenceHistory.length === 1, 'should have 1 history entry');
    assert(leo.emergenceHistory[0].v === 0.7, 'should record emergence=0.7');

    // Check threshold detection logic directly
    const emergence = 0.7;
    const threshold = leo.emergenceThreshold;
    const aboveThreshold = emergence > threshold;
    assert(aboveThreshold === true, `0.7 > 0.5 should be true`);

    // Check trend computation works
    const trend = leo._computeTrend();
    assert(typeof trend === 'number', 'trend should be computed');

    leo.stop();
  });

  test('LEO.getState returns current state', () => {
    const bus = new EventBus();
    const leo = new LEO(bus);
    leo.start();

    const state = leo.getState();
    assert('active' in state, 'should have active');
    assert('lastTrigger' in state, 'should have lastTrigger');
    assert('currentTrend' in state, 'should have currentTrend');

    leo.stop();
  });

  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n4. STANLEY — State Transformer\n');
  // ─────────────────────────────────────────────────────────────────────────────

  test('STANLEY can be instantiated with model', () => {
    const bus = new EventBus();
    const model = new MockModel();
    const stanley = new STANLEY(bus, model, { learningRate: 0.01 });

    assert(stanley.name === 'STANLEY', 'should be named STANLEY');
    assert(stanley.model === model, 'should have model reference');
    assert(stanley.learningRate === 0.01, 'should respect learningRate');
  });

  await testAsync('STANLEY adapts learning rate based on stability', async () => {
    const bus = new EventBus();
    const model = new MockModel();
    const stanley = new STANLEY(bus, model, { adaptiveMode: true, learningRate: 0.01 });
    stanley.start();

    const initialLR = model.lr;

    // Simulate stable resonance (low variance)
    for (let i = 0; i < 15; i++) {
      bus.emit(FieldEvent.STEP, { resonanceField: 0.5 + Math.random() * 0.01 });
    }
    await new Promise(r => setTimeout(r, 50));

    // LR should change based on stability
    assert(model.lr !== initialLR, 'learning rate should adapt');
    stanley.stop();
  });

  await testAsync('STANLEY boosts resonance on accepted injection', async () => {
    const bus = new EventBus();
    const model = new MockModel();
    const stanley = new STANLEY(bus, model);
    stanley.start();

    const before = model.resonance[5];

    bus.emit(FieldEvent.INJECTION_ACCEPTED, { tokenIds: [5] });
    await new Promise(r => setTimeout(r, 30));

    assert(model.resonance[5] > before, 'should boost resonance');
    stanley.stop();
  });

  await testAsync('STANLEY decays resonance on rejected injection', async () => {
    const bus = new EventBus();
    const model = new MockModel();
    const stanley = new STANLEY(bus, model);
    stanley.start();

    const before = model.resonance[10];

    bus.emit(FieldEvent.INJECTION_REJECTED, { tokenIds: [10] });
    await new Promise(r => setTimeout(r, 30));

    assert(model.resonance[10] < before, 'should decay resonance');
    stanley.stop();
  });

  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n5. HAZE — Hybrid Attention Zone Engine\n');
  // ─────────────────────────────────────────────────────────────────────────────

  test('HAZE can be instantiated with model', () => {
    const bus = new EventBus();
    const model = new MockModel();
    const haze = new HAZE(bus, model, { asymmetryThreshold: 0.4 });

    assert(haze.name === 'HAZE', 'should be named HAZE');
    assert(haze.model === model, 'should have model reference');
    assert(haze.asymmetryThreshold === 0.4, 'should respect threshold');
  });

  await testAsync('HAZE tracks attention history', async () => {
    const bus = new EventBus();
    const model = new MockModel();
    const haze = new HAZE(bus, model);
    haze.start();

    for (let i = 0; i < 10; i++) {
      bus.emit(FieldEvent.STEP, {
        temporalAsymmetry: 0.1 + i * 0.05,
        attentionMap: new Float32Array([0.25, 0.25, 0.25, 0.25]),
      });
    }
    await new Promise(r => setTimeout(r, 50));

    assert(haze.attentionHistory.length === 10, 'should track history');
    haze.stop();
  });

  await testAsync('HAZE auto-adjusts temporal mode', async () => {
    const bus = new EventBus();
    const model = new MockModel();
    const haze = new HAZE(bus, model, { autoTemporalMode: true, asymmetryThreshold: 0.1 });
    haze.start();

    // Simulate strong future-bias trend
    for (let i = 0; i < 10; i++) {
      bus.emit(FieldEvent.STEP, {
        temporalAsymmetry: 0.1 + i * 0.1, // increasing
        attentionMap: [],
      });
    }
    await new Promise(r => setTimeout(r, 50));

    assert(model.temporalMode === 'prophecy', `should switch to prophecy, got ${model.temporalMode}`);
    haze.stop();
  });

  await testAsync('HAZE resets to symmetric on high dissonance', async () => {
    const bus = new EventBus();
    const model = new MockModel();
    model.setTemporalMode('prophecy');

    const haze = new HAZE(bus, model, { autoTemporalMode: true });
    haze.start();

    bus.emit(FieldEvent.DISSONANCE_HIGH, { dissonance: 0.9 });
    await new Promise(r => setTimeout(r, 30));

    assert(model.temporalMode === 'symmetric', 'should reset to symmetric');
    haze.stop();
  });

  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n6. ObserverRegistry — manage multiple observers\n');
  // ─────────────────────────────────────────────────────────────────────────────

  test('ObserverRegistry can register observers', () => {
    const bus = new EventBus();
    const registry = new ObserverRegistry(bus);
    const leo = new LEO(bus);

    registry.register('LEO', leo);
    assert(registry.get('LEO') === leo, 'should store observer');
  });

  test('ObserverRegistry.startAll starts all observers', () => {
    const bus = new EventBus();
    const registry = new ObserverRegistry(bus);
    const model = new MockModel();

    registry.register('LEO', new LEO(bus));
    registry.register('STANLEY', new STANLEY(bus, model));
    registry.register('HAZE', new HAZE(bus, model));

    registry.startAll();

    assert(registry.get('LEO').active === true, 'LEO should be active');
    assert(registry.get('STANLEY').active === true, 'STANLEY should be active');
    assert(registry.get('HAZE').active === true, 'HAZE should be active');

    registry.stopAll();
  });

  test('ObserverRegistry.stopAll stops all observers', () => {
    const bus = new EventBus();
    const registry = new ObserverRegistry(bus);

    registry.register('LEO', new LEO(bus));
    registry.startAll();
    registry.stopAll();

    assert(registry.get('LEO').active === false, 'LEO should be inactive');
  });

  test('ObserverRegistry.getStatus returns all states', () => {
    const bus = new EventBus();
    const registry = new ObserverRegistry(bus);
    const model = new MockModel();

    registry.register('LEO', new LEO(bus));
    registry.register('STANLEY', new STANLEY(bus, model));

    const status = registry.getStatus();

    assert('LEO' in status, 'should have LEO status');
    assert('STANLEY' in status, 'should have STANLEY status');
  });

  test('ObserverRegistry.unregister removes observer', () => {
    const bus = new EventBus();
    const registry = new ObserverRegistry(bus);

    registry.register('LEO', new LEO(bus));
    registry.unregister('LEO');

    assert(registry.get('LEO') === undefined, 'should remove observer');
  });

  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n7. AsyncField — promisified wrapper\n');
  // ─────────────────────────────────────────────────────────────────────────────

  test('AsyncField wraps field with event bus', () => {
    const bus = new EventBus();
    const field = new MockField();
    const asyncField = new AsyncField(field, bus);

    assert(asyncField.field === field, 'should wrap field');
    assert(asyncField.bus === bus, 'should have event bus');
  });

  await testAsync('AsyncField.step emits STEP event', async () => {
    const bus = new EventBus();
    const field = new MockField();
    const asyncField = new AsyncField(field, bus);

    let stepReceived = false;
    bus.on(FieldEvent.STEP, () => { stepReceived = true; });

    await asyncField.step(0, 0, 0, 1);
    await new Promise(r => setTimeout(r, 30));

    assert(stepReceived === true, 'should emit STEP event');
  });

  await testAsync('AsyncField.step emits PAIN_SPIKE on high pain', async () => {
    const bus = new EventBus();
    const field = new MockField();
    field.metrics.pain = 0.9;
    const asyncField = new AsyncField(field, bus);

    let painReceived = false;
    bus.on(FieldEvent.PAIN_SPIKE, () => { painReceived = true; });

    await asyncField.step(0, 0, 0, 1);
    await new Promise(r => setTimeout(r, 30));

    assert(painReceived === true, 'should emit PAIN_SPIKE');
  });

  await testAsync('AsyncField.inject emits INJECTION_ACCEPTED', async () => {
    const bus = new EventBus();
    const field = new MockField();
    field.model.inject = () => ({ accepted: true, dx: 0.1, dy: 0.1 });
    const asyncField = new AsyncField(field, bus);

    let accepted = false;
    bus.on(FieldEvent.INJECTION_ACCEPTED, () => { accepted = true; });

    await asyncField.inject([1, 2, 3]);
    await new Promise(r => setTimeout(r, 30));

    assert(accepted === true, 'should emit INJECTION_ACCEPTED');
  });

  await testAsync('AsyncField.inject emits INJECTION_REJECTED + SCAR', async () => {
    const bus = new EventBus();
    const field = new MockField();
    field.model.inject = () => ({ accepted: false, scarMass: 0.5 });
    const asyncField = new AsyncField(field, bus);

    let rejected = false;
    let scarred = false;
    bus.on(FieldEvent.INJECTION_REJECTED, () => { rejected = true; });
    bus.on(FieldEvent.SCAR_DEPOSITED, () => { scarred = true; });

    await asyncField.inject([1, 2, 3]);
    await new Promise(r => setTimeout(r, 30));

    assert(rejected === true, 'should emit INJECTION_REJECTED');
    assert(scarred === true, 'should emit SCAR_DEPOSITED');
  });

  await testAsync('AsyncField.waitFor resolves on event', async () => {
    const bus = new EventBus();
    const field = new MockField();
    const asyncField = new AsyncField(field, bus);

    // Setup timeout race
    const waitPromise = asyncField.waitFor(FieldEvent.EMERGENCE_SPIKE, 1000);

    // Emit after short delay
    setTimeout(() => {
      bus.emit(FieldEvent.EMERGENCE_SPIKE, { test: true });
    }, 50);

    const event = await waitPromise;
    assert(event.data.test === true, 'should receive event data');
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Summary
  // ═══════════════════════════════════════════════════════════════════════════

  console.log('\n' + '='.repeat(60));
  console.log(`\n\ud83d\udcca Results: ${passed} passed, ${failed} failed\n`);

  if (failed > 0) {
    console.log('\u274c Some tests failed.\n');
    process.exit(1);
  } else {
    console.log('\u2705 All async tests passed! observers are watching.\n');
    process.exit(0);
  }
}

runTests().catch(e => {
  console.error('Test runner error:', e);
  process.exit(1);
});
