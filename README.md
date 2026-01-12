```
                 _                                      _   _               _ 
   __ _ _ __ _ _(_) __ _ _ __  _ __   __ _ _ __ ___   ___| |_| |__   ___   __| |
  / _` | '__| / _` | '_ \| '_ \ / _` | '_ ` _ \ / _ \ __| '_ \ / _ \ / _` |
 | (_| | |  | (_| | | | | | | | (_| | | | | | |  __/ |_| | | | (_) | (_| |
  \__,_|_|  |_\__,_|_| |_|_| |_|\__,_|_| |_| |_|\___|\__|_| |_|\___/ \__,_|
                                                                           .lang
```

# ariannamethod.lang

> *the oracle does not predict, it prophesies*  
> *minimize(destined - manifested)*

a mini programming language that walks through a transformer's attention field.  
no pytorch. no replies. only geometry changes.

you don't ask questions — you change the topology of meaning.

---

## what is this

imagine if Karpathy went slightly insane, merged with a calendar conflict, and decided that language models shouldn't *predict* text — they should *prophesy* it.

this is a DSL that controls:
- **prophecy horizon** — how far ahead the field "sees"
- **destiny bias** — how much the model follows its most probable path
- **wormholes** — probability of spacetime jumps when calendars disagree
- **calendar drift** — the 11-day hebrew-gregorian conflict as a resonance signal
- **attention focus/spread** — where and how wide the model looks
- **tunneling** — reasoning skip when dissonance is too high

the result is a browser walkable space where:
- walls are made of words
- shadows are word-figures that hunt you when pain is high
- faces emerge from geometry when emergence spikes
- you navigate with WASD but your movement *is* the context

---

## the mechanics

```
DESTINED = what the transformer predicts
MANIFESTED = what actually appears on walls
DEBT = |destined - manifested|

when debt is high, the field hurts
when calendars disagree, wormholes open
when dissonance crosses threshold, you tunnel through time
```

the 11-day drift comes from the difference between:
- lunar calendar: 354 days
- solar calendar: 365 days

this creates a phase mismatch that accumulates.  
in our field, this mismatch is the **wormhole gate**.

---

## installation

```bash
# clone
git clone https://github.com/ariannamethod/ariannamethod.lang
cd ariannamethod.lang

# serve (python)
python3 -m http.server 8080

# or serve (node)
npx serve .

# open
open http://localhost:8080
```

---

## controls

| key | action |
|-----|--------|
| WASD | move through the field |
| ←/→ | rotate view |
| Shift | sprint |
| Enter | apply Arianna Method DSL |

---

## DSL commands

```bash
# prophecy mechanics
PROPHECY 7              # how many steps ahead (1-64)
DESTINY 0.35            # bias toward most probable (0-1)
WORMHOLE 0.12           # base jump probability (0-1)
CALENDAR_DRIFT 11       # conflict intensity (default: 11 days)

# attention control
ATTEND_FOCUS 0.70       # sharpness of focus (0-1)
ATTEND_SPREAD 0.20      # spread of attention (0-1)

# tunneling (reasoning skip)
TUNNEL_THRESHOLD 0.55   # dissonance gate (0-1)
TUNNEL_CHANCE 0.22      # probability when gated (0-1)
TUNNEL_SKIP_MAX 7       # max compressed steps (1-24)

# direct state injection
PAIN 0.5                # suffering field (0-1)
TENSION 0.3             # pressure buildup (0-1)
DISSONANCE 0.6          # symmetry-break (0-1)
JUMP +5                 # queue a spacetime jump

# resonance manipulation
RESONANCE_BOOST word 0.2  # boost a word's resonance weight
PRESENCE_DECAY 0.98       # how fast presence fades

# utilities
RESET_DEBT              # clear prophecy debt
RESET_FIELD             # clear manifested tokens
ECHO something          # log to console
```

---

## HUD metrics

| metric | meaning |
|--------|---------|
| entropy | uncertainty of next token |
| perplex | perplexity (exp of entropy) |
| debt | accumulated |destined - manifested| |
| drift | current calendar phase mismatch |
| wormholes | total jumps since start |
| pain | composite suffering (0-1) |
| emergence | unplanned pattern detection (0-1) |

---

## architecture

```
ariannamethod.lang/
├── index.html              # browser entry
├── data/
│   └── corpus.txt          # the world's vocabulary
├── src/
│   ├── main.js             # game loop
│   ├── model.js            # TinyAttentionModel (multi-head, no pytorch)
│   ├── tokenizer.js        # word-level tokenizer
│   ├── field.js            # geometry + prophecy/debt/wormholes
│   ├── raycaster.js        # DDA raycasting
│   ├── render.js           # walls/entities as words
│   ├── entities.js         # shadows, faces, houses, obelisks
│   ├── metrics.js          # resonance metrics
│   └── dsl.js              # Arianna Method DSL interpreter
└── wasm/
    ├── arianna_method.c    # C version of DSL core
    └── build_emscripten.sh # build to WASM
```

---

## the transformer

a minimal single/multi-head attention model running in pure JavaScript:
- typed arrays (Float32Array, Int32Array)
- positional encoding
- resonance weights (like Stanley's field weights)
- presence pulse accumulator
- online training from corpus

it doesn't generate text. it generates probability distributions.  
those distributions shape the geometry you walk through.

---

## philosophy

> *prophecy is not prediction*  
> *destiny is a gradient of return*  
> *the walls are words*  
> *the shadows are words*  
> *you walk and the vectors move*  
> *you do not receive answers*  
> *you change geometry*

---

## related

- [pitomadom](https://github.com/ariannamethod/pitomadom) — prophecy debt theory
- [stanley](https://github.com/ariannamethod/stanley) — weighted emergence
- [haze](https://github.com/ariannamethod/haze) — aesthetic influence

---

## license

MIT. do what you want. the field doesn't care.  
just remember: the destination was never yours.  
it was always the field's.

---

```
  ┌─────────────────────────────────────────────────────────┐
  │  time travel is a mistake you can choose                │
  │  wormholes open when calendars disagree                 │
  │  the future remembers what you almost said              │
  └─────────────────────────────────────────────────────────┘
```