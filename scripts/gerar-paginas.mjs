#!/usr/bin/env node
/*
 * Gera as páginas estáticas do site a partir de data/produtos.js + templates/.
 *
 *   node scripts/gerar-paginas.mjs
 *
 * Sem dependências. Gera: index.html, produtos/index.html, produtos/<slug>/index.html (12),
 * onde-comprar/index.html, seja-distribuidor/index.html e sitemap.xml.
 * As páginas geradas ficam na pasta e o site funciona sem build; rode de novo só quando
 * mudar os dados ou um template.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { esc, EXT, icon, picProduto, picFoto, picFrame, picPoster, varsCor, fios, criar } from './lib/componentes.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/* Carrega a fonte única de dados num contexto isolado (o mesmo arquivo roda no navegador). */
const ctx = {};
vm.createContext(ctx);
vm.runInContext(await readFile(path.join(RAIZ, 'data/produtos.js'), 'utf8'), ctx, { filename: 'data/produtos.js' });
const Y = ctx.YOUSE;
const { site, whats, produtos, porSlug, categorias } = Y;
const C = criar(Y);

/* ---------------- utilidades ---------------- */
async function tpl(nome) { return readFile(path.join(RAIZ, 'templates', nome), 'utf8'); }
function render(modelo, vars, nome) {
  return modelo.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, k) => {
    if (!(k in vars)) throw new Error(`Template ${nome}: variável {{${k}}} sem valor`);
    return vars[k];
  });
}
async function salvar(rel, html) {
  const destino = path.join(RAIZ, rel);
  await mkdir(path.dirname(destino), { recursive: true });
  await writeFile(destino, html, 'utf8');
  console.log('  ✓', rel);
}
const abs = (rel) => `${site.url}/${rel}`;
const jsonld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;
const catNome = (id) => categorias.find((c) => c.id === id).nome;

function head(b, { titulo, descricao, canonico, ogImg = 'assets/img/og/youse.jpg', ogTipo = 'website', cor = '#0A0A0A', extra = '', preload = '' }) {
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descricao)}">
<link rel="canonical" href="${abs(canonico)}">
<meta name="theme-color" content="${cor}">
<meta property="og:type" content="${ogTipo}">
<meta property="og:site_name" content="Youse Cosmetics">
<meta property="og:locale" content="pt_BR">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(descricao)}">
<meta property="og:url" content="${abs(canonico)}">
<meta property="og:image" content="${abs(ogImg)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${b}favicon.ico" sizes="48x48">
<link rel="icon" type="image/png" sizes="32x32" href="${b}assets/img/brand/favicon-32.png">
<link rel="apple-touch-icon" href="${b}apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..600;1,6..96,400..600&family=Inter:wght@400;500;600;700&display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..600;1,6..96,400..600&family=Inter:wght@400;500;600;700&display=swap"></noscript>
${preload}<link rel="stylesheet" href="${b}assets/css/base.css">
<link rel="stylesheet" href="${b}assets/css/components.css">
<link rel="stylesheet" href="${b}assets/css/pages.css">
<script>document.documentElement.classList.add('js')</script>
${extra}
</head>`;
}
const scripts = (b, lista) => ['main', ...lista].map((s) => `<script src="${b}assets/js/${s}.js" defer></script>`).join('\n');
const dados = (b) => `<script src="${b}data/produtos.js" defer></script>`;

const orgLd = {
  '@context': 'https://schema.org', '@type': 'Organization', name: 'Youse Cosmetics', url: site.url + '/',
  logo: abs('assets/img/brand/icon-512.png'), email: site.email, telephone: site.telefoneIntl,
  address: { '@type': 'PostalAddress', addressLocality: 'Echaporã', addressRegion: 'SP', addressCountry: 'BR' },
  sameAs: Object.values(site.redes)
};

/* ---------------- blocos da HOME ---------------- */
function blocoFaixaCromatica(b) {
  return `<nav class="faixa-cor" aria-label="A jornada cromática: um produto, uma cor">${produtos.map((p) =>
    `<a href="${b}produtos/${p.slug}/" style="${varsCor(p)}"><span class="sr">${esc(p.nome)}</span><span class="faixa-cor__nome" aria-hidden="true">${esc(p.nome)}</span></a>`).join('')}</nav>`;
}

function blocoStories(b) {
  return Y.videos.map((v, i) => {
    const p = porSlug[v.produto];
    return `<li data-reveal>
  <button class="story-card" type="button" data-story="${i}" data-src="${b}assets/video/${v.arquivo}" style="${varsCor(p)}" aria-label="Assistir: ${esc(v.titulo)} — ${esc(v.legenda)}">
    ${picPoster(v, b)}
    <span class="story-card__anel" aria-hidden="true"></span>
    <span class="story-card__play" aria-hidden="true">${icon('play')}</span>
    <span class="story-card__txt"><span class="story-card__titulo">${esc(v.titulo)}</span><span class="story-card__legenda">${esc(v.legenda)} · ${v.duracao}s</span></span>
  </button>
