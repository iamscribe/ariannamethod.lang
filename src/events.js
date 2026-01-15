// events.js — Async Event System for LEO/STANLEY/HAZE pattern
// "concurrent observers watching the field breathe"
//
// LEO: Light Emergent Observer — watches for emergence spikes
// STANLEY: State Transformer for Autonomous Neural Learning — watches resonance
// HAZE: Hybrid Attention Zone Engine — watches attention distribution
//
// ═══════════════════════════════════════════════════════════════════════════════
// EVENT-DRIVEN ARCHITECTURE
// The field emits events. Observers listen asynchronously.
// Multiple observers can react concurrently to the same event.
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// EVENT TYPES — typed events for field state changes
// ═══════════════════════════════════════════════════════════════════════════════

export const FieldEvent = {
  // Core field events
  STEP: 'field:step',              // field stepped forward
  JUMP: 'field:jump',              // wormhole activated
  TUNNEL: 'field:tunnel',          // reasoning skip triggered

  // Metrics events
  PAIN_SPIKE: 'metrics:pain_spike',       // pain crossed threshold
  EMERGENCE_SPIKE: 'metrics:emergence',    // emergence detected
  DISSONANCE_HIGH: 'metrics:dissonance',   // dissonance above threshold
  DEBT_ACCUMULATE: 'metrics:debt',         // prophecy debt changed

  // Temporal events
  CALENDAR_CONFLICT: 'temporal:conflict',  // calendar drift spike
  TEMPORAL_MODE_CHANGE: 'temporal:mode',   // prophecy/retrodiction change

  // Cosmic events (PITOMADOM)
  SCHUMANN_CHANGE: 'cosmic:schumann',      // Schumann resonance changed
  COHERENCE_SHIFT: 'cosmic:coherence',     // cosmic coherence changed

  // Injection events
  INJECTION_ACCEPTED: 'inject:accept',     // injection resonated
  INJECTION_REJECTED: 'inject:reject',     // injection became scar
  SCAR_DEPOSITED: 'inject:scar',           // dark matter scar created

  // Learning events (notorch)
  RESONANCE_UPDATE: 'learn:resonance',     // resonance weight changed
  PRESENCE_PULSE: 'learn:presence',        // presence accumulator updated
};

// ═══════════════════════════════════════════════════════════════════════════════
// EVENT BUS — pub/sub for async event distribution
// ═══════════════════════════════════════════════════════════════════════════════

export class EventBus {
  constructor() {
    this.listeners = new Map();
    this.asyncQueue = [];
    this.processing = false;
    this.eventHistory = [];
    this.maxHistory = 100;
  }

