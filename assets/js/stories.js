/* Youse Cosmetics · v2 — Stories (vídeos em tela cheia, estilo Instagram) */
(function () {
  'use strict';
  const dlg = document.querySelector('[data-stories]');
  if (!dlg || typeof dlg.showModal !== 'function') return;

  const lista = JSON.parse(dlg.querySelector('[data-st-lista]').textContent);
  const video = dlg.querySelector('[data-st-video]');
  const barras = Array.from(dlg.querySelectorAll('.stories__barras i'));
  const titulo = dlg.querySelector('[data-st-titulo]');
  const legenda = dlg.querySelector('[data-st-legenda]');
  const linkProd = dlg.querySelector('[data-st-produto]');
  const btnSom = dlg.querySelector('[data-st-som]');
  const btnPausa = dlg.querySelector('[data-st-pausa]');
  const palco = dlg.querySelector('.stories__palco');
  const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let atual = 0, origem = null, raf = null;
  let mudo = false;

  const svg = (d) => `<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const IC = {
    pause: svg('<path d="M8 5h3v14H8zM13 5h3v14h-3z" fill="currentColor" stroke="none"/>'),
    play: svg('<path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>'),
    som: svg('<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12"/>'),
    mudo: svg('<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M17 9l5 6M22 9l-5 6"/>')
  };

  function pintarBarras() {
    barras.forEach((b, i) => { b.style.transform = `scaleX(${i < atual ? 1 : 0})`; });
  }
  function progresso() {
    if (video.duration) barras[atual].style.transform = `scaleX(${Math.min(1, video.currentTime / video.duration)})`;
    raf = requestAnimationFrame(progresso);
  }
  function atualizarBotoes() {
    btnPausa.innerHTML = video.paused ? IC.play : IC.pause;
    btnPausa.setAttribute('aria-label', video.paused ? 'Continuar vídeo' : 'Pausar vídeo');
    btnSom.innerHTML = video.muted ? IC.mudo : IC.som;
    btnSom.setAttribute('aria-label', video.muted ? 'Ativar som' : 'Desativar som');
  }
  function ir(i) {
    if (i < 0) i = 0;
    if (i >= lista.length) { fechar(); return; }
    atual = i;
    const v = lista[i];
    video.src = v.src;
    video.poster = v.poster;
    video.muted = mudo;
    titulo.textContent = v.titulo;
    legenda.innerHTML = '';
    legenda.append(v.titulo);
    const small = document.createElement('small');
    small.textContent = v.legenda;
    legenda.append(small);
    linkProd.href = v.url;
    linkProd.firstChild.nodeValue = 'Ver ' + v.produto + ' ';
    palco.style.setProperty('--cor', v.cor);
    pintarBarras();
    const p = video.play();
    if (p && p.catch) p.catch(() => { video.muted = mudo = true; video.play().catch(() => {}); atualizarBotoes(); });
    atualizarBotoes();
  }
  function abrir(i, botao) {
    origem = botao || null;
    dlg.showModal();
    document.body.classList.add('trava');
    ir(i);
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(progresso);
  }
  function fechar() {
    video.pause();
    video.removeAttribute('src');
    video.load();
    cancelAnimationFrame(raf);
    if (dlg.open) dlg.close();
  }
  dlg.addEventListener('close', () => {
    video.pause();
    cancelAnimationFrame(raf);
    document.body.classList.remove('trava');
    if (origem) origem.focus();
  });

  video.addEventListener('ended', () => ir(atual + 1));
  video.addEventListener('play', atualizarBotoes);
  video.addEventListener('pause', atualizarBotoes);

  dlg.querySelectorAll('[data-st-prox]').forEach((b) => b.addEventListener('click', () => ir(atual + 1)));
  dlg.querySelectorAll('[data-st-ant]').forEach((b) => b.addEventListener('click', () => ir(atual - 1)));
  dlg.querySelector('[data-st-fechar]').addEventListener('click', fechar);
  btnPausa.addEventListener('click', () => (video.paused ? video.play() : video.pause()));
  btnSom.addEventListener('click', () => { mudo = !mudo; video.muted = mudo; atualizarBotoes(); });
  dlg.addEventListener('click', (e) => { if (e.target === dlg) fechar(); });
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); ir(atual + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); ir(atual - 1); }
    else if (e.key.toLowerCase() === 'm') btnSom.click();
    else if (e.key === ' ' && !(e.target instanceof HTMLButtonElement || e.target instanceof HTMLAnchorElement)) { e.preventDefault(); btnPausa.click(); }
  });

  // Swipe: horizontal troca o vídeo; para baixo fecha.
  let x0 = null, y0 = null, ignorarClique = false;
  palco.addEventListener('pointerdown', (e) => { x0 = e.clientX; y0 = e.clientY; });
  palco.addEventListener('pointerup', (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0, dy = e.clientY - y0;
    x0 = y0 = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) { ignorarClique = true; ir(atual + (dx < 0 ? 1 : -1)); }
    else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) { ignorarClique = true; fechar(); }
  });
  // Depois de um swipe, o navegador ainda dispara um "click": ignoramos esse.
  palco.addEventListener('click', (e) => {
    if (ignorarClique) { ignorarClique = false; e.stopPropagation(); e.preventDefault(); }
  }, true);
  palco.addEventListener('pointerdown', () => { ignorarClique = false; });

  // Cards da home: abrem o player; no desktop, prévia muda ao passar o mouse.
  const podePrevia = window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduzido &&
    !(navigator.connection && navigator.connection.saveData);
  document.querySelectorAll('[data-story]').forEach((card) => {
    card.addEventListener('click', () => {
      const pv = card.querySelector('video');
      if (pv) pv.pause();
      abrir(Number(card.dataset.story), card);
    });
    if (!podePrevia) return;
    let pv = null;
    card.addEventListener('pointerenter', () => {
      if (!pv) {
        pv = document.createElement('video');
        pv.muted = true; pv.loop = true; pv.playsInline = true; pv.preload = 'auto';
        pv.setAttribute('aria-hidden', 'true');
        pv.src = card.dataset.src;
        card.prepend(pv);
      }
      pv.play().catch(() => {});
    });
    card.addEventListener('pointerleave', () => { if (pv) pv.pause(); });
  });
})();