</li>`;
  }).join('\n');
}

function playerStories(b) {
  const lista = Y.videos.map((v) => {
    const p = porSlug[v.produto];
    return { src: `${b}assets/video/${v.arquivo}`, poster: `${b}assets/video/${v.poster}.jpg`, titulo: v.titulo, legenda: v.legenda, produto: p.nome, url: `${b}produtos/${p.slug}/`, cor: p.tema.cor };
  });
  return `<dialog class="stories" aria-label="Resultados em vídeo" data-stories>
  <div class="stories__palco">
    <div class="stories__barras" aria-hidden="true">${Y.videos.map(() => '<span><i></i></span>').join('')}</div>
    <div class="stories__topo">
      <span class="stories__marca"><img src="${b}assets/img/brand/icon-192.png" width="32" height="32" alt=""> <span data-st-titulo></span></span>
      <span class="stories__acoes">
        <button type="button" class="stories__btn" data-st-pausa aria-label="Pausar">${icon('pause')}</button>
        <button type="button" class="stories__btn" data-st-som aria-label="Ativar som">${icon('mudo')}</button>
        <button type="button" class="stories__btn" data-st-fechar aria-label="Fechar vídeos">${icon('fechar')}</button>
      </span>
    </div>
    <video class="stories__video" playsinline preload="none" data-st-video></video>
    <button type="button" class="stories__zona stories__zona--ant" data-st-ant aria-label="Vídeo anterior"></button>
    <button type="button" class="stories__zona stories__zona--prox" data-st-prox aria-label="Próximo vídeo"></button>
    <div class="stories__rodape">
      <p class="stories__legenda" data-st-legenda aria-live="polite"></p>
      <a class="btn btn--claro btn--sm" href="#" data-st-produto>Ver produto ${icon('seta')}</a>
    </div>
  </div>
  <button type="button" class="stories__seta stories__seta--ant" data-st-ant aria-label="Vídeo anterior">${icon('setaEsq')}</button>
  <button type="button" class="stories__seta stories__seta--prox" data-st-prox aria-label="Próximo vídeo">${icon('seta')}</button>
  <script type="application/json" data-st-lista>${JSON.stringify(lista).replace(/</g, '\\u003c')}</script>
</dialog>`;
}

function antesDepois(par, b, { eager = false } = {}) {
  return `<figure class="ad" data-ad style="--pos:50%">
  <div class="ad__palco">
    ${picFrame(par.depois, par.altDepois, b, { classe: 'ad__img ad__depois', eager })}
    ${picFrame(par.antes, par.altAntes, b, { classe: 'ad__img ad__antes', eager })}
    <span class="ad__rotulo ad__rotulo--antes" aria-hidden="true">Antes</span>
    <span class="ad__rotulo ad__rotulo--depois" aria-hidden="true">Depois</span>
    <span class="ad__linha" aria-hidden="true"><span class="ad__pega">${icon('setaEsq')}${icon('seta')}</span></span>
    <input class="ad__range" type="range" min="0" max="100" value="50" step="1" aria-label="Comparar antes e depois — ${esc(par.titulo)}. Mova para a esquerda para ver o depois." data-ad-range>
  </div>
  <figcaption>${esc(par.fonte)}. Resultados podem variar de pessoa para pessoa.</figcaption>
