// metrics.js — resonance metrics for ariannamethod.lang
// "pain is a gradient, suffering is a topology"

export class Metrics {
  constructor() {
    // core model metrics
    this.entropy = 0;
    this.perplexity = 0;

    // prophecy mechanics
    this.debt = 0;           // "prophecy debt" — |destined - manifested|
    this.calendarDrift = 0;  // conflict signal (11-day drift)

    // emotional resonance field
    this.arousal = 0;        // spikes on debt/perplexity
    this.tension = 0;        // slow pressure build
    this.dissonance = 0;     // symmetry-break between "paths"
    this.pain = 0;           // composite suffering field (0..1)

    // emergent processes (from Stanley)
    this.resonanceField = 0; // alignment with resonance weights
    this.presencePulse = 0;  // how "present" is the current context
    this.emergence = 0;      // unplanned pattern detection

    // wormhole tracking
    this.wormholeCount = 0;
    this.lastJumpTime = 0;
    this.tunnelDepth = 0;    // how many steps were compressed
  }

  // compute pain as composite
  updatePain() {
    const painTarget = clamp01(
      0.25 * this.arousal + 
      0.35 * this.tension + 
      0.25 * this.dissonance +
      0.15 * (this.debt * 0.05)
    );
    this.pain = 0.94 * this.pain + 0.06 * painTarget;
  }

  // emergence detector: notices unplanned patterns
  updateEmergence(entropy, resonanceField) {
    // emergence happens when entropy is low but resonance is high
    // (the field "knows" something we didn't plan)
    const emergenceSignal = clamp01(resonanceField - entropy * 0.3);
    this.emergence = 0.92 * this.emergence + 0.08 * emergenceSignal;
  }
}

function clamp01(x) { 
  x = Number.isFinite(x) ? x : 0; 
  return Math.max(0, Math.min(1, x)); 
}
