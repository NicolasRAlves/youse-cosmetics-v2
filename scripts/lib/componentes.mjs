/*
 * Peças de HTML reutilizadas por todas as páginas (cabeçalho, rodapé, cards, ícones, fios em SVG).
 * Todas recebem `b` = prefixo relativo até a raiz do site ("", "../" ou "../../"),
 * para o site funcionar em qualquer pasta (GitHub Pages, Hostinger) e com duplo clique.
 */

export const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const EXT = 'target="_blank" rel="noopener"';

/* ---------------- Ícones (SVG inline, sem emoji) ---------------- */
const I = {
  seta: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  setaEsq: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  chevron: '<path d="M6 9l6 6 6-6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
  fechar: '<path d="M6 6l12 12M18 6L6 18"/>',
  play: '<path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>',
  pause: '<path d="M8 5h3v14H8zM13 5h3v14h-3z" fill="currentColor" stroke="none"/>',
  som: '<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12"/>',
  mudo: '<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M17 9l5 6M22 9l-5 6"/>',
  sacola: '<path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 016 0v2"/>',
  loja: '<path d="M4 9l1.5-5h13L20 9"/><path d="M4 9h16v2a3 3 0 01-5.3 2 3 3 0 01-5.4 0A3 3 0 014 11V9z"/><path d="M5.5 13.5V20h13v-6.5"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  relogio: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9.5 2.5h5"/>',
  gota: '<path d="M12 3s6 6.6 6 11a6 6 0 01-12 0c0-4.4 6-11 6-11z"/>',
  folha: '<path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z"/><path d="M5 19l7-7"/>',
  atomo: '<circle cx="12" cy="12" r="1.6"/><ellipse cx="12" cy="12" rx="9" ry="3.6"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)"/>',
  casa: '<path d="M4 11l8-6 8 6v9H4z"/><path d="M10 20v-5h4v5"/>',
  email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6l8.5 7 8.5-7"/>',
  fone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a1 1 0 01-1 1A16 16 0 014 5a1 1 0 011-1z"/>',
  pin: '<path d="M12 21s7-6.2 7-12a7 7 0 00-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  externo: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>',
  whatsapp: '<path fill="currentColor" stroke="none" d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.91-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.08-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.42.25-.7.25-1.29.18-1.41-.08-.13-.28-.2-.57-.35zM12.05 21.79h-.01a9.87 9.87 0 01-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 01-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 012.89 6.99c0 5.45-4.44 9.88-9.88 9.88zm8.41-18.3A11.82 11.82 0 0012.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 005.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.42z"/>',
  tiktok: '<path fill="currentColor" stroke="none" d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>',
  facebook: '<path fill="currentColor" stroke="none" d="M24 12.07C24 5.45 18.63.07 12 .07S0 5.45 0 12.07c0 5.99 4.39 10.95 10.13 11.85v-8.38H7.08v-3.47h3.05V9.43c0-3.01 1.79-4.67 4.53-4.67 1.31 0 2.69.24 2.69.24v2.95h-1.51c-1.49 0-1.96.93-1.96 1.87v2.25h3.33l-.53 3.47h-2.8v8.38C19.61 23.03 24 18.06 24 12.07z"/>'
};

export function icon(nome, classe = '') {
  return `<svg class="i ${classe}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${I[nome]}</svg>`;
}

/* ---------------- Imagens responsivas ---------------- */
export function picProduto(p, b, { sizes = '(min-width: 1000px) 30vw, 60vw', eager = false, classe = '', alt } = {}) {
  const base = `${b}assets/img/produtos/${p.img}`;
  const carga = eager ? 'fetchpriority="high"' : 'loading="lazy"';
  return `<picture class="${classe}"><source type="image/webp" srcset="${base}-300.webp 300w, ${base}-600.webp 600w, ${base}-1200.webp 1200w" sizes="${sizes}"><img src="${base}.png" width="800" height="800" alt="${esc(alt ?? p.alt)}" ${carga} decoding="async"></picture>`;
}