</figure>`;
}

function placeholderAntesDepois() {
  return `<figure class="ad ad--vazio">
  <div class="ad__palco ad__palco--vazio">
    <span class="ad__vazio">${icon('camera')}<strong>[FOTO ANTES — cliente]</strong></span>
    <span class="ad__vazio">${icon('camera')}<strong>[FOTO DEPOIS — cliente]</strong></span>
  </div>
  <figcaption>Espaço reservado para fotos reais de clientes, com autorização de uso de imagem.</figcaption>
</figure>`;
}

function blocoAntesDepoisHome(b) {
  const pares = Y.antesDepois.filter((par) => par.home !== false);
  const abas = pares.map((par, i) => `<button type="button" role="tab" class="aba" id="aba-${par.id}" aria-controls="painel-${par.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(par.titulo)}</button>`).join('');
  const paineis = pares.map((par, i) => {
    const p = porSlug[par.produto];
    return `<div class="ad-painel" role="tabpanel" id="painel-${par.id}" aria-labelledby="aba-${par.id}"${i ? ' hidden' : ''}>
      ${antesDepois(par, b)}
      <a class="link-seta" href="${b}produtos/${p.slug}/" style="${varsCor(p)}">Conhecer o ${esc(p.nome)} ${icon('seta')}</a>
    </div>`;
  }).join('');
  return `<div class="abas" role="tablist" aria-label="Escolha o resultado" data-abas>${abas}</div>${paineis}`;
}

function blocoDiagnostico(b) {
  const opcoes = Y.diagnostico.map((d, i) => `
      <label class="diag__opcao">
        <input type="radio" name="queixa" value="${d.id}" id="q-${d.id}">
        <span class="diag__opcao-in"><span class="diag__n">${String(i + 1).padStart(2, '0')}</span><span><strong>${esc(d.queixa)}</strong><small>${esc(d.detalhe)}</small></span></span>
      </label>`).join('');
  const resultados = Y.diagnostico.map((d) => {
    const nomes = d.ritual.map((s) => porSlug[s].nome);
    return `
    <div class="diag__res" data-res="${d.id}" tabindex="-1">
      <p class="eyebrow">Seu ritual Youse para</p>
      <h3 class="diag__res-titulo">${esc(d.queixa)}</h3>
      ${C.ritual(d.ritual, b)}
      <p class="diag__tempo">${icon('relogio')} ${esc(d.tempo)}</p>
      <div class="diag__acoes">
        <p class="diag__acoes-titulo">Comprar meu ritual</p>
        ${site.lojas.map((l) => `<a class="btn btn--primario" href="${l.url}" ${EXT}>${esc(l.cta)} ${icon('externo')}</a>`).join('\n        ')}
        <a class="btn btn--fantasma" href="${whats.ritual(nomes)}" ${EXT}>${icon('whatsapp')} Enviar meu ritual no WhatsApp</a>
      </div>
      <p class="diag__aviso">Esta é uma sugestão com base na queixa principal, não um diagnóstico profissional. Ficou com dúvida? <a href="${whats.ritual(nomes)}" ${EXT}>Fale com a Youse no WhatsApp</a>.</p>
    </div>`;
  }).join('');
  return `<div class="diag" data-diag>
    <fieldset class="diag__perguntas">
      <legend>Qual é a principal queixa do seu cabelo hoje?</legend>${opcoes}
    </fieldset>
    <div class="diag__resultados" aria-live="polite">
      <div class="diag__vazio">
        <p class="diag__vazio-num" aria-hidden="true">3</p>
        <p>Escolha uma opção e montamos um ritual de <strong>3 passos</strong> com os produtos Youse certos para o seu fio.</p>
      </div>${resultados}
    </div>
  </div>`;
}

function blocoIngredientes(b) {
  return Y.ingredientes.map((g) => `<li class="ingr" data-reveal>
    <h3 class="ingr__nome">${esc(g.nome)}</h3>
    <p>${esc(g.detalhe)}</p>
    <ul class="ingr__produtos" aria-label="Produtos com ${esc(g.nome)}">${g.produtos.map((s) => { const p = porSlug[s]; return `<li><a href="${b}produtos/${s}/" style="${varsCor(p)}"><span class="ponto" aria-hidden="true"></span>${esc(p.nome)}</a></li>`; }).join('')}</ul>
  </li>`).join('\n');
}