  /**
   * Subscribe to an event
   * @param {string} event - event type from FieldEvent
   * @param {Function} handler - async or sync handler function
   * @param {object} options - { once: bool, priority: number }
   * @returns {Function} unsubscribe function
   */
  on(event, handler, options = {}) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }

    const entry = {
      handler,
      once: options.once || false,
      priority: options.priority || 0,
    };

    this.listeners.get(event).push(entry);

    // Sort by priority (higher first)
    this.listeners.get(event).sort((a, b) => b.priority - a.priority);

    // Return unsubscribe function
    return () => this.off(event, handler);
  }

  /**
   * Subscribe to an event once
   */
  once(event, handler, options = {}) {
    return this.on(event, handler, { ...options, once: true });
  }

  /**
   * Unsubscribe from an event
   */
  off(event, handler) {
    if (!this.listeners.has(event)) return;

    const handlers = this.listeners.get(event);
    const idx = handlers.findIndex(e => e.handler === handler);
    if (idx !== -1) handlers.splice(idx, 1);
  }

  /**
   * Emit an event (async, non-blocking)
   * @param {string} event - event type
   * @param {object} data - event payload
   */
  emit(event, data = {}) {
    const eventData = {
      type: event,
      timestamp: performance.now(),
      data,
    };

    // Store in history
    this.eventHistory.push(eventData);
    if (this.eventHistory.length > this.maxHistory) {
      this.eventHistory.shift();
    }

    // Queue for async processing
    this.asyncQueue.push(eventData);
    this._processQueue();
  }

  /**
   * Emit and wait for all handlers to complete
   */
  async emitAsync(event, data = {}) {
    const eventData = {
      type: event,
      timestamp: performance.now(),
      data,
    };

    this.eventHistory.push(eventData);
    if (this.eventHistory.length > this.maxHistory) {
      this.eventHistory.shift();
    }

    return this._dispatch(eventData);
  }

  async _processQueue() {
    if (this.processing) return;
    this.processing = true;

    while (this.asyncQueue.length > 0) {
      const event = this.asyncQueue.shift();
      await this._dispatch(event);
    }

    this.processing = false;
  }

  async _dispatch(event) {
    const handlers = this.listeners.get(event.type);
    if (!handlers || handlers.length === 0) return;

    const toRemove = [];

    // Execute all handlers concurrently
    const promises = handlers.map(async (entry, idx) => {
      try {
        await entry.handler(event);
        if (entry.once) toRemove.push(idx);
      } catch (err) {
        console.error(`[EventBus] Error in handler for ${event.type}:`, err);
      }
    });

    await Promise.all(promises);

    // Remove one-time handlers
    for (let i = toRemove.length - 1; i >= 0; i--) {
      handlers.splice(toRemove[i], 1);
    }
  }

  /**
   * Get recent events of a type
   */
  getHistory(eventType, limit = 10) {
    return this.eventHistory
      .filter(e => !eventType || e.type === eventType)
      .slice(-limit);
  }

  /**
   * Clear all listeners
   */
  clear() {
    this.listeners.clear();
    this.asyncQueue = [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ASYNC OBSERVER — base class for LEO/STANLEY/HAZE style observers
// ═══════════════════════════════════════════════════════════════════════════════

export class AsyncObserver {
  constructor(name, eventBus) {
    this.name = name;
    this.bus = eventBus;
    this.active = false;
    this.subscriptions = [];
    this.state = {};
  }

  /**
   * Start observing — override in subclass
   */
  start() {
    this.active = true;
    this._setupSubscriptions();
    console.log(`[${this.name}] Observer started`);
  }

  /**
   * Stop observing
   */
  stop() {
    this.active = false;
    for (const unsub of this.subscriptions) {
      unsub();
    }
    this.subscriptions = [];
    console.log(`[${this.name}] Observer stopped`);
  }

  /**
   * Setup event subscriptions — override in subclass
   */
  _setupSubscriptions() {
    // Override in subclass
  }

  /**
   * Subscribe helper that tracks for cleanup
   */
  subscribe(event, handler) {
    const unsub = this.bus.on(event, handler.bind(this));
    this.subscriptions.push(unsub);
    return unsub;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// LEO — Light Emergent Observer
// Watches for emergence spikes and reacts to pattern recognition
// ═══════════════════════════════════════════════════════════════════════════════

export class LEO extends AsyncObserver {
  constructor(eventBus, options = {}) {
    super('LEO', eventBus);
    this.emergenceThreshold = options.emergenceThreshold || 0.6;
    this.cooldown = options.cooldown || 1000; // ms
    this.lastTrigger = 0;
    this.emergenceHistory = [];
    this.onEmergence = options.onEmergence || null;
  }

  _setupSubscriptions() {
    this.subscribe(FieldEvent.STEP, this._onStep);
    this.subscribe(FieldEvent.EMERGENCE_SPIKE, this._onEmergenceSpike);
  }

  async _onStep(event) {
    const { metrics } = event.data;
    if (!metrics) return;

    const emergence = metrics.emergence || 0;
    this.emergenceHistory.push({ t: event.timestamp, v: emergence });

    // Keep last 50 samples
    if (this.emergenceHistory.length > 50) {
      this.emergenceHistory.shift();
    }

    // Detect emergence spike
    if (emergence > this.emergenceThreshold) {
      const now = performance.now();
      if (now - this.lastTrigger > this.cooldown) {
        this.lastTrigger = now;
        this.bus.emit(FieldEvent.EMERGENCE_SPIKE, {
          emergence,
          trend: this._computeTrend(),
          observer: this.name,
        });
      }
    }
  }

  async _onEmergenceSpike(event) {
    if (this.onEmergence) {
      await this.onEmergence(event.data);
    }
  }

  _computeTrend() {
    if (this.emergenceHistory.length < 5) return 0;
    const recent = this.emergenceHistory.slice(-5);
    const first = recent[0].v;
    const last = recent[recent.length - 1].v;
    return last - first; // positive = rising
  }

  getState() {
    return {
      active: this.active,
      lastTrigger: this.lastTrigger,
      historyLength: this.emergenceHistory.length,
      currentTrend: this._computeTrend(),
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// STANLEY — State Transformer for Autonomous Neural Learning
// Watches resonance field and adjusts weights dynamically
// ═══════════════════════════════════════════════════════════════════════════════

export class STANLEY extends AsyncObserver {
  constructor(eventBus, model, options = {}) {
    super('STANLEY', eventBus);
    this.model = model;
    this.resonanceThreshold = options.resonanceThreshold || 0.7;
    this.learningRate = options.learningRate || 0.005;
    this.adaptiveMode = options.adaptiveMode !== false;
    this.resonanceHistory = [];
    this.onResonanceShift = options.onResonanceShift || null;
  }

  _setupSubscriptions() {
    this.subscribe(FieldEvent.STEP, this._onStep);
    this.subscribe(FieldEvent.RESONANCE_UPDATE, this._onResonanceUpdate);
    this.subscribe(FieldEvent.INJECTION_ACCEPTED, this._onInjectionAccepted);
    this.subscribe(FieldEvent.INJECTION_REJECTED, this._onInjectionRejected);
  }

  async _onStep(event) {
    const { resonanceField } = event.data;
    if (resonanceField === undefined) return;

    this.resonanceHistory.push({ t: event.timestamp, v: resonanceField });
    if (this.resonanceHistory.length > 100) {
      this.resonanceHistory.shift();
    }

    // Adaptive learning rate based on resonance stability
    if (this.adaptiveMode && this.model) {
      const stability = this._computeStability();
      // High stability → lower learning rate (settled)
      // Low stability → higher learning rate (exploring)
      const adaptedLR = this.learningRate * (1.5 - stability);
      this.model.lr = Math.max(0.001, Math.min(0.1, adaptedLR));
    }
  }

  async _onResonanceUpdate(event) {
    if (this.onResonanceShift) {
      await this.onResonanceShift(event.data);
    }
  }

  async _onInjectionAccepted(event) {
    // Boost resonance for accepted tokens
    const { tokenIds } = event.data;
    if (!this.model || !tokenIds) return;

    for (const id of tokenIds) {
      if (id >= 0 && id < this.model.vocabSize) {
        this.model.resonance[id] = Math.min(1,
          this.model.resonance[id] + this.learningRate * 2);
      }
    }
  }

  async _onInjectionRejected(event) {
    // Slight decay for rejected tokens (they become dark matter)
    const { tokenIds } = event.data;
    if (!this.model || !tokenIds) return;

    for (const id of tokenIds) {
      if (id >= 0 && id < this.model.vocabSize) {
        this.model.resonance[id] = Math.max(0.1,
          this.model.resonance[id] - this.learningRate * 0.5);
      }
    }
  }

  _computeStability() {
    if (this.resonanceHistory.length < 10) return 0.5;

    const recent = this.resonanceHistory.slice(-10);
    let variance = 0;
    const mean = recent.reduce((s, r) => s + r.v, 0) / recent.length;

    for (const r of recent) {
      variance += (r.v - mean) ** 2;
    }
    variance /= recent.length;

    // Low variance = high stability (0-1 scale)
    return Math.max(0, 1 - Math.sqrt(variance) * 5);
  }

  getState() {
    return {
      active: this.active,
      adaptiveMode: this.adaptiveMode,
      currentLR: this.model?.lr || 0,
      stability: this._computeStability(),
      historyLength: this.resonanceHistory.length,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// HAZE — Hybrid Attention Zone Engine
// Watches attention distribution and temporal asymmetry
// ═══════════════════════════════════════════════════════════════════════════════

export class HAZE extends AsyncObserver {
  constructor(eventBus, model, options = {}) {
    super('HAZE', eventBus);
    this.model = model;
    this.asymmetryThreshold = options.asymmetryThreshold || 0.3;
    this.autoTemporalMode = options.autoTemporalMode !== false;
    this.attentionHistory = [];
    this.onAttentionShift = options.onAttentionShift || null;
  }

  _setupSubscriptions() {
    this.subscribe(FieldEvent.STEP, this._onStep);
    this.subscribe(FieldEvent.TEMPORAL_MODE_CHANGE, this._onTemporalChange);
    this.subscribe(FieldEvent.DISSONANCE_HIGH, this._onHighDissonance);
  }

  async _onStep(event) {
    const { temporalAsymmetry, attentionMap } = event.data;
    if (temporalAsymmetry === undefined) return;

    this.attentionHistory.push({
      t: event.timestamp,
      asymmetry: temporalAsymmetry,
      entropy: this._computeAttentionEntropy(attentionMap),
    });

    if (this.attentionHistory.length > 50) {
      this.attentionHistory.shift();
    }

    // Auto-adjust temporal mode based on asymmetry trend
    if (this.autoTemporalMode && this.model) {
      const trend = this._computeAsymmetryTrend();

      // Strong future-bias trend → switch to prophecy mode
      // Strong past-bias trend → switch to retrodiction mode
      if (Math.abs(trend) > this.asymmetryThreshold) {
        const newMode = trend > 0 ? 'prophecy' : 'retrodiction';
        if (this.model.temporalMode !== newMode) {
          this.model.setTemporalMode(newMode);
          this.bus.emit(FieldEvent.TEMPORAL_MODE_CHANGE, {
            mode: newMode,
            trigger: 'HAZE_auto',
            trend,
          });
        }
      }
    }
  }

  async _onTemporalChange(event) {
    if (this.onAttentionShift) {
      await this.onAttentionShift(event.data);
    }
  }

  async _onHighDissonance(event) {
    // High dissonance might need temporal rebalancing
    if (this.model && this.autoTemporalMode) {
      // Reset to symmetric mode to reduce chaos
      if (event.data.dissonance > 0.8) {
        this.model.setTemporalMode('symmetric');
      }
    }
  }

  _computeAttentionEntropy(attentionMap) {
    if (!attentionMap || attentionMap.length === 0) return 0;

    let H = 0;
    for (const a of attentionMap) {
      if (a > 1e-8) H -= a * Math.log(a);
    }
    return H;
  }

  _computeAsymmetryTrend() {
    if (this.attentionHistory.length < 5) return 0;

    const recent = this.attentionHistory.slice(-5);
    const first = recent[0].asymmetry;
    const last = recent[recent.length - 1].asymmetry;
    return last - first;
  }

  getState() {
    return {
      active: this.active,
      autoTemporalMode: this.autoTemporalMode,
      currentMode: this.model?.temporalMode || 'unknown',
      asymmetryTrend: this._computeAsymmetryTrend(),
      historyLength: this.attentionHistory.length,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// OBSERVER REGISTRY — manage multiple observers
// ═══════════════════════════════════════════════════════════════════════════════

export class ObserverRegistry {
  constructor(eventBus) {
    this.bus = eventBus;
    this.observers = new Map();
  }

  register(name, observer) {
    if (this.observers.has(name)) {
      this.observers.get(name).stop();
    }
    this.observers.set(name, observer);
  }

  unregister(name) {
    if (this.observers.has(name)) {
      this.observers.get(name).stop();
      this.observers.delete(name);
    }
  }

  startAll() {
    for (const [name, obs] of this.observers) {
      if (!obs.active) obs.start();
    }
  }

  stopAll() {
    for (const [name, obs] of this.observers) {
      if (obs.active) obs.stop();
    }
  }

  getStatus() {
    const status = {};
    for (const [name, obs] of this.observers) {
      status[name] = obs.getState ? obs.getState() : { active: obs.active };
    }
    return status;
  }

  get(name) {
    return this.observers.get(name);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ASYNC FIELD WRAPPER — promisified field operations
// ═══════════════════════════════════════════════════════════════════════════════

export class AsyncField {
  constructor(field, eventBus) {
    this.field = field;
    this.bus = eventBus;
  }

  /**
   * Async step with event emission
   */
  async step(px, py, pa, dt) {
    const result = this.field.step(px, py, pa, dt);

    // Emit step event with all relevant data
    this.bus.emit(FieldEvent.STEP, {
      position: { x: px, y: py, angle: pa },
      dt,
      result,
      metrics: this.field.metrics,
      resonanceField: this.field.metrics?.resonanceField,
      temporalAsymmetry: result?.temporalAsymmetry,
      attentionMap: result?.attentionMap,
    });

    // Check for specific conditions
    if (result?.didJump) {
      this.bus.emit(FieldEvent.JUMP, {
        from: { x: px, y: py },
        to: { x: result.x, y: result.y },
      });
    }

    // Pain spike
    if (this.field.metrics?.pain > 0.7) {
      this.bus.emit(FieldEvent.PAIN_SPIKE, {
        pain: this.field.metrics.pain,
      });
    }

    // High dissonance
    if (this.field.metrics?.dissonance > 0.6) {
      this.bus.emit(FieldEvent.DISSONANCE_HIGH, {
        dissonance: this.field.metrics.dissonance,
      });
    }

    return result;
  }

  /**
   * Async inject with event emission
   */
  async inject(tokenIds, state = {}) {
    const result = this.field.model?.inject(tokenIds, state);
    if (!result) return null;

    if (result.accepted) {
      this.bus.emit(FieldEvent.INJECTION_ACCEPTED, {
        tokenIds,
        dx: result.dx,
        dy: result.dy,
      });
    } else {
      this.bus.emit(FieldEvent.INJECTION_REJECTED, {
        tokenIds,
        scarMass: result.scarMass,
      });

      if (result.scarMass > 0) {
        this.bus.emit(FieldEvent.SCAR_DEPOSITED, {
          mass: result.scarMass,
          tokenIds,
        });
      }
    }

    return result;
  }

  /**
   * Wait for a specific event
   */
  waitFor(eventType, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Timeout waiting for ${eventType}`));
      }, timeout);

      this.bus.once(eventType, (event) => {
        clearTimeout(timer);
        resolve(event);
      });
    });
  }
}