/* Fotos de ambiente da home: nome, largura/altura reais do JPG de fallback */
export const FOTOS = {
  'youliss-lancamento': { w: 1200, h: 1500, alt: 'Youliss sobre um pedestal com a palavra “Lançamento”, em cenário rosa com sombra de folhas de palmeira' },
  'quiabo-natural': { w: 1200, h: 1200, alt: 'Frasco do Quiabo Reestruturante entre quiabos frescos e gotas de gel sobre fundo verde-água' },
  'btx-quiabo': { w: 1200, h: 1200, alt: 'Vários potes do BTX Quiabo enfileirados em cenário claro' },
  'linha-completa': { w: 1024, h: 920, alt: 'Linha completa da Youse Cosmetics reunida sobre bancada de mármore, com espelho iluminado ao fundo' }
};
export function picFoto(nome, b, { sizes = '100vw', eager = false, classe = '', alt } = {}) {
  const f = FOTOS[nome];
  const base = `${b}assets/img/home/${nome}`;
  const grande = nome === 'linha-completa' ? '1024w' : '1200w';
  const carga = eager ? 'fetchpriority="high"' : 'loading="lazy"';
  return `<picture class="${classe}"><source type="image/webp" srcset="${base}-600.webp 600w, ${base}-1200.webp ${grande}" sizes="${sizes}"><img src="${base}.jpg" width="${f.w}" height="${f.h}" alt="${esc(alt ?? f.alt)}" ${carga} decoding="async"></picture>`;
}
export function picFrame(nome, alt, b, { classe = '', eager = false } = {}) {
  const base = `${b}assets/img/antes-depois/${nome}`;
  return `<picture class="${classe}"><source type="image/webp" srcset="${base}.webp"><img src="${base}.jpg" width="720" height="960" alt="${esc(alt)}" ${eager ? '' : 'loading="lazy"'} decoding="async"></picture>`;
}
export function picPoster(v, b, alt = '') {
  const base = `${b}assets/video/${v.poster}`;
  return `<picture><source type="image/webp" srcset="${base}.webp"><img src="${base}.jpg" width="540" height="960" alt="${esc(alt)}" loading="lazy" decoding="async"></picture>`;
}

/* Variáveis CSS de tema de um produto */
export function varsCor(p) {
  const t = p.tema;
  return `--cor:${t.cor};--cor-texto:${t.texto};--cor-tinta:${t.tinta};--cor-suave:${t.suave};--cor-profunda:${t.profunda};--cor2:${p.cor2 || t.texto}`;
}