function blocoGaleria() {
  // Grade pronta para fotos de clientes. Para publicar uma foto, troque um <li class="ugc ugc--vazio"> por:
  // <li class="ugc" data-trat="liso"><img src="assets/img/clientes/arquivo.webp" alt="..." width="600" height="750" loading="lazy"></li>
  const vagas = [['liso', 'Liso'], ['reconstrucao', 'Reconstrução'], ['hidratacao', 'Hidratação'], ['liso', 'Liso'], ['nutricao', 'Nutrição'], ['finalizacao', 'Finalização']];
  return vagas.map(([id, nome]) => `<li class="ugc ugc--vazio" data-trat="${id}"><span>${icon('camera')}<strong>[FOTO DE CLIENTE]</strong><small>${nome}</small></span></li>`).join('\n');
}

/* ---------------- blocos da PÁGINA DE PRODUTO ---------------- */
function blocoPassos(p) {
  return p.passos.map((s, i) => `<li class="passo" data-reveal>
      <span class="passo__n" aria-hidden="true">${i + 1}</span>
      <div class="passo__corpo">
        <h3 class="passo__titulo">${esc(s.titulo)}${s.tempo ? ` <span class="chip-tempo">${s.timer ? icon('relogio') : ''}${esc(s.tempo)}</span>` : ''}</h3>
        <p>${esc(s.texto)}</p>
        ${s.timer ? `<div class="passo__timer" role="group" aria-label="Cronômetro de pausa">${s.timer.map((m) => `<button type="button" class="btn btn--contorno btn--sm" data-timer="${m}" data-timer-rotulo="${esc(p.nome)} · ${esc(s.titulo)}">${icon('relogio')} Iniciar ${m} min</button>`).join('')}</div>` : ''}
      </div>
    </li>`).join('\n    ');
}

function blocoResultadoProduto(p, b) {
  const partes = [];
  // Antes/depois primeiro (convence mais rápido no celular), vídeo depois.
  const ids = [].concat(p.antesDepois || []);
  const pares = ids.map((id) => Y.antesDepois.find((x) => x.id === id)).filter(Boolean);
  if (pares.length) pares.forEach((par) => partes.push(`<div class="resultado__ad" data-reveal>${antesDepois(par, b)}</div>`));
  else partes.push(`<div class="resultado__ad" data-reveal>${placeholderAntesDepois()}</div>`);
  if (p.video) {
    const v = Y.videos.find((x) => x.n === p.video);
    partes.push(`<figure class="video-produto" data-reveal>
      <video controls playsinline preload="none" poster="${b}assets/video/${v.poster}.jpg" width="720" height="1280" aria-label="Vídeo: ${esc(v.titulo)} — ${esc(v.legenda)}">
        <source src="${b}assets/video/${v.arquivo}" type="video/mp4">
        Seu navegador não reproduz vídeos. <a href="${b}assets/video/${v.arquivo}">Baixe o vídeo</a>.
      </video>
      <figcaption><strong>${esc(v.titulo)}</strong> · ${esc(v.legenda)}</figcaption>
    </figure>`);
  }
  return partes.join('\n    ');
}

function blocoFaq(p) {
  const itens = p.faq.map((f) => `<details class="faq__item"><summary>${esc(f.p)} ${icon('chevron')}</summary><p>${esc(f.r)}</p></details>`).join('\n      ');
  const pend = Y.faqPendente.map((q) => `    ${q}`).join('\n');
  return `${itens}
      <!-- Perguntas que dependem de informação da Youse (não publicadas):
${pend}
      -->`;
}

