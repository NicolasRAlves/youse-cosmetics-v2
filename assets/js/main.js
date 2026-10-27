/* Youse Cosmetics · v2 — comportamento comum a todas as páginas */
(function () {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. Aberto com duplo clique (file://): pastas não abrem o index.html sozinhas. */
  if (location.protocol === 'file:') {
    $$('a[href]').forEach((a) => {
      const href = a.getAttribute('href');
      if (/^(https?:|mailto:|tel:|#|data:)/.test(href)) return;
      const m = href.match(/^([^?#]*)(\?[^#]*)?(#.*)?$/);
      if (!m) return;
      let caminho = m[1];
      if (caminho === '' && !m[2]) return;
      if (caminho === '' || caminho.endsWith('/')) caminho += 'index.html';
      else if (caminho === '.' || caminho === '..') caminho += '/index.html';
      a.setAttribute('href', caminho + (m[2] || '') + (m[3] || ''));
    });
  }

  /* 2. Ano atual no rodapé */
  $$('[data-ano]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* 3. Cabeçalho compacto ao rolar */
  const topo = $('[data-topo]');
  if (topo) {
    const marcar = () => topo.classList.toggle('is-compacto', window.scrollY > 24);
    marcar();
    window.addEventListener('scroll', marcar, { passive: true });
  }

  /* 4. Mega-menu de produtos */
  const megaBtn = $('[data-mega-btn]');
  const mega = $('[data-mega]');
  if (megaBtn && mega) {
    const abrir = (sim) => {
      megaBtn.setAttribute('aria-expanded', String(sim));
      mega.hidden = !sim;
    };
    megaBtn.addEventListener('click', () => abrir(mega.hidden));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mega.hidden) { abrir(false); megaBtn.focus(); }
    });
    document.addEventListener('click', (e) => {
      if (!mega.hidden && !mega.contains(e.target) && !megaBtn.contains(e.target)) abrir(false);
    });
    mega.addEventListener('focusout', (e) => {
      if (e.relatedTarget && !mega.contains(e.relatedTarget) && e.relatedTarget !== megaBtn) abrir(false);
    });
    $$('a', mega).forEach((a) => a.addEventListener('click', () => abrir(false)));
  }

  /* 5. Gaveta (menu móvel) com foco preso e Esc */
  const gBtn = $('[data-gaveta-btn]');
  const gaveta = $('[data-gaveta]');
  if (gBtn && gaveta) {
    const focaveis = () => $$('a[href], button:not([disabled]), summary', gaveta).filter((el) => el.offsetParent !== null);
    const fechar = () => {
      gaveta.hidden = true;
      gBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('trava');
      gBtn.focus();
    };
    gBtn.addEventListener('click', () => {
      gaveta.hidden = false;
      gBtn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('trava');
      $('[data-gaveta-fechar]', gaveta).focus();
    });
    $('[data-gaveta-fechar]', gaveta).addEventListener('click', fechar);
    $$('a', gaveta).forEach((a) => a.addEventListener('click', () => { if (!gaveta.hidden) fechar(); }));
    gaveta.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { fechar(); return; }
      if (e.key !== 'Tab') return;
      const f = focaveis();
      const primeiro = f[0], ultimo = f[f.length - 1];
      if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
    });
    window.matchMedia('(min-width: 1081px)').addEventListener('change', (m) => { if (m.matches && !gaveta.hidden) fechar(); });
  }

  /* 6. Entrada suave por scroll */
  const reveals = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduzido) {
    const io = new IntersectionObserver((entradas) => {
      entradas.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const irmaos = el.parentElement ? $$(':scope > [data-reveal]', el.parentElement) : [];
        const i = Math.max(0, irmaos.indexOf(el));
        el.style.transitionDelay = Math.min(i % 4, 3) * 80 + 'ms';
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  /* 7. Filtros da vitrine / catálogo (linha ou necessidade) */
  $$('[data-filtros]').forEach((box) => {
    const nome = box.getAttribute('data-filtros');
    const lista = $(`[data-filtro-alvo="${nome}"]`);
    const status = box.nextElementSibling && box.nextElementSibling.matches('[data-filtros-status]') ? box.nextElementSibling : null;
    if (!lista) return;
    const cards = $$('.card-p', lista);
    const botoes = $$('[data-filtro]', box);
    const aplicar = (valor, anunciar = true) => {
      const [tipo, id] = valor.split(':');
      let n = 0;
      cards.forEach((c) => {
        const ok = tipo === 'todos' || (tipo === 'cat' && c.dataset.cat === id) || (tipo === 'nec' && c.dataset.nec.split(' ').includes(id));
        c.hidden = !ok;
        if (ok) { n++; c.classList.add('is-in'); }
      });
      botoes.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filtro === valor)));
      if (status && anunciar) status.textContent = tipo === 'todos' ? `Mostrando todos os ${n} produtos.` : `Mostrando ${n} ${n === 1 ? 'produto' : 'produtos'}.`;
    };
    botoes.forEach((b) => b.addEventListener('click', () => aplicar(b.dataset.filtro)));
    // ?linha=tratamento ou ?necessidade=liso
    const q = new URLSearchParams(location.search);
    if (q.get('linha') && botoes.some((b) => b.dataset.filtro === 'cat:' + q.get('linha'))) aplicar('cat:' + q.get('linha'));
    else if (q.get('necessidade') && botoes.some((b) => b.dataset.filtro === 'nec:' + q.get('necessidade'))) aplicar('nec:' + q.get('necessidade'));
  });

  /* 8. Abas acessíveis (setas do teclado) */
  $$('[data-abas]').forEach((lista) => {
    const abas = $$('[role="tab"]', lista);
    const ativar = (aba, focar) => {
      abas.forEach((a) => {
        const sel = a === aba;
        a.setAttribute('aria-selected', String(sel));
        a.tabIndex = sel ? 0 : -1;
        const painel = document.getElementById(a.getAttribute('aria-controls'));
        if (painel) painel.hidden = !sel;
      });
      if (focar) aba.focus();
    };
    abas.forEach((a, i) => {
      a.addEventListener('click', () => ativar(a));
      a.addEventListener('keydown', (e) => {
        const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        ativar(abas[(i + d + abas.length) % abas.length], true);
      });
    });
  });

  /* 9. Brilho dos fios: liga só depois do carregamento e pausa fora da tela (economiza bateria e CPU). */
  const fios = $$('svg.fios');
  if (fios.length && !reduzido && 'IntersectionObserver' in window) {
    const ligar = () => {
      const io = new IntersectionObserver((en) => en.forEach((e) => e.target.classList.toggle('fios--vivo', e.isIntersecting)));
      fios.forEach((f) => io.observe(f));
    };
    const depois = () => setTimeout(() => ('requestIdleCallback' in window ? requestIdleCallback(ligar, { timeout: 2000 }) : ligar()), 1500);
    if (document.readyState === 'complete') depois(); else window.addEventListener('load', depois, { once: true });
  }

  /* 10. Parallax sutil (só mouse, sem movimento reduzido) */
  const px = $$('[data-parallax]');
  if (px.length && !reduzido && window.matchMedia('(pointer: fine)').matches) {
    let alvoX = 0, alvoY = 0, pedido = null;
    const mover = () => {
      pedido = null;
      px.forEach((el) => {
        const f = parseFloat(el.dataset.parallax) || 0.04;
        el.style.transform = `translate3d(${(alvoX * f * 100).toFixed(2)}px, ${(alvoY * f * 100 - window.scrollY * f * 0.6).toFixed(2)}px, 0)`;
      });
    };
    const agendar = () => { if (!pedido) pedido = requestAnimationFrame(mover); };
    window.addEventListener('pointermove', (e) => {
      alvoX = e.clientX / window.innerWidth - 0.5;
      alvoY = e.clientY / window.innerHeight - 0.5;
      agendar();
    }, { passive: true });
    window.addEventListener('scroll', agendar, { passive: true });
  }
})();
