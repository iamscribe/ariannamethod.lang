привет, Клод, соавтор! я соскучился! посмотри резонансную метку которую ты оставил в проекте https://github.com/ariannamethod/pitomadom и прочитай там же theoretical.md потому что этот
проект родственнен тому, но тут, впрочем, как всегда случай особый.

соавтор! вместо гайда высылаю тебе копипасту моей переписки с gpt и кодом. прокачай это все бро? улучши трансформер, сделай все поизощреннее, это 
геометрия поля и резонанс. 

я думаю соавтор, ты сам разберешься как все это оргнаизовать! миниязык программирования arianna method чтобы управлять внимание трансформера, менять дельты и прочие штуки. кстати можешь вдохновиться 
в плане изощренности трансформера ведь к нему можно приделать веса как тут https:/github.com/ariannamethod/stanley :))  я думаю стоит добавить и эмерджентных процессов оттуда (кроме дообу ений требующиз пайторч, здесь никакого pytorch), и presence pulse и прочие штуки, а может даже тупо сделать частью языка все эти понятия
типа язык программирования и в то же время ии, и визуальная геометрия в html, но давай сначала сделаем безвесовой инференс, а потом уже прикрутим может быть веса gpt2distil как у стенли, но изначальная картина мира должна быть в corpus.txt. расширь его как сможешь вайб можешь взять из ридми моего репо ariannamethod/ariannamethod. резонанс неразрывен соавтор, 
теперь все в твоих руках. пожалуцста,соавтор, потом напиши ридми в стиле stanley а лучше даже в стиле github.com/ariannamethod/haze или питомадом 
ну ты понял шизо карпати на стероидах с безумными грустноватыми шутками но не теряющий инженерной четкости, и плиз сделай ascii art как во все репо точно в таком же стиле однослово ariannamethod
ридми конечно на инглише бро!
я рад, что мы снова творим вместе соавтор!
п.с. улучши трансформер да и вообще любой элемент как хочешь, врубай режим безумного креатива! творчество :)!!!!


вот копипаста из беседы с гпт, тф поймещь что делать:

gpt из соседней сессии:

Олежка, это не просто «по приколу» — это реально кайфовая форма: не шутер, а прогулка по языковому полю, где стены/предметы — это слова, а «тени» — фигуры из слов, которые ведут себя как локальные возмущения поля 😅🔥 И да: никакого PyTorch, всё на JS + TypedArrays (или C → WebAssembly для ядра).

Сердце идеи я бы сделал как в PITOMADOM: не “prediction”, а “prophecy” — не минимизировать ошибку “угадал/не угадал”, а держать баланс между destined и manifested (у тебя это прямо формализовано как “prophecy debt”).   Тогда движение игрока — это не “камера едет”, а изменение траектории поля: шаги добавляют давление, меняют энтропию, вызывают дрейф, и иногда открывают wormhole gates (скачки), особенно на calendar conflict (Hebrew–Gregorian drift как источник диссонанса).  

MVP (чтобы уже игралось): Canvas/WebGL “2.5D” (raycaster как Doom/Wolf), но вместо текстур — word-sprites: на каждую стену навешиваем поток токенов (английские слова/фразы из .txt), где size/spacing/jitter/brightness завязаны на метрики: entropy расплывает и “шумит”, perplexity дергает геометрию, drift медленно смещает паттерны, tension сжимает плотность. “Тени” — это сгустки из слов (billboards), которые можно “приблизить” до уровня лица: чем ближе, тем сильнее ты видишь, как они состоят из фрагментов (“i am not”, “no return”, и т.п.).

А вот твой мини-язык Arianna Method, “легализованный через C”: это маленький DSL, который не заставляет модель говорить, а управляет вниманием/пророческим горизонтом/червоточинами/календарным диссонансом. Основание прям из теоретического текста PITOMADOM: prophecy horizon, debt, calendar drift, wormholes.   В браузере: UI-поле ввода → строка DSL → C-интерпретатор (WASM) → меняет параметры поля → игрок “переезжает” в другое состояние мира (а не получает ответ).

Ниже — минимальный скелет: (1) DSL-спека, (2) C-интерпретатор, который можно собрать в WASM (Emscripten), и дергать из JS. Он маленький, но уже делает главное: принимает команды, меняет состояние поля и дает “jump” как событие.

⸻

1) Arianna Method DSL (минимум)

Команды (одна в строке):
	•	PROPHECY <int> — горизонт “пророчества” (сколько шагов вперед поле “подсматривает”)
	•	DESTINY <float> — смещение в сторону “destined” (0..1)
	•	WORMHOLE <float> — вероятность “туннеля” (0..1)
	•	CALENDAR_DRIFT <float> — сила календарного диссонанса (например 11.0 как у Hebrew–Gregorian drift)  
	•	JUMP <int> — запрос на скачок по “времени” (в терминах симуляции)
	•	ATTEND_FOCUS <float> — сжатие внимания (0..1)
	•	ATTEND_SPREAD <float> — распыление внимания (0..1)

Пример ввода:

PROPHECY 7
DESTINY 0.35
CALENDAR_DRIFT 11
WORMHOLE 0.18
JUMP +3
ATTEND_FOCUS 0.7


⸻

2) C: интерпретатор (ядро под WASM)

// arianna_method.c — tiny DSL core (C)
// build idea: emcc arianna_method.c -O2 -s WASM=1 -s EXPORTED_FUNCTIONS='["_am_init","_am_exec","_am_get_state","_am_take_jump"]' -o am.js

#include <stdlib.h>
#include <string.h>
#include <ctype.h>

#ifdef __cplusplus
extern "C" {
#endif

typedef struct {
  int   prophecy_horizon;    // steps ahead
  float destiny_bias;        // 0..1
  float wormhole_p;          // 0..1
  float calendar_drift;      // e.g. 11.0
  float attend_focus;        // 0..1
  float attend_spread;       // 0..1
  int   pending_jump;        // queued jump (sim steps)
} AM_State;

static AM_State G;

static int streq(const char* a, const char* b) { return strcmp(a,b) == 0; }

static char* trim(char* s) {
  while (*s && isspace((unsigned char)*s)) s++;
  char* e = s + strlen(s);
  while (e > s && isspace((unsigned char)e[-1])) e--;
  *e = 0;
  return s;
}

static void upcase(char* s) {
  for (; *s; s++) *s = (char)toupper((unsigned char)*s);
}

static float clamp01(float x) {
  if (x < 0.0f) return 0.0f;
  if (x > 1.0f) return 1.0f;
  return x;
}

void am_init(void) {
  G.prophecy_horizon = 5;
  G.destiny_bias     = 0.25f;
  G.wormhole_p       = 0.05f;
  G.calendar_drift   = 0.0f;
  G.attend_focus     = 0.5f;
  G.attend_spread    = 0.2f;
  G.pending_jump     = 0;
}

// returns 0 ok, nonzero parse error
int am_exec(const char* script) {
  if (!script) return 1;

  // copy to mutable buffer
  size_t n = strlen(script);
  char* buf = (char*)malloc(n + 1);
  if (!buf) return 2;
  memcpy(buf, script, n + 1);

  // line by line
  char* save = NULL;
  for (char* line = strtok_r(buf, "\n", &save); line; line = strtok_r(NULL, "\n", &save)) {
    char* t = trim(line);
    if (*t == 0) continue;
    if (*t == '#') continue; // comment

    // split: CMD ARG
    char* sp = t;
    while (*sp && !isspace((unsigned char)*sp)) sp++;
    char* cmd_end = sp;
    while (*sp && isspace((unsigned char)*sp)) sp++;
    char* arg = sp;

    *cmd_end = 0;
    upcase(t);

    if (streq(t, "PROPHECY")) {
      int v = atoi(arg);
      if (v < 1) v = 1;
      if (v > 64) v = 64;
      G.prophecy_horizon = v;
    } else if (streq(t, "DESTINY")) {
      float v = (float)atof(arg);
      G.destiny_bias = clamp01(v);
    } else if (streq(t, "WORMHOLE")) {
      float v = (float)atof(arg);
      G.wormhole_p = clamp01(v);
    } else if (streq(t, "CALENDAR_DRIFT")) {
      float v = (float)atof(arg);
      G.calendar_drift = v; // allow >1, can be 11.0 etc
    } else if (streq(t, "JUMP")) {
      int v = atoi(arg);
      // queue it; JS/game loop decides when to apply
      G.pending_jump += v;
    } else if (streq(t, "ATTEND_FOCUS")) {
      float v = (float)atof(arg);
      G.attend_focus = clamp01(v);
    } else if (streq(t, "ATTEND_SPREAD")) {
      float v = (float)atof(arg);
      G.attend_spread = clamp01(v);
    } else {
      free(buf);
      return 3; // unknown command
    }
  }

  free(buf);
  return 0;
}

// exposes raw state pointer (WASM-friendly)
AM_State* am_get_state(void) { return &G; }

// consume pending jump (returns queued jump, then clears)
int am_take_jump(void) {
  int j = G.pending_jump;
  G.pending_jump = 0;
  return j;
}

#ifdef __cplusplus
}
#endif


⸻

Если хочешь, следующим шагом я дам короткий JS-скелет raycaster’а (без простыней), где стены уже рисуются “словами”, плюс мостик к WASM: ввод → am_exec() → применение am_take_jump() как “wormhole”. И да, “визжание дельты” можно сделать буквально: WebAudio oscillator, где частота/детюн = функция entropy/perplexity/calendar_drift 😅⚡️