/* ---------------- montagem ---------------- */
async function gerarHome() {
  const b = '';
  const v = {
    head: head(b, {
      titulo: 'Youse Cosmetics · A jornada da sua transformação capilar',
      descricao: 'Tratamentos capilares com tecnologia e ingredientes naturais: efeito liso sem química agressiva, extrato de quiabo e Nano Active. Faça o diagnóstico e encontre o seu ritual.',
      canonico: '',
      preload: `<link rel="preload" as="image" type="image/webp" imagesrcset="assets/img/home/youliss-lancamento-600.webp 600w, assets/img/home/youliss-lancamento-1200.webp 1200w" imagesizes="(min-width: 900px) 40vw, 80vw">\n`,
      extra: jsonld(orgLd) + jsonld({ '@context': 'https://schema.org', '@type': 'WebSite', name: 'Youse Cosmetics', url: site.url + '/', inLanguage: 'pt-BR' })
    }),
    header: C.cabecalho(b),
    footer: C.rodape(b),
    scripts: [dados(b), scripts(b, ['stories', 'antes-depois', 'diagnostico'])].join('\n'),
    fios_hero: fios({ id: 'fh', n: 16, h: 520, seed: 11, centro: 0.55 }),
    fios_div: fios({ id: 'fd', n: 7, w: 1440, h: 120, seed: 3, aperto: 0.18, classe: 'fios--divisor' }),
    fios_div2: fios({ id: 'fd2', n: 7, w: 1440, h: 120, seed: 19, aperto: 0.18, classe: 'fios--divisor' }),
    hero_fotos: ['youliss-lancamento', 'quiabo-natural', 'btx-quiabo'].map((n, i) => picFoto(n, b, { sizes: '(min-width: 900px) 40vw, 80vw', eager: i === 0, classe: `hero__foto hero__foto--${i + 1}` })).join('\n          '),
    faixa_cromatica: blocoFaixaCromatica(b),
    stories: blocoStories(b),
    player: playerStories(b),
    antes_depois: blocoAntesDepoisHome(b),
    diagnostico: blocoDiagnostico(b),
    filtros: C.filtros('colecao'),
    colecao: produtos.map((p) => C.cardProduto(p, b)).join('\n'),
    foto_quiabo: picFoto('quiabo-natural', b, { sizes: '(min-width: 900px) 34vw, 90vw' }),
    ingredientes: blocoIngredientes(b),
    galeria: blocoGaleria(),
    hashtag: esc(site.hashtag),
    instagram: site.redes.instagram,
    instagram_user: site.instagramUser,
    foto_linha: picFoto('linha-completa', b, { sizes: '(min-width: 900px) 45vw, 100vw' }),
    wa_distribuidor: whats.distribuidor(),
    lojas: C.lojas(b),
    ext: EXT,
    i_seta: icon('seta'), i_play: icon('play'), i_wa: icon('whatsapp'), i_insta: icon('instagram'),
    i_gota: icon('gota'), i_folha: icon('folha'), i_atomo: icon('atomo'), i_casa: icon('casa')
  };
  await salvar('index.html', render(await tpl('home.html'), v, 'home.html'));
}

