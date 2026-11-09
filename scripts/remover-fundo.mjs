#!/usr/bin/env node
/*
 * Remove o fundo BRANCO de fotos de produto (estúdio) e salva PNG transparente.
 *
 *   node scripts/remover-fundo.mjs entrada.jpg saida.png [tolerancia=22]
 *
 * Como funciona: preenche a partir das bordas tudo o que for quase branco e estiver
 * ligado à borda. Assim o branco DENTRO do produto (um pote branco, por exemplo) fica,
 * desde que tenha contorno. Precisa do ffmpeg no PATH; sem dependências de npm.
 */
import { spawnSync } from 'node:child_process';

const [entrada, saida, tolArg] = process.argv.slice(2);
if (!entrada || !saida) { console.error('uso: node scripts/remover-fundo.mjs entrada.jpg saida.png [tolerancia]'); process.exit(1); }
const TOL = Number(tolArg || 22);

const info = spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', entrada], { encoding: 'utf8' });
const [W, H] = info.stdout.trim().split(',').map(Number);
const raw = spawnSync('ffmpeg', ['-v', 'error', '-i', entrada, '-f', 'rawvideo', '-pix_fmt', 'rgba', '-'], { maxBuffer: 1 << 30 }).stdout;
if (!raw || raw.length !== W * H * 4) { console.error('não consegui ler a imagem'); process.exit(1); }

const quaseBranco = (i) => 255 - Math.min(raw[i], raw[i + 1], raw[i + 2]) <= TOL;
const fundo = new Uint8Array(W * H);
const fila = new Int32Array(W * H);
let ini = 0, fim = 0;
const semear = (p) => { if (!fundo[p] && quaseBranco(p * 4)) { fundo[p] = 1; fila[fim++] = p; } };
for (let x = 0; x < W; x++) { semear(x); semear((H - 1) * W + x); }
for (let y = 0; y < H; y++) { semear(y * W); semear(y * W + W - 1); }
while (ini < fim) {
  const p = fila[ini++], x = p % W, y = (p / W) | 0;
  if (x > 0) semear(p - 1); if (x < W - 1) semear(p + 1);
  if (y > 0) semear(p - W); if (y < H - 1) semear(p + W);
}

// Alfa: fundo = 0. Na borda do produto (vizinho do fundo), suaviza conforme o quão branco é o pixel.
for (let p = 0; p < W * H; p++) {
  const i = p * 4;
  if (fundo[p]) { raw[i + 3] = 0; continue; }
  const x = p % W, y = (p / W) | 0;
  const borda = (x > 0 && fundo[p - 1]) || (x < W - 1 && fundo[p + 1]) || (y > 0 && fundo[p - W]) || (y < H - 1 && fundo[p + W]);
  if (borda) {
    const claro = 255 - Math.min(raw[i], raw[i + 1], raw[i + 2]);
    raw[i + 3] = Math.max(60, Math.min(255, Math.round(claro * 6)));
  }
}

const out = spawnSync('ffmpeg', ['-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${H}`, '-i', '-', saida], { input: raw });
if (out.status !== 0) { console.error(String(out.stderr)); process.exit(1); }
console.log(`ok: ${saida} (${W}x${H}, ${Math.round(100 * fim / (W * H))}% de fundo removido)`);