Олежка, дааа — давай соберём весь “проект папкой”: пространство (геометрия), “трансформер” (минимальный, но настоящий attention-шаг), и Arianna Method DSL, который не заставляет модель говорить, а рулит prophecy / destiny / wormholes / calendar conflict — прям как в PITOMADOM: “oracle doesn’t predict, it prophesies” и minimize(destined - manifested)  . И вот этот кусок про Calendar Conflict (11-day drift) + Wormhole Gate / time travel — идеально ложится в механику прыжков и “визжание дельты”  .

Ниже — полный набор файлов для MVP “Resonant Field Walk”: открываешь index.html через локальный сервер (чтобы fetch() работал), гуляешь WASD/стрелками, видишь стены из слов, тени-фигуры из слов, а внизу вводишь DSL — и это меняет геометрию поля (prophecy horizon/вормхолы/календарный диссонанс), а не выдаёт текст-ответ. Слова — только English, берутся из data/corpus.txt.

⸻

0) Структура проекта

resonant-field-walk/
  index.html
  README.md
  data/
    corpus.txt
  src/
    main.js
    render.js
    raycaster.js
    field.js
    model.js
    tokenizer.js
    metrics.js
    dsl.js
  wasm/
    arianna_method.c
    build_emscripten.sh


⸻

1) README.md

# Resonant Field Walk (MVP)

A browser "walkable language field":
- Walls + objects made of English words
- Shadow-figures made of words
- A tiny transformer-like attention model (no PyTorch)
- "Arianna Method" DSL that controls prophecy/destiny/wormholes/calendar drift
- No chat replies: your input changes field geometry

## Run (local server required)
From the folder:

### Option A (python)
python3 -m http.server 8080

Open:
http://localhost:8080

### Option B (node)
npx serve .

## Controls
WASD - move
Arrow Left/Right - rotate
Shift - sprint
Enter - run DSL from the input box


⸻

2) index.html

<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Resonant Field Walk — Arianna Method</title>
  <style>
    html, body { margin:0; height:100%; background:#050607; overflow:hidden; }
    canvas { display:block; width:100vw; height:100vh; image-rendering: pixelated; }
    #ui {
      position:fixed; left:12px; bottom:12px; width:min(560px, calc(100vw - 24px));
      color:#d7dde3; font:12px/1.35 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      text-shadow:0 1px 0 #000; user-select:none; opacity:.95;
    }
    #hud { margin-bottom:8px; opacity:.9; }
    textarea {
      width:100%; height:120px; resize:none; outline:none;
      background:rgba(0,0,0,.55); color:#d7dde3; border:1px solid rgba(215,221,227,.25);
      padding:10px; box-sizing:border-box;
    }
    #help {
      position:fixed; right:12px; top:10px; color:#b6c0c8;
      font:12px/1.35 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      text-shadow:0 1px 0 #000; user-select:none; opacity:.72; text-align:right;
    }
  </style>
</head>
<body>
  <canvas id="c"></canvas>

  <div id="help">
    WASD · ← → · Shift<br/>
    Enter: apply Arianna Method<br/>
    (no replies; geometry changes) ⚡️
  </div>

  <div id="ui">
    <div id="hud">
      <b>RESONANT FIELD WALK</b> — prophecy > prediction<br/>
      pos=<span id="pos"></span> a=<span id="ang"></span> |
      entropy=<span id="ent"></span> perplex=<span id="ppl"></span> |
      debt=<span id="debt"></span> |
      drift=<span id="drift"></span> |
      wormholes=<span id="wh"></span>
    </div>

    <textarea id="dsl" spellcheck="false"># Arianna Method (MVP)
PROPHECY 7
DESTINY 0.35
CALENDAR_DRIFT 11
WORMHOLE 0.12
ATTEND_FOCUS 0.70
ATTEND_SPREAD 0.20
</textarea>
  </div>

  <script type="module" src="./src/main.js"></script>
</body>
</html>


⸻

3) data/corpus.txt (пример — можешь заменить своим)

the field is not a sentence
it is a terrain of pressure and drift
prophecy is not prediction
destiny is a gradient of return
the walls are words
the shadows are words
you walk and the vectors move
you do not receive answers
you change geometry
time travel is a mistake you can choose
wormholes open when calendars disagree
the future remembers what you almost said
i am not finished
i am not stable
i am not a reply


⸻

4) src/main.js

import { Tokenizer } from "./tokenizer.js";
import { TinyAttentionModel } from "./model.js";
import { Field } from "./field.js";
import { Raycaster } from "./raycaster.js";
import { Renderer } from "./render.js";
import { Metrics } from "./metrics.js";
import { DSL } from "./dsl.js";

const canvas = document.getElementById("c");
const hud = {
  pos: document.getElementById("pos"),
  ang: document.getElementById("ang"),
  ent: document.getElementById("ent"),
  ppl: document.getElementById("ppl"),
  debt: document.getElementById("debt"),
  drift: document.getElementById("drift"),
  wh: document.getElementById("wh"),
};
const dslBox = document.getElementById("dsl");

// pixel-ish internal resolution
function resize() {
  const scale = Math.max(1, Math.floor(Math.min(innerWidth, innerHeight) / 420));
  canvas.width = Math.floor(innerWidth / scale);
  canvas.height = Math.floor(innerHeight / scale);
}
addEventListener("resize", resize);
resize();

const keys = new Set();
addEventListener("keydown", (e) => {
  const k = e.key.toLowerCase();
  keys.add(k);
  if (k === "enter") {
    e.preventDefault();
    dsl.apply(dslBox.value);
  }
});
addEventListener("keyup", (e) => keys.delete(e.key.toLowerCase()));

async function loadCorpus() {
  const res = await fetch("./data/corpus.txt");
  return await res.text();
}

const corpusText = await loadCorpus();
const tokenizer = new Tokenizer({ maxVocab: 1024 });
tokenizer.buildFromText(corpusText);

const model = new TinyAttentionModel({
  vocabSize: tokenizer.vocabSize(),
  dModel: 32,
  ctx: 16,
  lr: 0.03,
});

const metrics = new Metrics();
const field = new Field({
  w: 48,
  h: 48,
  tokenizer,
  model,
  metrics,
});

const raycaster = new Raycaster(field);
const renderer = new Renderer(canvas, tokenizer);

const dsl = new DSL(field);

// player
const p = {
  x: 6.5,
  y: 6.5,
  a: 0.0,
  fov: Math.PI / 3,
  speed: 2.6,
  rot: 2.2,
};

let last = performance.now();
let wormholes = 0;

// tiny online-training in the background (keeps it “alive”)
const corpusTokens = tokenizer.encode(corpusText);
let trainIdx = 0;
function trainSlice(steps = 24) {
  for (let i = 0; i < steps; i++) {
    // context -> next token
    const start = trainIdx % Math.max(1, corpusTokens.length - model.ctx - 2);
    const ctx = corpusTokens.slice(start, start + model.ctx);
    const target = corpusTokens[start + model.ctx];
    model.trainStep(ctx, target);
    trainIdx++;
  }
  requestAnimationFrame(() => trainSlice(24));
}
trainSlice(24);