async function gerarProduto(p, modelo) {
  const b = '../../';
  const i = p.ordem;
  const ant = produtos[(i - 1 + produtos.length) % produtos.length];
  const prox = produtos[(i + 1) % produtos.length];
  const rel = `produtos/${p.slug}/`;
  const titulo = `${p.nomeCompleto} · ${p.tag} | Youse Cosmetics`;
  const ld = {
    '@context': 'https://schema.org', '@type': 'Product', name: p.nomeCompleto, description: p.descricao,
    image: [abs(`assets/img/produtos/${p.img}-1200.webp`), abs(`assets/img/og/${p.img}.jpg`)],
    brand: { '@type': 'Brand', name: 'Youse Cosmetics' }, category: catNome(p.categoria), url: abs(rel)
  };
  const migalhas = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site.url + '/' },
      { '@type': 'ListItem', position: 2, name: 'Produtos', item: abs('produtos/') },
      { '@type': 'ListItem', position: 3, name: catNome(p.categoria), item: abs(`produtos/?linha=${p.categoria}`) },
      { '@type': 'ListItem', position: 4, name: p.nome, item: abs(rel) }]
  };
  const v = {
    head: head(b, {
      titulo, descricao: `${p.nome}: ${p.resumo}`, canonico: rel, ogImg: `assets/img/og/${p.img}.jpg`, ogTipo: 'product', cor: p.cor,
      preload: `<link rel="preload" as="image" type="image/webp" imagesrcset="${b}assets/img/produtos/${p.img}-600.webp 600w, ${b}assets/img/produtos/${p.img}-1200.webp 1200w" imagesizes="(min-width: 900px) 45vw, 90vw">\n`,
      extra: jsonld(ld) + jsonld(migalhas)
    }),
    header: C.cabecalho(b),
    footer: C.rodape(b),
    scripts: scripts(b, ['produto', ...([].concat(p.antesDepois || []).length ? ['antes-depois'] : [])]),
    // Logo branco vira preto quando a cor do produto é clara (tinta escura).
    estilo_cor: varsCor(p) + (p.tema.tinta === '#0A0A0A' ? ';--logo-filtro:brightness(0)' : ''),
    b,
    slug: p.slug,
    categoria: esc(catNome(p.categoria)),
    categoria_id: p.categoria,
    nome: esc(p.nome),
    nome_completo: esc(p.nomeCompleto),
    tag: esc(p.tag),
    subtitulo: esc(p.subtitulo),
    resumo: esc(p.resumo),
    descricao: esc(p.descricao),
    kit: p.kit ? `<p class="p-hero__kit"><span>Kit com</span> ${p.kit.map((k) => `<span class="pill">${esc(k)}</span>`).join('')}</p>` : '',
    foto: picProduto(p, b, { sizes: '(min-width: 900px) 45vw, 90vw', eager: true, classe: 'p-hero__foto' }),
    fios: fios({ id: 'fp', n: 14, h: 600, seed: 5 + i, centro: 0.62, aperto: 0.2 }),
    fios_div: fios({ id: 'fpd', n: 7, w: 1440, h: 120, seed: 30 + i, aperto: 0.18, classe: 'fios--divisor' }),
    beneficios: p.beneficios.map((x) => `<li>${icon('check')}<span>${esc(x)}</span></li>`).join(''),
    ativos: p.ativos.map((a) => `<li class="ativo" data-reveal><h3>${esc(a.nome)}</h3><p>${esc(a.funcao)}</p></li>`).join('\n      '),
    passos: blocoPassos(p),
    resultado: blocoResultadoProduto(p, b),
    ritual: C.ritual(p.ritual, b, { atual: p.slug }),
    faq: blocoFaq(p),
    ml: site.lojas[0].url, dot: site.lojas[1].url,
    wa_produto: whats.produto(p.nome), wa_distribuidor: whats.distribuidor(),
    ant_url: `${b}produtos/${ant.slug}/`, ant_nome: esc(ant.nome), ant_cor: varsCor(ant),
    prox_url: `${b}produtos/${prox.slug}/`, prox_nome: esc(prox.nome), prox_cor: varsCor(prox),
    ext: EXT,
    i_seta: icon('seta'), i_seta_esq: icon('setaEsq'), i_wa: icon('whatsapp'), i_sacola: icon('sacola'), i_externo: icon('externo'), i_loja: icon('loja'), i_fechar: icon('fechar'), i_pause: icon('pause'), i_relogio: icon('relogio')
  };
  await salvar(`${rel}index.html`, render(modelo, v, 'produto.html'));
}