/* ---------------- Assinatura: fios em SVG (frizz → liso espelhado) ---------------- */
function rng(seed) {
  return function () {
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const suave = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const r2 = (v) => Math.round(v * 2) / 2;
function curva(p) {
  let d = `M${r2(p[0][0])} ${r2(p[0][1])}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
    d += `C${r2(p1[0] + (p2[0] - p0[0]) / 6)} ${r2(p1[1] + (p2[1] - p0[1]) / 6)} ${r2(p2[0] - (p3[0] - p1[0]) / 6)} ${r2(p2[1] - (p3[1] - p1[1]) / 6)} ${r2(p2[0])} ${r2(p2[1])}`;
  }
  return d;
}
/**
 * Mechas que entram desalinhadas (frizz) pela esquerda e saem lisas e paralelas pela direita.
 * O brilho percorre algumas mechas em CSS (classe .fios__brilho), e para com prefers-reduced-motion.
 */
export function fios({ id = 'fios', n = 14, w = 1440, h = 420, seed = 7, classe = '', aperto = 0.24, centro = 0.5 } = {}) {
  const r = rng(seed);
  const linhas = [], brilhos = [];
  const passo = 48;
  for (let i = 0; i < n; i++) {
    const f = n === 1 ? 0.5 : i / (n - 1);
    const yL = h * 0.06 + h * 0.88 * f + (r() - 0.5) * h * 0.14;
    const yR = h * (centro - aperto / 2) + h * aperto * f;
    const amp = 12 + r() * 30, k1 = 0.010 + r() * 0.018, k2 = 0.03 + r() * 0.04, f1 = r() * 6.28, f2 = r() * 6.28;
    const pts = [];
    // Pontos densos onde há frizz (esquerda); espaçados onde a mecha já está lisa (direita).
    for (let x = -passo; x <= w + passo; x += x < w * 0.7 ? passo : passo * 3) {
      const s = suave(0.06, 0.74, x / w);
      const a = amp * Math.pow(1 - s, 1.4);
      pts.push([x, yL + (yR - yL) * s + a * (0.7 * Math.sin(x * k1 + f1) + 0.3 * Math.sin(x * k2 + f2)) + (1 - s) * (r() - 0.5) * 9]);
    }
    const sw = (0.7 + r() * 1.3).toFixed(2), op = (0.4 + r() * 0.6).toFixed(2);
    const d = curva(pts);
    linhas.push(`<path d="${d}" stroke-width="${sw}" opacity="${op}"/>`);
    // Brilho só em 1 de cada 3 mechas (path próprio, não <use>: bem mais leve para o navegador).
    if (i % 3 === 1) brilhos.push(`<path d="${d}" pathLength="1000" stroke-width="${sw}" style="animation-delay:-${(r() * 7).toFixed(2)}s"/>`);
  }
  return `<svg class="fios ${classe}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><defs><linearGradient id="${id}-g" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${w}" y2="0"><stop offset="0" stop-color="currentColor" stop-opacity=".2"/><stop offset=".55" stop-color="currentColor" stop-opacity=".5"/><stop offset="1" stop-color="currentColor" stop-opacity=".95"/></linearGradient></defs><g fill="none" stroke="url(#${id}-g)" stroke-linecap="round">${linhas.join('')}</g><g class="fios__brilho" fill="none" stroke-linecap="round">${brilhos.join('')}</g></svg>`;
}

/* ---------------- Partes de página ---------------- */
export function criar(Y) {
  const { site, whats, produtos, categorias } = Y;
  const ano = new Date().getFullYear();
  const porCat = (c) => produtos.filter((p) => p.categoria === c);

  function cabecalho(b) {
    const mega = categorias.map((c) => `
          <div class="mega__col">
            <p class="mega__titulo">${esc(c.nome)}</p>
            <ul class="mega__lista">${porCat(c.id).map((p) => `
              <li><a class="mega__item" href="${b}produtos/${p.slug}/" style="${varsCor(p)}">
                <span class="mega__thumb"><img src="${b}assets/img/produtos/${p.img}-300.webp" width="300" height="300" alt="" loading="lazy" decoding="async"></span>
                <span><span class="mega__nome">${esc(p.nome)}</span><span class="mega__tag">${esc(p.tag)}</span></span>
              </a></li>`).join('')}
            </ul>
          </div>`).join('');

    const gaveta = categorias.map((c) => `
        <details class="gaveta__grupo">
          <summary>${esc(c.nome)} ${icon('chevron')}</summary>
          <ul>${porCat(c.id).map((p) => `<li><a href="${b}produtos/${p.slug}/" style="${varsCor(p)}"><span class="ponto" aria-hidden="true"></span>${esc(p.nome)}</a></li>`).join('')}</ul>
        </details>`).join('');

    return `<a class="pular" href="#conteudo">Pular para o conteúdo</a>
<header class="topo" data-topo>
  <div class="topo__in container">
    <a class="topo__logo" href="${b || './'}" aria-label="Youse Cosmetics — página inicial">
      <picture><source type="image/webp" srcset="${b}assets/img/brand/logo.webp"><img src="${b}assets/img/brand/logo.png" width="480" height="164" alt="Youse Cosmetics"></picture>
    </a>
    <nav class="nav" aria-label="Principal">
      <ul class="nav__lista">
        <li class="nav__mega">
          <button class="nav__link" type="button" aria-expanded="false" aria-controls="mega" data-mega-btn>Produtos ${icon('chevron')}</button>
          <div class="mega" id="mega" hidden data-mega>
            <div class="mega__in container">${mega}
              <div class="mega__rodape">
                <a class="link-seta" href="${b}produtos/">Ver todos os produtos ${icon('seta')}</a>
                <a class="link-seta" href="${b || './'}#diagnostico">Não sabe qual escolher? Faça o diagnóstico ${icon('seta')}</a>
              </div>
            </div>
          </div>
        </li>
        <li><a class="nav__link" href="${b || './'}#diagnostico">Diagnóstico</a></li>
        <li><a class="nav__link" href="${b || './'}#resultados">Resultados</a></li>
        <li><a class="nav__link" href="${b}onde-comprar/">Onde comprar</a></li>
        <li><a class="nav__link" href="${b}seja-distribuidor/">Atacado</a></li>
        <li><a class="nav__link" href="#contato">Contato</a></li>
      </ul>
    </nav>
    <a class="btn btn--primario btn--sm topo__cta" href="${whats.distribuidor()}" ${EXT}>Seja distribuidor</a>
    <button class="topo__menu" type="button" aria-expanded="false" aria-controls="gaveta" aria-label="Abrir menu" data-gaveta-btn>${icon('menu')}</button>
  </div>
</header>
<div class="gaveta" id="gaveta" hidden data-gaveta role="dialog" aria-modal="true" aria-label="Menu">
  <div class="gaveta__topo">
    <span class="gaveta__marca">Menu</span>
    <button class="gaveta__fechar" type="button" aria-label="Fechar menu" data-gaveta-fechar>${icon('fechar')}</button>
  </div>
  <nav class="gaveta__nav" aria-label="Menu móvel">
    <a href="${b}produtos/">Todos os produtos</a>${gaveta}
    <a href="${b || './'}#diagnostico">Diagnóstico capilar</a>
    <a href="${b || './'}#resultados">Resultados</a>
    <a href="${b}onde-comprar/">Onde comprar</a>
    <a href="${b}seja-distribuidor/">Atacado e distribuidores</a>
    <a href="#contato">Contato</a>
  </nav>
  <a class="btn btn--primario btn--bloco" href="${whats.distribuidor()}" ${EXT}>Seja distribuidor ${icon('whatsapp')}</a>
</div>`;
  }

  function rodape(b) {
    const col = (c) => `<div><p class="rodape__titulo">${esc(c.nome)}</p><ul>${porCat(c.id).map((p) => `<li><a href="${b}produtos/${p.slug}/">${esc(p.nome)}</a></li>`).join('')}</ul></div>`;
    return `<footer class="rodape" id="contato">
  <div class="rodape__fecho container">
    <p class="rodape__frase">Encontre a sua <em>química</em> perfeita.</p>
    <a class="btn btn--primario" href="${b || './'}#diagnostico">Fazer meu diagnóstico ${icon('seta')}</a>
  </div>
  <div class="rodape__grade container">
    <div class="rodape__marca">
      <picture><source type="image/webp" srcset="${b}assets/img/brand/logo.webp"><img src="${b}assets/img/brand/logo.png" width="480" height="164" alt="Youse Cosmetics" loading="lazy"></picture>
      <p>${esc(site.sobre)}</p>
      <ul class="redes" aria-label="Redes sociais">
        <li><a href="${site.redes.instagram}" ${EXT} aria-label="Instagram da Youse Cosmetics">${icon('instagram')}</a></li>
        <li><a href="${site.redes.tiktok}" ${EXT} aria-label="TikTok da Youse Cosmetics">${icon('tiktok')}</a></li>
        <li><a href="${site.redes.facebook}" ${EXT} aria-label="Facebook da Youse Cosmetics">${icon('facebook')}</a></li>
      </ul>
    </div>
    <div>
      <p class="rodape__titulo">Fale conosco</p>
      <ul class="rodape__contato">
        <li><a href="mailto:${site.email}">${icon('email')} ${site.email}</a></li>
        <li><a href="${whats.geral()}" ${EXT}>${icon('whatsapp')} ${site.telefone}</a></li>
        <li><span>${icon('pin')} ${esc(site.endereco)}</span></li>
      </ul>
    </div>
    ${categorias.map(col).join('\n    ')}
    <div>
      <p class="rodape__titulo">Youse</p>
      <ul>
        <li><a href="${b}produtos/">Todos os produtos</a></li>
        <li><a href="${b || './'}#diagnostico">Diagnóstico capilar</a></li>
        <li><a href="${b || './'}#resultados">Resultados</a></li>
        <li><a href="${b}onde-comprar/">Onde comprar</a></li>
        <li><a href="${b}seja-distribuidor/">Seja distribuidor</a></li>
      </ul>
    </div>
  </div>
  <div class="rodape__base container">
    <p>© <span data-ano>${ano}</span> Youse Cosmetics®. Todos os direitos reservados.</p>
    <p>Echaporã, SP — Brasil</p>
  </div>
</footer>
<a class="wa-flutuante" href="${whats.geral()}" ${EXT} aria-label="Falar com a Youse no WhatsApp">${icon('whatsapp')}</a>`;
  }

  function cardProduto(p, b, { nivel = 'h3', sizes = '(min-width: 1100px) 300px, (min-width: 640px) 30vw, 46vw' } = {}) {
    return `<li class="card-p" data-cat="${p.categoria}" data-nec="${p.necessidades.join(' ')}" style="${varsCor(p)}" data-reveal>
  <a class="card-p__link" href="${b}produtos/${p.slug}/">
    <span class="card-p__media">${picProduto(p, b, { sizes })}</span>
    <span class="card-p__corpo">
      <span class="card-p__tag">${esc(p.tag)}${p.kit ? ' · Kit' : ''}</span>
      <${nivel} class="card-p__nome">${esc(p.nome)}</${nivel}>
      <span class="card-p__resumo">${esc(p.resumo)}</span>
      <span class="card-p__cta">Conhecer ${icon('seta')}</span>
    </span>
  </a>
</li>`;
  }

  function filtros(alvo) {
    const chip = (tipo, id, nome, ativo = false) => `<button type="button" class="chip" data-filtro="${tipo}:${id}" aria-pressed="${ativo}">${esc(nome)}</button>`;
    return `<div class="filtros" data-filtros="${alvo}" role="group" aria-label="Filtrar produtos">
  <div class="filtros__grupo"><span class="filtros__rotulo">Linha</span>${chip('todos', 'todos', 'Todos', true)}${Y.categorias.map((c) => chip('cat', c.id, c.nome)).join('')}</div>
  <div class="filtros__grupo"><span class="filtros__rotulo">Necessidade</span>${Y.necessidades.map((n) => chip('nec', n.id, n.nome)).join('')}</div>
</div>
<p class="filtros__status" aria-live="polite" data-filtros-status></p>`;
  }

  function lojas(b, { titulo = 'h3' } = {}) {
    return `<ul class="lojas">${site.lojas.map((l) => `
  <li class="loja" data-reveal>
    <span class="loja__rotulo">${icon('loja')} ${esc(l.rotulo)}</span>
    <${titulo} class="loja__nome">${esc(l.nome)}</${titulo}>
    <p>${esc(l.texto)}</p>
    <a class="btn btn--claro" href="${l.url}" ${EXT}>${esc(l.cta)} ${icon('externo')}</a>
  </li>`).join('')}
</ul>`;
  }

  /* Passo a passo de ritual (diagnóstico e página de produto) */
  function ritual(slugs, b, { atual = null } = {}) {
    return `<ol class="ritual">${slugs.map((s, i) => {
      const p = Y.porSlug[s];
      const aqui = s === atual;
      return `<li class="ritual__passo${aqui ? ' is-atual' : ''}" style="${varsCor(p)}">
    <span class="ritual__num">Passo ${i + 1}${aqui ? ' · <strong>você está aqui</strong>' : ''}</span>
    <a class="ritual__card" href="${b}produtos/${p.slug}/"${aqui ? ' aria-current="page"' : ''}>
      <span class="ritual__img">${picProduto(p, b, { sizes: '160px' })}</span>
      <span class="ritual__txt"><span class="ritual__nome">${esc(p.nome)}</span><span class="ritual__papel">${esc(p.papel)}</span><span class="ritual__ver">Ver produto ${icon('seta')}</span></span>
    </a>
  </li>`;
    }).join('')}</ol>`;
  }

  return { cabecalho, rodape, cardProduto, filtros, lojas, ritual, ano };
}