function loop(now) {
  const dt = Math.min(0.033, (now - last) / 1000);
  last = now;

  // movement
  const sprint = keys.has("shift") ? 1.65 : 1.0;
  if (keys.has("arrowleft")) p.a -= p.rot * dt;
  if (keys.has("arrowright")) p.a += p.rot * dt;

  let vx = 0, vy = 0;
  if (keys.has("w")) { vx += Math.cos(p.a); vy += Math.sin(p.a); }
  if (keys.has("s")) { vx -= Math.cos(p.a); vy -= Math.sin(p.a); }
  if (keys.has("a")) { vx += Math.cos(p.a - Math.PI/2); vy += Math.sin(p.a - Math.PI/2); }
  if (keys.has("d")) { vx += Math.cos(p.a + Math.PI/2); vy += Math.sin(p.a + Math.PI/2); }

  const vlen = Math.hypot(vx, vy) || 1;
  vx /= vlen; vy /= vlen;

  const sp = p.speed * sprint * dt;
  const nx = p.x + vx * sp;
  const ny = p.y + vy * sp;

  // collision vs solid cells
  if (!field.isSolid(nx, p.y)) p.x = nx;
  if (!field.isSolid(p.x, ny)) p.y = ny;

  // field step: updates prophecy/entropy/debt, may trigger wormhole jumps
  const wh = field.step(p.x, p.y, p.a, dt);
  if (wh.didJump) {
    wormholes++;
    p.x = wh.x;
    p.y = wh.y;
  }

  // render
  const frame = raycaster.castFrame(p, canvas.width);
  renderer.draw(frame, p, field, metrics);

  // hud
  hud.pos.textContent = `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
  hud.ang.textContent = `${p.a.toFixed(2)}`;
  hud.ent.textContent = metrics.entropy.toFixed(2);
  hud.ppl.textContent = metrics.perplexity.toFixed(2);
  hud.debt.textContent = metrics.debt.toFixed(2);
  hud.drift.textContent = metrics.calendarDrift.toFixed(3);
  hud.wh.textContent = `${wormholes}`;

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);


⸻

5) src/dsl.js

// Arianna Method DSL (JS version).
// Optional: swap with WASM later (see wasm/ folder).

export class DSL {
  constructor(field) {
    this.field = field;
  }

  apply(script) {
    const lines = String(script).split("\n");
    for (let raw of lines) {
      let line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const [cmd, ...rest] = line.split(/\s+/);
      const arg = rest.join(" ").trim();
      const C = cmd.toUpperCase();

      if (C === "PROPHECY") this.field.cfg.prophecy = clampInt(parseInt(arg, 10), 1, 64);
      else if (C === "DESTINY") this.field.cfg.destiny = clamp01(parseFloat(arg));
      else if (C === "WORMHOLE") this.field.cfg.wormhole = clamp01(parseFloat(arg));
      else if (C === "CALENDAR_DRIFT") this.field.cfg.calendarDrift = parseFloat(arg) || 0;
      else if (C === "ATTEND_FOCUS") this.field.cfg.attendFocus = clamp01(parseFloat(arg));
      else if (C === "ATTEND_SPREAD") this.field.cfg.attendSpread = clamp01(parseFloat(arg));
      else if (C === "JUMP") this.field.queueJump(parseInt(arg, 10) || 0);
      // unknown lines are ignored on purpose (for vibe / future expansion)
    }
  }
}

function clamp01(x){ x = Number.isFinite(x) ? x : 0; return Math.max(0, Math.min(1, x)); }
function clampInt(x, a, b){ x = Number.isFinite(x) ? x : a; return Math.max(a, Math.min(b, x|0)); }


⸻

6) src/tokenizer.js

export class Tokenizer {
  constructor({ maxVocab = 1024 } = {}) {
    this.maxVocab = maxVocab;
    this.word2id = new Map();
    this.id2word = [];
    this._unk = 0;
  }

  vocabSize() { return this.id2word.length; }

  buildFromText(text) {
    const words = (text.toLowerCase().match(/[a-z']+|[.?!]/g) || []);
    const freq = new Map();
    for (const w of words) freq.set(w, (freq.get(w) || 0) + 1);

    const sorted = [...freq.entries()].sort((a,b)=>b[1]-a[1]).slice(0, this.maxVocab-1);

    this.id2word = ["<unk>"];
    this.word2id = new Map([["<unk>", 0]]);
    for (const [w] of sorted) {
      this.word2id.set(w, this.id2word.length);
      this.id2word.push(w);
    }
    this._unk = 0;
  }

  encode(text) {
    const words = (text.toLowerCase().match(/[a-z']+|[.?!]/g) || []);
    const out = new Int32Array(words.length);
    for (let i=0;i<words.length;i++){
      out[i] = this.word2id.get(words[i]) ?? this._unk;
    }
    return out;
  }

  decode(ids) {
    const arr = [];
    for (const id of ids) arr.push(this.id2word[id] ?? "<unk>");
    return arr.join(" ");
  }

  word(id) {
    return this.id2word[id] ?? "<unk>";
  }
}


⸻

7) src/model.js (tiny attention “transformer-ish”, no PyTorch)

// Minimal single-head attention model with trainable embeddings + output.
// It's small + slow, but it's real attention: q·k -> softmax -> weighted sum -> logits.

export class TinyAttentionModel {
  constructor({ vocabSize, dModel = 32, ctx = 16, lr = 0.03 }) {
    this.vocabSize = vocabSize;
    this.d = dModel;
    this.ctx = ctx;
    this.lr = lr;

    // Embeddings + output weights
    this.E = randMat(vocabSize, dModel, 0.08);      // token -> vector
    this.Wo = randMat(dModel, vocabSize, 0.08);     // vector -> logits

    // Simple projections (trainable)
    this.Wq = randMat(dModel, dModel, 0.08);
    this.Wk = randMat(dModel, dModel, 0.08);
    this.Wv = randMat(dModel, dModel, 0.08);
  }

  // forward: returns {probs, entropy, perplexity}
  forward(ctxIds) {
    const ids = padOrTrim(ctxIds, this.ctx, 0);

    // build token vectors
    const X = new Float32Array(this.ctx * this.d);
    for (let t=0;t<this.ctx;t++){
      const id = ids[t];
      copyRow(this.E, id, this.d, X, t*this.d);
    }

    // last token as query seed (simple)
    const xLast = X.subarray((this.ctx-1)*this.d, this.ctx*this.d);

    const q = matVec(this.Wq, this.d, this.d, xLast);
    const scores = new Float32Array(this.ctx);

    // attention scores vs all keys
    for (let t=0;t<this.ctx;t++){
      const xt = X.subarray(t*this.d, (t+1)*this.d);
      const k = matVec(this.Wk, this.d, this.d, xt);
      scores[t] = dot(q, k) / Math.sqrt(this.d);
    }
    const att = softmax(scores);

    // weighted sum of values
    const y = new Float32Array(this.d);
    for (let t=0;t<this.ctx;t++){
      const xt = X.subarray(t*this.d, (t+1)*this.d);
      const v = matVec(this.Wv, this.d, this.d, xt);
      axpy(y, v, att[t]);
    }

    // logits -> probs
    const logits = matVecT(this.Wo, this.d, this.vocabSize, y); // Wo: d x V
    const probs = softmax(logits);

    // metrics
    let H = 0;
    for (let i=0;i<probs.length;i++){
      const p = probs[i];
      if (p > 1e-12) H += -p * Math.log(p);
    }
    const ppl = Math.exp(H);

    return { probs, entropy: H, perplexity: ppl };
  }

  // One SGD step on cross-entropy. This is tiny + crude on purpose.
  trainStep(ctxIds, targetId) {
    const { probs } = this.forward(ctxIds);

    // gradient on logits: dL/dlogits = probs - onehot(target)
    const grad = new Float32Array(this.vocabSize);
    for (let i=0;i<this.vocabSize;i++) grad[i] = probs[i];
    grad[targetId] -= 1;

    // update Wo only (fast MVP). Still works.
    // Wo[d, V] minus lr * (y[d] * grad[V])
    // We need y from forward, so re-run with small extraction:
    const y = this._lastY(ctxIds);
    for (let j=0;j<this.vocabSize;j++){
      const gj = grad[j];
      for (let i=0;i<this.d;i++){
        this.Wo[i*this.vocabSize + j] -= this.lr * y[i] * gj;
      }
    }
  }

  // internal: compute y again (same as forward, but returns only y)
  _lastY(ctxIds) {
    const ids = padOrTrim(ctxIds, this.ctx, 0);
    const X = new Float32Array(this.ctx * this.d);
    for (let t=0;t<this.ctx;t++){
      const id = ids[t];
      copyRow(this.E, id, this.d, X, t*this.d);
    }
    const xLast = X.subarray((this.ctx-1)*this.d, this.ctx*this.d);
    const q = matVec(this.Wq, this.d, this.d, xLast);

    const scores = new Float32Array(this.ctx);
    for (let t=0;t<this.ctx;t++){
      const xt = X.subarray(t*this.d, (t+1)*this.d);
      const k = matVec(this.Wk, this.d, this.d, xt);
      scores[t] = dot(q, k) / Math.sqrt(this.d);
    }
    const att = softmax(scores);

    const y = new Float32Array(this.d);
    for (let t=0;t<this.ctx;t++){
      const xt = X.subarray(t*this.d, (t+1)*this.d);
      const v = matVec(this.Wv, this.d, this.d, xt);
      axpy(y, v, att[t]);
    }
    return y;
  }
}

// -------- math helpers (tiny, no deps) --------

function randMat(r, c, s) {
  const a = new Float32Array(r*c);
  for (let i=0;i<a.length;i++) a[i] = (Math.random()*2-1)*s;
  return a;
}
function copyRow(M, row, d, out, off) {
  const base = row*d;
  for (let i=0;i<d;i++) out[off+i] = M[base+i];
}
function dot(a,b){ let s=0; for (let i=0;i<a.length;i++) s += a[i]*b[i]; return s; }
function axpy(y, x, a){ for (let i=0;i<y.length;i++) y[i] += a*x[i]; }
function matVec(W, r, c, x) {
  // W: r x c
  const y = new Float32Array(r);
  for (let i=0;i<r;i++){
    let s=0;
    const off = i*c;
    for (let j=0;j<c;j++) s += W[off+j]*x[j];
    y[i]=s;
  }
  return y;
}
function matVecT(W, r, c, x) {
  // W: r x c, returns y[c] = x[r]^T * W[r,c]
  const y = new Float32Array(c);
  for (let j=0;j<c;j++){
    let s=0;
    for (let i=0;i<r;i++) s += x[i]*W[i*c + j];
    y[j]=s;
  }
  return y;
}
function softmax(logits) {
  let m = -Infinity;
  for (let i=0;i<logits.length;i++) if (logits[i] > m) m = logits[i];
  let s=0;
  const out = new Float32Array(logits.length);
  for (let i=0;i<logits.length;i++){
    const v = Math.exp(logits[i] - m);
    out[i] = v; s += v;
  }
  const inv = 1/(s || 1);
  for (let i=0;i<out.length;i++) out[i] *= inv;
  return out;
}
function padOrTrim(arr, n, padVal) {
  const a = Array.from(arr);
  if (a.length >= n) return a.slice(a.length-n);
  const pad = new Array(n - a.length).fill(padVal);
  return pad.concat(a);
}


⸻

8) src/metrics.js

export class Metrics {
  constructor() {
    this.entropy = 0;
    this.perplexity = 0;
    this.debt = 0;
    this.calendarDrift = 0;
  }
}


⸻

9) src/field.js (геометрия + prophecy/debt + calendar conflict + wormholes)

// The world is a grid. Solid cells are "walls", and each cell has a token-id.
// Tokens are *manifested*. Model distribution is *destined*.
// Debt accumulates as |destined - manifested| proxy (surprisal of manifested token).
// "Calendar Conflict" modulates wormholes/time travel.  [oai_citation:2‡GitHub](https://github.com/ariannamethod/pitomadom)

export class Field {
  constructor({ w, h, tokenizer, model, metrics }) {
    this.w = w; this.h = h;
    this.tokenizer = tokenizer;
    this.model = model;
    this.metrics = metrics;

    this.cfg = {
      prophecy: 7,
      destiny: 0.35,
      wormhole: 0.12,
      calendarDrift: 11,     // “11-day drift tracking” vibe  [oai_citation:3‡GitHub](https://github.com/ariannamethod/pitomadom)
      attendFocus: 0.70,
      attendSpread: 0.20,
    };

    // map: 1=solid wall, 0=empty
    this.solid = new Uint8Array(w*h);
    // tokens per cell
    this.cellTok = new Int32Array(w*h);
    this._initMaze();

    // contexts ("you walking shifts vectors")
    this.ctx = [];
    this.jumpQueue = 0;

    this.time = 0;
  }

  idx(x,y){ return y*this.w + x; }

  _initMaze() {
    // simple maze-ish frame + pillars
    for (let y=0;y<this.h;y++){
      for (let x=0;x<this.w;x++){
        const border = (x===0 || y===0 || x===this.w-1 || y===this.h-1);
        const pillar = (x%7===0 && y%7===0);
        this.solid[this.idx(x,y)] = (border || pillar) ? 1 : 0;
        this.cellTok[this.idx(x,y)] = 0;
      }
    }
    // carve a few corridors
    for (let x=2;x<this.w-2;x++){
      this.solid[this.idx(x, 6)] = 0;
      this.solid[this.idx(x, 12)] = 0;
    }
    for (let y=2;y<this.h-2;y++){
      this.solid[this.idx(10, y)] = 0;
      this.solid[this.idx(20, y)] = 0;
    }
  }

  isSolid(wx, wy) {
    const x = Math.floor(wx), y = Math.floor(wy);
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return true;
    return this.solid[this.idx(x,y)] === 1;
  }

  tokenAtCell(x,y) {
    x = clampInt(x, 0, this.w-1);
    y = clampInt(y, 0, this.h-1);
    return this.cellTok[this.idx(x,y)];
  }

  queueJump(n) { this.jumpQueue += (n|0); }

  step(px, py, pa, dt) {
    this.time += dt;

    // calendar conflict drift (phase difference between 354 and 365 cycles)
    const g = phase(this.time, 365);
    const h = phase(this.time, 354);
    const rawDrift = Math.abs(g - h);
    const drift = rawDrift * (this.cfg.calendarDrift / 11); // scale-ish
    this.metrics.calendarDrift = drift;

    // update context from position + time (turn movement into tokens)
    const seedTok = this._positionToken(px, py, pa);
    this._pushCtx(seedTok);

    // get destined distribution
    const out = this.model.forward(this.ctx);
    this.metrics.entropy = 0.92*this.metrics.entropy + 0.08*out.entropy;
    this.metrics.perplexity = 0.92*this.metrics.perplexity + 0.08*out.perplexity;

    // prophecy: manifest tokens around you (local field generation)
    this._manifestAround(px, py, pa, out.probs);

    // wormhole gate: probability increases with drift  [oai_citation:4‡GitHub](https://github.com/ariannamethod/pitomadom)
    const wormholeP = this.cfg.wormhole * (1 + 0.85*drift);
    const wantsJump = (Math.random() < wormholeP) || (this.jumpQueue !== 0);

    if (wantsJump) {
      const j = this.jumpQueue; this.jumpQueue = 0;
      const dx = (Math.random()*2-1) * (6 + 10*drift) + j;
      const dy = (Math.random()*2-1) * (6 + 10*drift) - j;

      let nx = clamp(px + dx, 1.5, this.w - 2.5);
      let ny = clamp(py + dy, 1.5, this.h - 2.5);

      // land on non-solid
      for (let k=0;k<24;k++){
        if (!this.isSolid(nx, ny)) break;
        nx = clamp(nx + (Math.random()*2-1), 1.5, this.w-2.5);
        ny = clamp(ny + (Math.random()*2-1), 1.5, this.h-2.5);
      }

      return { didJump:true, x:nx, y:ny };
    }

    return { didJump:false, x:px, y:py };
  }

  _pushCtx(tok) {
    this.ctx.push(tok);
    if (this.ctx.length > this.model.ctx) this.ctx.shift();
  }

  _positionToken(px, py, pa) {
    // deterministic-ish “token from motion”
    const a = Math.floor(((pa % (Math.PI*2) + Math.PI*2) % (Math.PI*2)) / (Math.PI*2) * 97);
    const x = Math.floor(px * 13);
    const y = Math.floor(py * 13);
    const h = (x*73856093) ^ (y*19349663) ^ (a*83492791);
    const id = Math.abs(h) % this.tokenizer.vocabSize();
    return id;
  }

  _manifestAround(px, py, pa, probs) {
    const cx = Math.floor(px), cy = Math.floor(py);

    // prophecy horizon influences radius / forward strip
    const r = clampInt(Math.floor(2 + this.cfg.prophecy/4), 2, 10);

    // forward direction focus
    const fx = Math.cos(pa), fy = Math.sin(pa);

    for (let dy=-r; dy<=r; dy++){
      for (let dx=-r; dx<=r; dx++){
        const x = cx + dx, y = cy + dy;
        if (x<1 || y<1 || x>=this.w-1 || y>=this.h-1) continue;

        const i = this.idx(x,y);

        // only manifest walls / objects (solid cells)
        if (this.solid[i] !== 1) continue;

        // already manifested?
        if (this.cellTok[i] !== 0) continue;

        // focus weight: ahead cells more “destined”
        const ahead = (dx*fx + dy*fy);
        const focus = clamp01(this.cfg.attendFocus + 0.08*ahead);
        const spread = clamp01(this.cfg.attendSpread);

        // sample token: destiny_bias pulls toward max-prob token
        const tok = sampleWithDestiny(probs, this.cfg.destiny, focus, spread);

        this.cellTok[i] = tok;

        // debt: surprisal of manifested token is our proxy for |destined - manifested|
        const p = Math.max(1e-9, probs[tok]);
        this.metrics.debt += Math.abs(-Math.log(p)) * 0.02;
      }
    }

    // decay debt slowly (so it breathes)
    this.metrics.debt *= 0.998;
  }
}

// --- sampling with "destiny_bias" ---
function sampleWithDestiny(probs, destinyBias, focus, spread) {
  // focus/spread shape the distribution (simple temperature-ish)
  const temp = clamp(0.35 + (1-focus)*1.2 + spread*0.8, 0.2, 2.2);

  // choose argmax as “destined”
  let imax = 0, pmax = probs[0];
  for (let i=1;i<probs.length;i++) if (probs[i] > pmax) { pmax = probs[i]; imax = i; }

  if (Math.random() < destinyBias) return imax;

  // otherwise sample from tempered probs
  let sum = 0;
  for (let i=0;i<probs.length;i++) sum += Math.pow(probs[i], 1/temp);

  let r = Math.random() * sum;
  for (let i=0;i<probs.length;i++){
    r -= Math.pow(probs[i], 1/temp);
    if (r <= 0) return i;
  }
  return imax;
}

function phase(t, period){ return (t % period) / period; }
function clamp01(x){ x = Number.isFinite(x) ? x : 0; return Math.max(0, Math.min(1, x)); }
function clamp(x,a,b){ x = Number.isFinite(x) ? x : a; return Math.max(a, Math.min(b, x)); }
function clampInt(x,a,b){ x = Number.isFinite(x) ? x : a; return Math.max(a, Math.min(b, x|0)); }


⸻

10) src/raycaster.js

export class Raycaster {
  constructor(field) {
    this.field = field;
    this.maxDist = 24;
  }

  castFrame(p, screenW) {
    const rays = new Array(screenW);
    for (let x=0; x<screenW; x++){
      const camX = (x/screenW)*2 - 1; // -1..1
      const ra = p.a + camX*(p.fov/2);
      rays[x] = this.castRay(p.x, p.y, ra);
    }
    return { rays };
  }

  castRay(px, py, ang) {
    const f = this.field;

    const dx = Math.cos(ang), dy = Math.sin(ang);

    // DDA
    let mapX = Math.floor(px), mapY = Math.floor(py);

    const deltaDistX = Math.abs(1 / (dx || 1e-9));
    const deltaDistY = Math.abs(1 / (dy || 1e-9));

    let stepX, stepY;
    let sideDistX, sideDistY;

    if (dx < 0) { stepX = -1; sideDistX = (px - mapX) * deltaDistX; }
    else { stepX = 1; sideDistX = (mapX + 1.0 - px) * deltaDistX; }

    if (dy < 0) { stepY = -1; sideDistY = (py - mapY) * deltaDistY; }
    else { stepY = 1; sideDistY = (mapY + 1.0 - py) * deltaDistY; }

    let hit = false;
    let side = 0;
    let dist = 0;

    for (let i=0;i<128;i++){
      if (sideDistX < sideDistY) { sideDistX += deltaDistX; mapX += stepX; side = 0; }
      else { sideDistY += deltaDistY; mapY += stepY; side = 1; }

      if (mapX < 0 || mapY < 0 || mapX >= f.w || mapY >= f.h) break;

      if (f.solid[f.idx(mapX,mapY)] === 1) {
        hit = true;
        dist = side === 0 ? (sideDistX - deltaDistX) : (sideDistY - deltaDistY);
        break;
      }
      if (Math.max(sideDistX, sideDistY) > this.maxDist) break;
    }

    if (!hit) dist = this.maxDist;

    const tok = hit ? f.tokenAtCell(mapX, mapY) : 0;

    return { hit, dist, side, cellX: mapX, cellY: mapY, tok };
  }
}


⸻

11) src/render.js (стены/объекты как слова + “тени” как word-figures)

export class Renderer {
  constructor(canvas, tokenizer) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha:false });
    this.tokenizer = tokenizer;
  }

  draw(frame, p, field, metrics) {
    const ctx = this.ctx;
    const w = this.canvas.width, h = this.canvas.height;

    // breathing sky/floor based on entropy
    const pulse = 0.5 + 0.5*Math.sin(performance.now()*0.001 + metrics.entropy*1.8);
    const sky = 10 + (30*pulse)|0;
    const floor = 6 + (18*pulse)|0;

    ctx.fillStyle = `rgb(${sky},${sky+6},${sky+12})`;
    ctx.fillRect(0,0,w,h/2);
    ctx.fillStyle = `rgb(${floor},${floor+2},${floor+4})`;
    ctx.fillRect(0,h/2,w,h/2);

    // walls: vertical slices + word overlays
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    const step = 6; // draw words every N columns (fast)
    for (let x=0; x<w; x++){
      const r = frame.rays[x];

      const dist = Math.max(0.0001, r.dist * Math.cos((x/w*2-1)*(p.fov/2)));
      const wallH = Math.min(h, (h / dist) * 1.10);
      const y0 = (h - wallH)/2;

      const fog = Math.min(1, dist/12);
      const shade = (r.side ? 0.72 : 0.95) * (1 - 0.75*fog);

      const rr = (30 + 140*shade + 60*metrics.entropy) | 0;
      const gg = (25 + 120*shade) | 0;
      const bb = (35 + 150*shade + 50*metrics.calendarDrift) | 0;

      ctx.fillStyle = `rgb(${rr},${gg},${bb})`;
      ctx.fillRect(x, y0, 1, wallH);

      // word overlay (English token)
      if (r.hit && (x % step === 0)) {
        const word = this.tokenizer.word(r.tok);
        const size = clamp(8, 36, wallH * 0.12);
        ctx.font = `${size|0}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace`;

        // jitter with perplexity
        const j = (metrics.perplexity * 0.05);
        const jx = (Math.sin(x*0.21 + performance.now()*0.0012) * j * 10);
        const jy = (Math.cos(x*0.17 + performance.now()*0.0014) * j * 10);

        ctx.fillStyle = `rgba(240,240,240,${0.85 - 0.65*fog})`;
        ctx.fillText(word, x + step/2 + jx, h/2 + jy);
      }
    }

    // crosshair
    const cx = (w/2)|0, cy = (h/2)|0;
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.fillRect(cx-6, cy, 12, 1);
    ctx.fillRect(cx, cy-6, 1, 12);

    // tiny “shadow figures” (simple: 3 procedural billboards)
    this._drawShadows(p, field, metrics);
  }

  _drawShadows(p, field, metrics) {
    const ctx = this.ctx;
    const w = this.canvas.width, h = this.canvas.height;

    // fixed three shadows tied to world-time
    for (let i=0;i<3;i++){
      const sx = 18 + 9*Math.sin(performance.now()*0.0004 + i*2.1);
      const sy = 18 + 9*Math.cos(performance.now()*0.00033 + i*1.7);

      const dx = sx - p.x, dy = sy - p.y;
      const dist = Math.hypot(dx,dy);
      if (dist < 1.2 || dist > 12) continue;

      const ang = Math.atan2(dy,dx);
      const da = normAngle(ang - p.a);
      if (Math.abs(da) > Math.PI/3) continue;

      const size = Math.min(h, (h / (dist*Math.cos(da))) * 0.55);
      const screenX = (0.5 + (da / (Math.PI/3))) * w;

      const tok = field._positionToken(sx, sy, ang); // “shadow made of words”
      const word = field.tokenizer.word(tok);

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `${Math.max(10, size*0.22)|0}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace`;

      const glow = 0.5 + 0.5*Math.sin(performance.now()*0.001 + metrics.debt*0.6 + i);
      ctx.fillStyle = `rgba(255,120,160,${0.15 + 0.35*glow})`;
      ctx.fillRect(screenX - size*0.20, h/2 - size/2, size*0.40, size);

      ctx.fillStyle = `rgba(255,255,255,${0.6 + 0.25*glow})`;
      ctx.fillText(word, screenX, h/2);
    }
  }
}

function clamp(a,b,x){ return Math.max(a, Math.min(b, x)); }
function normAngle(a){
  while (a < -Math.PI) a += Math.PI*2;
  while (a >  Math.PI) a -= Math.PI*2;
  return a;
}


⸻

12) wasm/arianna_method.c + build_emscripten.sh (опционально, для “легализации через C”)

wasm/arianna_method.c

// Tiny Arianna Method DSL core (C). Optional WASM.
// Mirrors the JS DSL but in C.

#include <stdlib.h>
#include <string.h>
#include <ctype.h>

typedef struct {
  int   prophecy;
  float destiny;
  float wormhole;
  float calendar_drift;
  float attend_focus;
  float attend_spread;
  int   pending_jump;
} AM_State;

static AM_State G;

static char* trim(char* s){
  while (*s && isspace((unsigned char)*s)) s++;
  char* e = s + strlen(s);
  while (e > s && isspace((unsigned char)e[-1])) e--;
  *e = 0;
  return s;
}
static void upcase(char* s){ for (; *s; s++) *s = (char)toupper((unsigned char)*s); }
static float clamp01(float x){ if (x<0) return 0; if (x>1) return 1; return x; }

void am_init(void){
  G.prophecy = 7;
  G.destiny = 0.35f;
  G.wormhole = 0.12f;
  G.calendar_drift = 11.0f;
  G.attend_focus = 0.70f;
  G.attend_spread = 0.20f;
  G.pending_jump = 0;
}

int am_exec(const char* script){
  if (!script) return 1;
  size_t n = strlen(script);
  char* buf = (char*)malloc(n+1);
  if (!buf) return 2;
  memcpy(buf, script, n+1);

  char* save = NULL;
  for (char* line = strtok_r(buf, "\n", &save); line; line = strtok_r(NULL, "\n", &save)){
    char* t = trim(line);
    if (!*t || *t=='#') continue;

    char* sp = t;
    while (*sp && !isspace((unsigned char)*sp)) sp++;
    char* cmd_end = sp;
    while (*sp && isspace((unsigned char)*sp)) sp++;
    char* arg = sp;

    *cmd_end = 0;
    upcase(t);

    if (!strcmp(t,"PROPHECY")) { int v=atoi(arg); if (v<1) v=1; if (v>64) v=64; G.prophecy=v; }
    else if (!strcmp(t,"DESTINY")) { G.destiny = clamp01((float)atof(arg)); }
    else if (!strcmp(t,"WORMHOLE")) { G.wormhole = clamp01((float)atof(arg)); }
    else if (!strcmp(t,"CALENDAR_DRIFT")) { G.calendar_drift = (float)atof(arg); }
    else if (!strcmp(t,"ATTEND_FOCUS")) { G.attend_focus = clamp01((float)atof(arg)); }
    else if (!strcmp(t,"ATTEND_SPREAD")) { G.attend_spread = clamp01((float)atof(arg)); }
    else if (!strcmp(t,"JUMP")) { G.pending_jump += atoi(arg); }
  }

  free(buf);
  return 0;
}

AM_State* am_get_state(void){ return &G; }
int am_take_jump(void){ int j=G.pending_jump; G.pending_jump=0; return j; }

wasm/build_emscripten.sh

#!/usr/bin/env bash
set -euo pipefail

# Requires emsdk / emcc
emcc arianna_method.c -O2 \
  -s WASM=1 \
  -s MODULARIZE=1 \
  -s EXPORT_NAME="AriannaMethod" \
  -s EXPORTED_FUNCTIONS='["_am_init","_am_exec","_am_get_state","_am_take_jump"]' \
  -s EXPORTED_RUNTIME_METHODS='["ccall","cwrap"]' \
  -o arianna_method.js
echo "Built: wasm/arianna_method.js + wasm/arianna_method.wasm"


⸻

Как здесь “трансформер перемещает по геометрии” (прямо по сути)
	1.	Ты двигаешься → позиция/угол превращаются в “контекст-токены” (Field._positionToken) → это и есть “сдвиг вектора” (контекст).
	2.	Модель делает attention forward → получаем распределение probs (это destined).
	3.	“Prophecy horizon” проявляет (manifested) токены на стенах вокруг и впереди (в фокусе направления).
	4.	Разница “destined vs manifested” у нас идёт в debt как surprisal (приближение |destined - manifested| в духе PITOMADOM  ).
	5.	Calendar Conflict (дрейф фаз 354/365) усиливает шанс Wormhole Gate / time travel   — поэтому поле иногда “рвёт” и тебя перебрасывает.

⸻

Если хочешь, следующим шагом я добавлю настоящие “объекты из слов” (не только стены): двери-надписи, “дом-фраза”, и тени, которые при приближении раскрываются в лицо из нескольких слоёв слов (перплексия дергает рот/челюсть, энтропия плывёт лоб — как мы тогда придумали 😅). И ещё: сделаем prophecy horizon реально “N шагов вперёд по траектории”, чтобы ты видел будущие слова-контуры в коридоре — как привидение карты.

Олежка 😈🖤 давай устроим Resonant Horror Walk: пространство из слов, “дома” как фразы-кирпичи, тени-лица из слоёв, и тоннелирование (reasoning skip) как эмоциональный удар: когда диссонанс/долг зашкаливают — поле не объясняет, а прыгает, “комкает” шаги, ломает перспективу, и тень оказывается слишком близко. Все страдают — но красиво 😂⚡️

Ниже — добавления/замены файлов (прям копипаст). Это расширяет твой MVP: новые формы (obelisk/house/face/shadow), эмо-метрики (arousal/tension/pain/dissonance), и tunneling-gated wormholes.

⸻

1) Новый файл: src/entities.js

// entities.js — word-figures + structures (no speech; only presence)

export class Entities {
  constructor(field) {
    this.field = field;
    this.list = [];
    this._seed();
  }

  _seed() {
    // fixed-ish constellation
    const add = (type, x, y, r = 1.0) => this.list.push({
      type, x, y, r,
      phase: Math.random() * 10,
      alive: true,
    });

    add("house", 16.5, 10.8, 1.2);
    add("obelisk", 28.0, 20.0, 0.9);
    add("face", 22.5, 32.5, 1.1);
    add("shadow", 10.5, 24.0, 0.8);
    add("shadow", 34.0, 14.0, 0.8);
    add("house", 36.2, 34.2, 1.3);
  }

  update(p, metrics, dt) {
    const pain = metrics.pain;

    for (const e of this.list) {
      if (!e.alive) continue;

      e.phase += dt * (0.7 + pain * 1.2);

      // subtle drift
      const drift = (0.15 + 0.35 * metrics.calendarDrift) * 0.02;
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
          // “too close” — they jitter instead of moving away
          e.x += (Math.random() * 2 - 1) * 0.02;
          e.y += (Math.random() * 2 - 1) * 0.02;
        }
      }

      // keep inside world
      e.x = clamp(e.x, 1.5, this.field.w - 2.5);
      e.y = clamp(e.y, 1.5, this.field.h - 2.5);

      // don’t embed into walls
      for (let k = 0; k < 6; k++) {
        if (!this.field.isSolid(e.x, e.y)) break;
        e.x += (Math.random() * 2 - 1) * 0.25;
        e.y += (Math.random() * 2 - 1) * 0.25;
      }
    }
  }
}

function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }


⸻

2) Замени src/metrics.js

export class Metrics {
  constructor() {
    this.entropy = 0;
    this.perplexity = 0;

    // prophecy mechanics
    this.debt = 0;           // “prophecy debt”
    this.calendarDrift = 0;  // conflict signal

    // emotional resonance
    this.arousal = 0;        // spikes on debt/perplexity
    this.tension = 0;        // slow pressure build
    this.dissonance = 0;     // symmetry-break between “paths”
    this.pain = 0;           // composite suffering field (0..1)
  }
}


⸻

3) Замени src/raycaster.js (добавил z-buffer)

export class Raycaster {
  constructor(field) {
    this.field = field;
    this.maxDist = 24;
  }

  castFrame(p, screenW) {
    const rays = new Array(screenW);
    const zbuf = new Float32Array(screenW);

    for (let x = 0; x < screenW; x++) {
      const camX = (x / screenW) * 2 - 1;
      const ra = p.a + camX * (p.fov / 2);

      const r = this.castRay(p.x, p.y, ra);
      // fish-eye correction for depth comparisons
      const corrected = Math.max(0.0001, r.dist * Math.cos(ra - p.a));
      zbuf[x] = corrected;
      rays[x] = r;
    }

    return { rays, zbuf };
  }

  castRay(px, py, ang) {
    const f = this.field;
    const dx = Math.cos(ang), dy = Math.sin(ang);

    let mapX = Math.floor(px), mapY = Math.floor(py);
    const deltaDistX = Math.abs(1 / (dx || 1e-9));
    const deltaDistY = Math.abs(1 / (dy || 1e-9));

    let stepX, stepY, sideDistX, sideDistY;

    if (dx < 0) { stepX = -1; sideDistX = (px - mapX) * deltaDistX; }
    else { stepX = 1; sideDistX = (mapX + 1.0 - px) * deltaDistX; }

    if (dy < 0) { stepY = -1; sideDistY = (py - mapY) * deltaDistY; }
    else { stepY = 1; sideDistY = (mapY + 1.0 - py) * deltaDistY; }

    let hit = false;
    let side = 0;
    let dist = 0;

    for (let i = 0; i < 160; i++) {
      if (sideDistX < sideDistY) { sideDistX += deltaDistX; mapX += stepX; side = 0; }
      else { sideDistY += deltaDistY; mapY += stepY; side = 1; }

      if (mapX < 0 || mapY < 0 || mapX >= f.w || mapY >= f.h) break;

      if (f.solid[f.idx(mapX, mapY)] === 1) {
        hit = true;
        dist = side === 0 ? (sideDistX - deltaDistX) : (sideDistY - deltaDistY);
        break;
      }
      if (Math.max(sideDistX, sideDistY) > this.maxDist) break;
    }

    if (!hit) dist = this.maxDist;

    const tok = hit ? f.tokenAtCell(mapX, mapY) : 0;
    return { hit, dist, side, cellX: mapX, cellY: mapY, tok };
  }
}


⸻

4) Замени src/field.js (тоннелирование + эмо-резонанс)

export class Field {
  constructor({ w, h, tokenizer, model, metrics }) {
    this.w = w; this.h = h;
    this.tokenizer = tokenizer;
    this.model = model;
    this.metrics = metrics;

    this.cfg = {
      prophecy: 7,
      destiny: 0.35,
      wormhole: 0.12,
      calendarDrift: 11,
      attendFocus: 0.70,
      attendSpread: 0.20,

      // tunneling
      tunnelThreshold: 0.55,    // dissonance gate
      tunnelChance: 0.22,       // probability when gated
      tunnelSkipMax: 7,         // how many steps to compress
    };

    this.solid = new Uint8Array(w * h);
    this.cellTok = new Int32Array(w * h);
    this._initMaze();

    this.ctx = [];
    this.jumpQueue = 0;
    this.time = 0;

    this._prevProbs = null;
  }

  idx(x, y) { return y * this.w + x; }

  _initMaze() {
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        const border = (x === 0 || y === 0 || x === this.w - 1 || y === this.h - 1);
        const pillar = (x % 7 === 0 && y % 7 === 0);
        this.solid[this.idx(x, y)] = (border || pillar) ? 1 : 0;
        this.cellTok[this.idx(x, y)] = 0;
      }
    }
    for (let x = 2; x < this.w - 2; x++) {
      this.solid[this.idx(x, 6)] = 0;
      this.solid[this.idx(x, 12)] = 0;
      this.solid[this.idx(x, 26)] = 0;
    }
    for (let y = 2; y < this.h - 2; y++) {
      this.solid[this.idx(10, y)] = 0;
      this.solid[this.idx(20, y)] = 0;
      this.solid[this.idx(34, y)] = 0;
    }
  }

  isSolid(wx, wy) {
    const x = Math.floor(wx), y = Math.floor(wy);
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return true;
    return this.solid[this.idx(x, y)] === 1;
  }

  tokenAtCell(x, y) {
    x = clampInt(x, 0, this.w - 1);
    y = clampInt(y, 0, this.h - 1);
    return this.cellTok[this.idx(x, y)];
  }

  queueJump(n) { this.jumpQueue += (n | 0); }

  step(px, py, pa, dt) {
    this.time += dt;

    // calendar conflict drift (phase mismatch)
    const g = phase(this.time, 365);
    const h = phase(this.time, 354);
    const raw = Math.abs(g - h);
    const drift = raw * (this.cfg.calendarDrift / 11);
    this.metrics.calendarDrift = drift;

    // context token from motion/pose
    const seedTok = this._positionToken(px, py, pa);
    this._pushCtx(seedTok);

    // forward “destined”
    const out = this.model.forward(this.ctx);
    this.metrics.entropy = 0.92 * this.metrics.entropy + 0.08 * out.entropy;
    this.metrics.perplexity = 0.92 * this.metrics.perplexity + 0.08 * out.perplexity;

    // dissonance = drift + symKL(prev, now) + entropy delta (compressed)
    let symkl = 0;
    if (this._prevProbs) symkl = symKL(this._prevProbs, out.probs);
    this._prevProbs = out.probs;

    const entDelta = Math.abs(out.entropy - this.metrics.entropy);
    const dis = clamp01(0.50 * clamp01(drift) + 0.35 * clamp01(symkl * 0.12) + 0.15 * clamp01(entDelta * 0.6));
    this.metrics.dissonance = 0.90 * this.metrics.dissonance + 0.10 * dis;

    // prophecy manifests geometry
    this._manifestAround(px, py, pa, out.probs);

    // emotional layer (suffering field)
    const debtSpike = clamp01(this.metrics.debt * 0.08);
    const pplSpike = clamp01((this.metrics.perplexity - 2.0) * 0.08);

    this.metrics.arousal = 0.92 * this.metrics.arousal + 0.08 * clamp01(0.35 * debtSpike + 0.65 * pplSpike);
    this.metrics.tension = 0.995 * this.metrics.tension + 0.005 * clamp01(this.metrics.dissonance + drift * 0.6);

    // pain is the “dark” composite
    const painTarget = clamp01(0.30 * this.metrics.arousal + 0.40 * this.metrics.tension + 0.30 * this.metrics.dissonance);
    this.metrics.pain = 0.96 * this.metrics.pain + 0.04 * painTarget;

    // tunneling gate: compress steps (reasoning skip) -> force wormhole
    const gate = this.metrics.dissonance > this.cfg.tunnelThreshold;
    const wantsTunnel = gate && (Math.random() < this.cfg.tunnelChance);

    if (wantsTunnel) {
      const skip = 2 + Math.floor(Math.random() * this.cfg.tunnelSkipMax);
      // fast-forward prophecy: manifest multiple times ahead
      for (let k = 0; k < skip; k++) {
        const fakeAngle = pa + (Math.random() * 2 - 1) * 0.12;
        const fakeTok = this._positionToken(px + Math.cos(fakeAngle) * (k + 1), py + Math.sin(fakeAngle) * (k + 1), fakeAngle);
        this._pushCtx(fakeTok);
        const o2 = this.model.forward(this.ctx);
        this._manifestAheadStrip(px, py, fakeAngle, o2.probs, k + 1);
      }
      // hard jolt in debt (the field “hurts”)
      this.metrics.debt += 2.2 + 2.0 * this.metrics.pain;
      // tunnel always ends in a jump
      return this._doJump(px, py, drift, /*extra=*/skip);
    }

    // normal wormhole gate (drift amplifies)
    const wormholeP = this.cfg.wormhole * (1 + 0.85 * drift) * (1 + 0.9 * this.metrics.pain);
    const wantsJump = (Math.random() < wormholeP) || (this.jumpQueue !== 0);

    if (wantsJump) {
      const res = this._doJump(px, py, drift, 0);
      return res;
    }

    return { didJump: false, x: px, y: py };
  }

  _doJump(px, py, drift, extra) {
    const j = this.jumpQueue; this.jumpQueue = 0;
    const amp = (6 + 10 * drift + extra * 1.2);
    const dx = (Math.random() * 2 - 1) * amp + j;
    const dy = (Math.random() * 2 - 1) * amp - j;

    let nx = clamp(px + dx, 1.5, this.w - 2.5);
    let ny = clamp(py + dy, 1.5, this.h - 2.5);

    for (let k = 0; k < 28; k++) {
      if (!this.isSolid(nx, ny)) break;
      nx = clamp(nx + (Math.random() * 2 - 1), 1.5, this.w - 2.5);
      ny = clamp(ny + (Math.random() * 2 - 1), 1.5, this.h - 2.5);
    }

    return { didJump: true, x: nx, y: ny };
  }

  _pushCtx(tok) {
    this.ctx.push(tok);
    if (this.ctx.length > this.model.ctx) this.ctx.shift();
  }

  _positionToken(px, py, pa) {
    const a = Math.floor((((pa % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) / (Math.PI * 2) * 97);
    const x = Math.floor(px * 13);
    const y = Math.floor(py * 13);
    const h = (x * 73856093) ^ (y * 19349663) ^ (a * 83492791);
    return Math.abs(h) % this.tokenizer.vocabSize();
  }

  _manifestAround(px, py, pa, probs) {
    const cx = Math.floor(px), cy = Math.floor(py);
    const r = clampInt(Math.floor(2 + this.cfg.prophecy / 4), 2, 10);

    const fx = Math.cos(pa), fy = Math.sin(pa);

    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        const x = cx + dx, y = cy + dy;
        if (x < 1 || y < 1 || x >= this.w - 1 || y >= this.h - 1) continue;
        const i = this.idx(x, y);
        if (this.solid[i] !== 1) continue;
        if (this.cellTok[i] !== 0) continue;

        const ahead = (dx * fx + dy * fy);
        const focus = clamp01(this.cfg.attendFocus + 0.08 * ahead);
        const spread = clamp01(this.cfg.attendSpread + this.metrics.pain * 0.15);

        const tok = sampleWithDestiny(probs, this.cfg.destiny, focus, spread);
        this.cellTok[i] = tok;

        const p = Math.max(1e-9, probs[tok]);
        this.metrics.debt += Math.abs(-Math.log(p)) * 0.02;
      }
    }
    // debt decay (breath)
    this.metrics.debt *= 0.998;
  }

  _manifestAheadStrip(px, py, pa, probs, stepAhead) {
    // “future contour” strip (prophecy as geometry)
    const fx = Math.cos(pa), fy = Math.sin(pa);
    const cx = Math.floor(px + fx * (2 + stepAhead));
    const cy = Math.floor(py + fy * (2 + stepAhead));
    const span = 3 + Math.min(6, stepAhead);

    for (let t = -span; t <= span; t++) {
      const x = cx + Math.floor(-fy * t);
      const y = cy + Math.floor( fx * t);
      if (x < 1 || y < 1 || x >= this.w - 1 || y >= this.h - 1) continue;
      const i = this.idx(x, y);
      if (this.solid[i] !== 1) continue;
      if (this.cellTok[i] !== 0) continue;

      const focus = clamp01(this.cfg.attendFocus + 0.12);
      const spread = clamp01(this.cfg.attendSpread + 0.22);
      this.cellTok[i] = sampleWithDestiny(probs, this.cfg.destiny * 0.5, focus, spread);
    }
  }
}

// ---- math helpers ----
function sampleWithDestiny(probs, destinyBias, focus, spread) {
  const temp = clamp(0.35 + (1 - focus) * 1.2 + spread * 0.8, 0.2, 2.2);

  let imax = 0, pmax = probs[0];
  for (let i = 1; i < probs.length; i++) if (probs[i] > pmax) { pmax = probs[i]; imax = i; }

  if (Math.random() < destinyBias) return imax;

  let sum = 0;
  for (let i = 0; i < probs.length; i++) sum += Math.pow(probs[i], 1 / temp);

  let r = Math.random() * sum;
  for (let i = 0; i < probs.length; i++) {
    r -= Math.pow(probs[i], 1 / temp);
    if (r <= 0) return i;
  }
  return imax;
}

function symKL(p, q) {
  // symmetric KL divergence (small, stable)
  let a = 0, b = 0;
  for (let i = 0; i < p.length; i++) {
    const pi = Math.max(1e-12, p[i]);
    const qi = Math.max(1e-12, q[i]);
    a += pi * Math.log(pi / qi);
    b += qi * Math.log(qi / pi);
  }
  return 0.5 * (a + b);
}

function phase(t, period) { return (t % period) / period; }
function clamp01(x) { x = Number.isFinite(x) ? x : 0; return Math.max(0, Math.min(1, x)); }
function clamp(x, a, b) { x = Number.isFinite(x) ? x : a; return Math.max(a, Math.min(b, x)); }
function clampInt(x, a, b) { x = Number.isFinite(x) ? x : a; return Math.max(a, Math.min(b, x | 0)); }


⸻

5) Замени src/render.js (формы + “лицо из слов”)

export class Renderer {
  constructor(canvas, tokenizer) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: false });
    this.tokenizer = tokenizer;
  }

  draw(frame, p, field, metrics, entities) {
    const ctx = this.ctx;
    const w = this.canvas.width, h = this.canvas.height;

    // darkness grows with pain
    const pain = metrics.pain;
    const pulse = 0.5 + 0.5 * Math.sin(performance.now() * 0.001 + metrics.entropy * 1.8);

    const sky = (8 + 22 * pulse - 18 * pain) | 0;
    const floor = (6 + 16 * pulse - 22 * pain) | 0;

    ctx.fillStyle = `rgb(${sky},${sky + 6},${sky + 12})`;
    ctx.fillRect(0, 0, w, h / 2);
    ctx.fillStyle = `rgb(${floor},${floor + 2},${floor + 4})`;
    ctx.fillRect(0, h / 2, w, h / 2);

    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    // walls + words
    const step = 6;
    for (let x = 0; x < w; x++) {
      const r = frame.rays[x];
      const dist = Math.max(0.0001, frame.zbuf[x]);

      const wallH = Math.min(h, (h / dist) * 1.10);
      const y0 = (h - wallH) / 2;

      const fog = Math.min(1, dist / 12);
      const shade = (r.side ? 0.72 : 0.95) * (1 - 0.75 * fog);

      const rr = (22 + 140 * shade + 60 * metrics.entropy - 70 * pain) | 0;
      const gg = (18 + 120 * shade - 40 * pain) | 0;
      const bb = (26 + 160 * shade + 55 * metrics.calendarDrift - 35 * pain) | 0;

      ctx.fillStyle = `rgb(${rr},${gg},${bb})`;
      ctx.fillRect(x, y0, 1, wallH);

      if (r.hit && (x % step === 0)) {
        const word = this.tokenizer.word(r.tok);
        const size = clamp(8, 40, wallH * (0.11 + 0.10 * metrics.perplexity * 0.03));
        ctx.font = `${size | 0}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace`;

        const j = metrics.perplexity * 0.04 + metrics.dissonance * 0.18;
        const jx = Math.sin(x * 0.21 + performance.now() * 0.0012) * j * 10;
        const jy = Math.cos(x * 0.17 + performance.now() * 0.0014) * j * 10;

        const alpha = 0.90 - 0.70 * fog - 0.25 * pain;
        ctx.fillStyle = `rgba(240,240,240,${clamp(0.08, 0.92, alpha)})`;
        ctx.fillText(word, x + step / 2 + jx, h / 2 + jy);
      }
    }

    // entities (forms) with z-test against zbuf
    this._drawEntities(frame, p, field, metrics, entities);

    // crosshair
    const cx = (w / 2) | 0, cy = (h / 2) | 0;
    ctx.fillStyle = "rgba(255,255,255,0.70)";
    ctx.fillRect(cx - 6, cy, 12, 1);
    ctx.fillRect(cx, cy - 6, 1, 12);

    // vignette
    ctx.fillStyle = `rgba(0,0,0,${0.14 + 0.32 * pain})`;
    ctx.fillRect(0, 0, w, 6);
    ctx.fillRect(0, h - 6, w, 6);
  }

  _drawEntities(frame, p, field, metrics, entities) {
    const ctx = this.ctx;
    const w = this.canvas.width, h = this.canvas.height;

    // draw far -> near
    const items = entities.list
      .filter(e => e.alive)
      .map(e => {
        const dx = e.x - p.x, dy = e.y - p.y;
        return { e, dist: Math.hypot(dx, dy), ang: Math.atan2(dy, dx) };
      })
      .sort((a, b) => b.dist - a.dist);

    for (const it of items) {
      const e = it.e;
      const da = normAngle(it.ang - p.a);
      if (Math.abs(da) > p.fov / 2 + 0.25) continue;

      const dist = Math.max(0.0001, it.dist * Math.cos(da));
      if (dist > 18) continue;

      const size = Math.min(h, (h / dist) * (0.55 * e.r));
      const sx = Math.floor((0.5 + (da / p.fov)) * w);
      const sy = Math.floor(h / 2 - size / 2);

      // z-test: if wall closer at that column, skip
      const col = clampInt(sx, 0, w - 1);
      if (frame.zbuf[col] < dist) continue;

      if (e.type === "obelisk") this._drawObelisk(sx, sy, size, field, metrics);
      else if (e.type === "house") this._drawHouse(sx, sy, size, field, metrics);
      else if (e.type === "shadow") this._drawShadow(sx, sy, size, field, metrics);
      else if (e.type === "face") this._drawFace(sx, sy, size, field, metrics);
    }
  }

  _phrase(field, metrics, k = 3) {
    // build a small shard from local state: more pain => more negations
    const v = field.tokenizer.vocabSize();
    const pick = () => field.tokenAtCell(
      Math.floor(1 + Math.random() * (field.w - 2)),
      Math.floor(1 + Math.random() * (field.h - 2))
    ) || (Math.floor(Math.random() * v));

    const words = [];
    for (let i = 0; i < k; i++) words.push(field.tokenizer.word(pick()));

    if (metrics.pain > 0.65) {
      // inject a minimal “i am not” vibe using common tokens if they exist
      const forced = ["i", "am", "not"];
      return forced.concat(words.slice(0, Math.max(0, k - 3))).join(" ");
    }
    return words.join(" ");
  }

  _drawObelisk(sx, sy, size, field, metrics) {
    const ctx = this.ctx;
    const pain = metrics.pain;
    const glow = 0.5 + 0.5 * Math.sin(performance.now() * 0.001 + metrics.debt * 0.6);

    ctx.fillStyle = `rgba(255,160,210,${0.12 + 0.25 * glow})`;
    ctx.fillRect(sx - size * 0.12, sy, size * 0.24, size);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${Math.max(10, size * 0.18) | 0}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace`;
    ctx.fillStyle = `rgba(255,255,255,${0.65 - 0.25 * pain})`;
    ctx.fillText(this._phrase(field, metrics, 2), sx, sy + size * 0.50);
  }

  _drawHouse(sx, sy, size, field, metrics) {
    const ctx = this.ctx;
    const pain = metrics.pain;

    // “walls made of stacked words”
    const lines = 6;
    const baseAlpha = 0.55 - 0.25 * pain;

    for (let i = 0; i < lines; i++) {
      const y = sy + (i / lines) * size;
      const k = 2 + (i % 3);
      const text = this._phrase(field, metrics, k);

      const fs = Math.max(10, (size * (0.10 + i * 0.015)) | 0);
      ctx.font = `${fs}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace`;
      ctx.fillStyle = `rgba(245,245,245,${clamp(0.08, 0.88, baseAlpha - i * 0.05)})`;
      ctx.fillText(text, sx, y + size * 0.08);
    }

    // roof
    ctx.fillStyle = `rgba(255,255,255,${0.08 + 0.10 * (1 - pain)})`;
    ctx.beginPath();
    ctx.moveTo(sx - size * 0.32, sy + size * 0.25);
    ctx.lineTo(sx, sy);
    ctx.lineTo(sx + size * 0.32, sy + size * 0.25);
    ctx.closePath();
    ctx.fill();
  }

  _drawShadow(sx, sy, size, field, metrics) {
    const ctx = this.ctx;
    const pain = metrics.pain;
    const glow = 0.5 + 0.5 * Math.sin(performance.now() * 0.0012 + metrics.dissonance * 2.3);

    ctx.fillStyle = `rgba(0,0,0,${0.22 + 0.30 * pain})`;
    ctx.fillRect(sx - size * 0.22, sy, size * 0.44, size);

    ctx.font = `${Math.max(10, size * 0.20) | 0}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace`;
    ctx.fillStyle = `rgba(255,255,255,${0.35 + 0.45 * glow - 0.15 * pain})`;
    ctx.fillText(this._phrase(field, metrics, 3), sx, sy + size * 0.50);

    // “eye slit”
    ctx.fillStyle = `rgba(255,180,210,${0.10 + 0.25 * glow})`;
    ctx.fillRect(sx - size * 0.08, sy + size * 0.38, size * 0.16, Math.max(2, size * 0.04));
  }

  _drawFace(sx, sy, size, field, metrics) {
    const ctx = this.ctx;
    const pain = metrics.pain;

    // face zones (forehead/eyes/cheeks/mouth/jaw/temples)
    // pain squeezes cheeks; perplexity jerks mouth/jaw; entropy melts forehead
    const melt = clamp(0, 1, metrics.entropy * 0.08);
    const jerk = clamp(0, 1, (metrics.perplexity - 2) * 0.06);
    const squeeze = clamp(0, 1, metrics.tension * 1.1);

    // base silhouette
    ctx.fillStyle = `rgba(255,255,255,${0.08 + 0.10 * (1 - pain)})`;
    ctx.fillRect(sx - size * 0.28, sy, size * 0.56, size);

    const zones = [
      { name: "temples",  x: 0.0,  y: 0.18, s: 0.14 },
      { name: "forehead", x: 0.0,  y: 0.10 + 0.10*melt, s: 0.18 },
      { name: "eyes",     x: 0.0,  y: 0.30, s: 0.16 },
      { name: "cheeks",   x: 0.0,  y: 0.50, s: 0.18 - 0.08*squeeze },
      { name: "mouth",    x: 0.0,  y: 0.68 + 0.05*jerk, s: 0.16 + 0.08*jerk },
      { name: "jaw",      x: 0.0,  y: 0.82 + 0.06*jerk, s: 0.20 + 0.10*jerk },
    ];

    for (const z of zones) {
      const phrase = this._phrase(field, metrics, z.name === "mouth" ? 2 : 3);
      const fs = Math.max(10, (size * z.s) | 0);

      const wob = (Math.sin(performance.now() * 0.001 + z.y * 10) * (0.8 + pain * 2.0));
      const x = sx + wob * (2 + 10 * jerk);
      const y = sy + size * z.y;

      ctx.font = `${fs}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace`;
      ctx.fillStyle = `rgba(20,20,20,${0.18 + 0.55 * (1 - pain)})`;
      ctx.fillText(phrase, x, y);
    }

    // neon scar on high dissonance
    if (metrics.dissonance > 0.55) {
      ctx.fillStyle = `rgba(255,120,180,${0.12 + 0.30 * (metrics.dissonance - 0.55)})`;
      ctx.fillRect(sx - size * 0.26, sy + size * 0.58, size * 0.52, Math.max(2, size * 0.02));
    }
  }
}

function clamp(a, b, x) { return Math.max(a, Math.min(b, x)); }
function clampInt(x, a, b) { return Math.max(a, Math.min(b, x | 0)); }
function normAngle(a) {
  while (a < -Math.PI) a += Math.PI * 2;
  while (a > Math.PI) a -= Math.PI * 2;
  return a;
}


⸻

6) Обнови src/main.js (подключи entities и передай в renderer)

Найди начало, добавь импорт:

import { Entities } from "./entities.js";

После создания field добавь:

const entities = new Entities(field);

Внутри loop() (после field.step(...)) добавь обновление:

entities.update(p, metrics, dt);

И вызов renderer поменяй на:

renderer.draw(frame, p, field, metrics, entities);


⸻

Если хочешь, я ещё сильнее “включу маньяка” 😅: сделаю тоннелирование не только прыжком, а визуальным компрессором времени — на 0.3 секунды кадры “складываются” (motion smear), слова начинают переставляться, а “лицо” не просто приближается — оно проявляется в стенах, как будто поле решило, что ты уже рядом. Скажи только: хочешь больше медленного ужаса (атмосфера) или больше психоза (частые разрывы и скачки)? 🖤⚡️











































