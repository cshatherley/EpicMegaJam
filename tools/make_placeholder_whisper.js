// Generates assets/audio/spark_whisper.wav: a ~1.1 s breathy placeholder for "Jamie. Hide."
// Three band-passed noise bursts shaped like the syllables "Ja-mie. Hide."
// Run with: node tools/make_placeholder_whisper.js
const fs = require('fs');
const path = require('path');

const RATE = 22050;
const LEN = Math.round(RATE * 1.15);
const out = new Float32Array(LEN);

// [start s, length s, centre Hz] per syllable
const syllables = [[0.02, 0.18, 1400], [0.22, 0.22, 1900], [0.62, 0.42, 1200]];

// Simple two-pole resonator so each syllable has its own "vowel" colour.
for (const [start, len, freq] of syllables) {
  const s0 = Math.round(start * RATE), n = Math.round(len * RATE);
  const r = 0.97, w = 2 * Math.PI * freq / RATE;
  const a1 = 2 * r * Math.cos(w), a2 = -r * r;
  let y1 = 0, y2 = 0;
  for (let i = 0; i < n && s0 + i < LEN; i++) {
    const t = i / n;
    const env = Math.sin(Math.PI * Math.min(1, t * 1.6)) ** 2 * (1 - t * 0.5);
    const x = (Math.random() * 2 - 1);
    const y = x * (1 - r) + a1 * y1 + a2 * y2;
    y2 = y1; y1 = y;
    out[s0 + i] += y * env * 6 + x * env * 0.08; // resonant body + a little air
  }
}

let peak = 0;
for (const v of out) peak = Math.max(peak, Math.abs(v));
const buf = Buffer.alloc(44 + LEN * 2);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + LEN * 2, 4); buf.write('WAVE', 8);
buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
buf.writeUInt32LE(RATE, 24); buf.writeUInt32LE(RATE * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
buf.write('data', 36); buf.writeUInt32LE(LEN * 2, 40);
for (let i = 0; i < LEN; i++) buf.writeInt16LE(Math.round(out[i] / peak * 0.8 * 32767), 44 + i * 2);

const file = path.join(__dirname, '..', 'assets', 'audio', 'spark_whisper.wav');
fs.writeFileSync(file, buf);
console.log('wrote', file, (LEN / RATE).toFixed(2) + ' s');
