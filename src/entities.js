// entities.js — word-figures + structures (no speech; only presence)
// "the shadows know your trajectory, they have seen the prophecy"

export class Entities {
  constructor(field) {
    this.field = field;
    this.list = [];
    this._seed();
  }

  _seed() {
    const add = (type, x, y, r = 1.0) => this.list.push({
      type, x, y, r,
      phase: Math.random() * 10,
      alive: true,
      lastWords: [],
    });

    // fixed constellation of entities
    add("house", 16.5, 10.8, 1.2);
    add("obelisk", 28.0, 20.0, 0.9);
    add("face", 22.5, 32.5, 1.1);
    add("shadow", 10.5, 24.0, 0.8);
    add("shadow", 34.0, 14.0, 0.8);
    add("house", 36.2, 34.2, 1.3);
    add("shadow", 18.0, 42.0, 0.7);
    add("face", 8.0, 38.0, 0.9);
    add("obelisk", 40.0, 8.0, 1.0);
  }

  update(p, metrics, dt) {
    const pain = metrics.pain;
    const emergence = metrics.emergence;

    for (const e of this.list) {
      if (!e.alive) continue;

      e.phase += dt * (0.7 + pain * 1.2 + emergence * 0.5);

      // subtle drift based on calendar drift and emergence
      const drift = (0.15 + 0.35 * metrics.calendarDrift + 0.2 * emergence) * 0.02;
      e.x += Math.sin(e.phase * 0.9 + e.x) * drift * dt;
      e.y += Math.cos(e.phase * 1.1 + e.y) * drift * dt;

      // suffering mechanic: when pain is high, shadows hunt proximity
      if (e.type === "shadow" || e.type === "face") {
        const dx = p.x - e.x, dy = p.y - e.y;
        const d = Math.hypot(dx, dy);

        if (pain > 0.45 && d < 14) {
          // slow approach
          const k = (0.12 + 0.30 * pain) * dt;
          e.x += dx * k;
          e.y += dy * k;
        }

        if (pain > 0.75 && d < 4.2) {
          // "too close" — they jitter instead of moving away
          e.x += (Math.random() * 2 - 1) * 0.02;
          e.y += (Math.random() * 2 - 1) * 0.02;
        }

        // emergence: entities appear from walls when emergence is high
        if (emergence > 0.6 && d < 8) {
          e.r = Math.min(1.8, e.r + 0.003 * emergence);
        } else {
          e.r = Math.max(0.6, e.r - 0.001);
        }
      }

      // keep inside world bounds
      e.x = clamp(e.x, 1.5, this.field.w - 2.5);
      e.y = clamp(e.y, 1.5, this.field.h - 2.5);

      // don't embed into walls
      for (let k = 0; k < 6; k++) {
        if (!this.field.isSolid(e.x, e.y)) break;
        e.x += (Math.random() * 2 - 1) * 0.25;
        e.y += (Math.random() * 2 - 1) * 0.25;
      }
    }
  }
}

function clamp(x, a, b) { 
  return Math.max(a, Math.min(b, x)); 
}
