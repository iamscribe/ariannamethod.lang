// tokenizer.js — word-level tokenizer for ariannamethod.lang
// "words are the terrain, tokens are the coordinates"

export class Tokenizer {
  constructor({ maxVocab = 1024 } = {}) {
    this.maxVocab = maxVocab;
    this.word2id = new Map();
    this.id2word = [];
    this._unk = 0;
  }

  vocabSize() { 
    return this.id2word.length; 
  }

  buildFromText(text) {
    const words = (text.toLowerCase().match(/[a-z']+|[.?!,;:\-]/g) || []);
    const freq = new Map();
    for (const w of words) freq.set(w, (freq.get(w) || 0) + 1);

    const sorted = [...freq.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, this.maxVocab - 1);

    this.id2word = ["<unk>"];
    this.word2id = new Map([["<unk>", 0]]);
    
    for (const [w] of sorted) {
      this.word2id.set(w, this.id2word.length);
      this.id2word.push(w);
    }
    this._unk = 0;
  }

  encode(text) {
    const words = (text.toLowerCase().match(/[a-z']+|[.?!,;:\-]/g) || []);
    const out = new Int32Array(words.length);
    for (let i = 0; i < words.length; i++) {
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

  // presence pulse: how "present" is a token in current context
  // used for emergent processes
  presencePulse(id, contextIds) {
    let count = 0;
    for (const cid of contextIds) {
      if (cid === id) count++;
    }
    return count / Math.max(1, contextIds.length);
  }
}