async function gerarCatalogo() {
  const b = '../';
  const v = {
    head: head(b, {
      titulo: 'Produtos · Tratamento, manutenção e finalização | Youse Cosmetics',
      descricao: 'Conheça os 12 produtos Youse Cosmetics: alinhadores sem química agressiva, reconstrução, hidratação, óleos e leave-in. Filtre por linha ou pela necessidade do seu cabelo.',
      canonico: 'produtos/', extra: jsonld({ '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: produtos.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`produtos/${p.slug}/`), name: p.nomeCompleto })) })
    }),
    header: C.cabecalho(b), footer: C.rodape(b), scripts: scripts(b, []),
    fios: fios({ id: 'fc', n: 12, h: 360, seed: 23, centro: 0.6 }),
    filtros: C.filtros('catalogo'),
    produtos: produtos.map((p) => C.cardProduto(p, b, { nivel: 'h2' })).join('\n'),
    i_seta: icon('seta')
  };
  await salvar('produtos/index.html', render(await tpl('catalogo.html'), v, 'catalogo.html'));
}

async function gerarOndeComprar() {
  const b = '../';
  const v = {
    head: head(b, { titulo: 'Onde comprar · Mercado Livre e Dot Cosméticos | Youse Cosmetics', descricao: 'Compre Youse Cosmetics na loja oficial do Mercado Livre ou na Dot Cosméticos. Tire dúvidas pelo WhatsApp (18) 99745-6435.', canonico: 'onde-comprar/' }),
    header: C.cabecalho(b), footer: C.rodape(b), scripts: scripts(b, []),
    fios: fios({ id: 'fo', n: 12, h: 360, seed: 41, centro: 0.6 }),
    lojas: C.lojas(b, { titulo: 'h2' }),
    foto_linha: picFoto('linha-completa', b, { sizes: '(min-width: 900px) 40vw, 100vw' }),
    wa_geral: whats.geral(), wa_distribuidor: whats.distribuidor(), telefone: site.telefone, ext: EXT,
    i_wa: icon('whatsapp'), i_seta: icon('seta')
  };
  await salvar('onde-comprar/index.html', render(await tpl('onde-comprar.html'), v, 'onde-comprar.html'));
}

async function gerarDistribuidor() {
  const b = '../';
  const linhas = categorias.map((c) => `<div class="linhas__grupo"><h3>${esc(c.nome)}</h3><ul class="linhas">${produtos.filter((p) => p.categoria === c.id).map((p) => `<li style="${varsCor(p)}"><a href="${b}produtos/${p.slug}/"><span class="linhas__img"><img src="${b}assets/img/produtos/${p.img}-300.webp" width="300" height="300" alt="" loading="lazy" decoding="async"></span><span><strong>${esc(p.nome)}</strong><small>${esc(p.tag)}${p.kit ? ' · Kit' : ''}</small></span></a></li>`).join('')}</ul></div>`).join('');
  const v = {
    head: head(b, { titulo: 'Seja distribuidor · Atacado para salões e lojas | Youse Cosmetics', descricao: 'Revenda Youse Cosmetics no seu salão ou loja: linha completa do tratamento à manutenção, com extrato de quiabo e tecnologia Nano Active. Fale com a equipe pelo WhatsApp.', canonico: 'seja-distribuidor/' }),
    header: C.cabecalho(b), footer: C.rodape(b), scripts: [dados(b), scripts(b, ['distribuidor'])].join('\n'),
    fios: fios({ id: 'fs', n: 14, h: 420, seed: 57, centro: 0.58 }),
    foto_linha: picFoto('linha-completa', b, { sizes: '(min-width: 900px) 45vw, 100vw', eager: true }),
    linhas, wa_distribuidor: whats.distribuidor(), ext: EXT,
    i_wa: icon('whatsapp'), i_seta: icon('seta'), i_gota: icon('gota'), i_folha: icon('folha'), i_atomo: icon('atomo'), i_casa: icon('casa'), i_loja: icon('loja'), i_play: icon('play')
  };
  await salvar('seja-distribuidor/index.html', render(await tpl('seja-distribuidor.html'), v, 'seja-distribuidor.html'));
}

async function gerarSitemap() {
  const hoje = new Date().toISOString().slice(0, 10);
  const urls = ['', 'produtos/', ...produtos.map((p) => `produtos/${p.slug}/`), 'onde-comprar/', 'seja-distribuidor/'];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${abs(u)}</loc><lastmod>${hoje}</lastmod><priority>${u === '' ? '1.0' : u.split('/').length > 2 ? '0.8' : '0.7'}</priority></url>`).join('\n')}
</urlset>
`;
  await salvar('sitemap.xml', xml);
  await salvar('robots.txt', `User-agent: *\nAllow: /\nDisallow: /templates/\nDisallow: /scripts/\n\nSitemap: ${abs('sitemap.xml')}\n`);
}

console.log('Gerando páginas da Youse Cosmetics…');
await gerarHome();
const modeloProduto = await tpl('produto.html');
for (const p of produtos) await gerarProduto(p, modeloProduto);
await gerarCatalogo();
await gerarOndeComprar();
await gerarDistribuidor();
await gerarSitemap();
console.log(`Pronto: ${produtos.length + 4} páginas + sitemap.xml + robots.txt`);
