#!/usr/bin/env node
/*
 * Verifica se todo caminho LOCAL usado no site existe de verdade.
 *
 *   node scripts/checar-links.mjs
 *
 * Lê todos os .html (menos templates/), mais os .css, e confere src, href, srcset,
 * imagesrcset, poster e url(...). Links externos (http, mailto, tel, wa.me) são listados
 * à parte, para conferência manual. Sai com código 1 se faltar algum arquivo.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IGNORAR = new Set(['templates', 'scripts', 'node_modules', '.git']);

async function listar(dir) {
  const saida = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (IGNORAR.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) saida.push(...await listar(p));
    else if (/\.(html|css)$/.test(e.name)) saida.push(p);
  }
  return saida;
}
const existe = async (p) => { try { await stat(p); return true; } catch { return false; } };

function refs(texto, ehCss) {
  const r = [];
  if (ehCss) {
    for (const m of texto.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) r.push(m[1]);
    return r;
  }
  const semJson = texto.replace(/<script type="application\/(ld\+)?json"[\s\S]*?<\/script>/g, '');
  for (const m of semJson.matchAll(/\s(?:src|href|poster)="([^"]+)"/g)) r.push(m[1]);
  for (const m of semJson.matchAll(/\s(?:srcset|imagesrcset)="([^"]+)"/g)) m[1].split(',').forEach((s) => r.push(s.trim().split(/\s+/)[0]));
  // Lista de vídeos do player de stories (JSON embutido)
  for (const m of texto.matchAll(/<script type="application\/json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try { for (const v of JSON.parse(m[1])) ['src', 'poster', 'url'].forEach((k) => v[k] && r.push(v[k])); } catch { /* ignora */ }
  }
  return r;
}

const arquivos = await listar(RAIZ);
const faltando = [];
const externos = new Set();
let total = 0;

for (const arq of arquivos) {
  const texto = await readFile(arq, 'utf8');
  const relArq = path.relative(RAIZ, arq).replace(/\\/g, '/');
  for (let ref of refs(texto, arq.endsWith('.css'))) {
    if (/^(https?:)?\/\//.test(ref) || /^(mailto|tel|data|javascript):/.test(ref)) { if (/^https?:/.test(ref)) externos.add(ref); continue; }
    if (ref.startsWith('#') || ref === '') continue;
    ref = decodeURI(ref.split('#')[0].split('?')[0]);
    if (!ref) continue;
    total++;
    // 404.html usa caminhos absolutos ("/"), resolvidos a partir da raiz do site
    let alvo = ref.startsWith('/') ? path.join(RAIZ, ref) : path.resolve(path.dirname(arq), ref);
    if (ref.endsWith('/') || (await existe(alvo) && (await stat(alvo)).isDirectory())) alvo = path.join(alvo, 'index.html');
    if (!alvo.startsWith(RAIZ)) { faltando.push(`${relArq} → ${ref} (aponta para fora do site)`); continue; }
    if (!(await existe(alvo))) faltando.push(`${relArq} → ${ref}`);
  }
}

console.log(`Arquivos verificados: ${arquivos.length} · referências locais: ${total}`);
console.log(`Links externos únicos (conferir à mão): ${externos.size}`);
for (const u of [...externos].sort()) console.log('   ', u.length > 110 ? u.slice(0, 107) + '…' : u);
if (faltando.length) {
  console.error(`\n✗ ${faltando.length} referência(s) quebrada(s):`);
  faltando.forEach((f) => console.error('   ', f));
  process.exit(1);
}
console.log('\n✓ Nenhuma imagem, vídeo, CSS, JS ou página local quebrada.');
