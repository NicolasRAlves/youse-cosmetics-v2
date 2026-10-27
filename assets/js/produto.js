/* Youse Cosmetics · v2 — página de produto: barra fixa de compra e cronômetro de pausa */
(function () {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);

  /* ---------- Barra fixa de compra (aparece depois do hero, só no mobile via CSS) ---------- */
  const barra = $('[data-barra-compra]');
  const hero = $('.p-hero');
  const rodape = $('.rodape');
  if (barra && hero && 'IntersectionObserver' in window) {
    const btn = $('[data-barra-btn]', barra);
    const menu = $('#barra-menu', barra);
    let passouHero = false, noRodape = false;
    const mostrar = () => {
      const ver = passouHero && !noRodape;
      barra.classList.toggle('is-visivel', ver);
      barra.toggleAttribute('inert', !ver);
      barra.setAttribute('aria-hidden', String(!ver));
      document.body.classList.toggle('com-barra', ver && getComputedStyle(barra).display !== 'none');
      if (!ver) { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
    };
    new IntersectionObserver(([e]) => { passouHero = !e.isIntersecting && e.boundingClientRect.top < 0; mostrar(); }).observe(hero);
    if (rodape) new IntersectionObserver(([e]) => { noRodape = e.isIntersecting; mostrar(); }).observe(rodape);
    btn.addEventListener('click', () => {
      const abrir = menu.hidden;
      menu.hidden = !abrir;
      btn.setAttribute('aria-expanded', String(abrir));
      if (abrir) menu.querySelector('a').focus();
    });
    barra.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); btn.focus(); } });
  }

  /* ---------- Cronômetro de pausa ----------
   * Conta pelo relógio do sistema (não para se a aba ficar em segundo plano),
   * mantém a tela acesa quando o navegador permite e avisa no fim com vibração e som. */
  const painel = $('[data-timer-painel]');
  if (!painel) return;
  const elTempo = $('[data-timer-tempo]', painel);
  const elRotulo = $('[data-timer-rotulo]', painel);
  const elAviso = $('[data-timer-aviso]', painel);
  const prog = $('.timer__prog', painel);
  const btnPausa = $('[data-timer-pausa]', painel);
  const iconePausa = btnPausa.innerHTML;
  const iconePlay = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>';
  let total = 0, fim = 0, restante = 0, tique = null, trava = null, pausado = false, origem = null;

  const fmt = (ms) => {
    const s = Math.max(0, Math.ceil(ms / 1000));
    return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  };
  async function manterTela(sim) {
    try {
      if (sim && 'wakeLock' in navigator && !trava) { trava = await navigator.wakeLock.request('screen'); trava.addEventListener('release', () => { trava = null; }); }
      if (!sim && trava) { await trava.release(); trava = null; }
    } catch (_) { /* sem suporte: segue sem travar a tela */ }
  }
  function bip() {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      const ac = new Ctx();
      [0, 0.35, 0.7].forEach((t) => {
        const o = ac.createOscillator(), g = ac.createGain();
        o.frequency.value = 880; o.connect(g); g.connect(ac.destination);
        g.gain.setValueAtTime(0.0001, ac.currentTime + t);
        g.gain.exponentialRampToValueAtTime(0.3, ac.currentTime + t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + t + 0.25);
        o.start(ac.currentTime + t); o.stop(ac.currentTime + t + 0.3);
      });
    } catch (_) { /* sem áudio */ }
  }
  function desenhar() {
    restante = pausado ? restante : fim - Date.now();
    elTempo.textContent = fmt(restante);
    prog.style.strokeDashoffset = String(100 - Math.max(0, restante / total) * 100);
    document.title = (restante > 0 ? fmt(restante) + ' · ' : '') + document.title.replace(/^\d\d:\d\d · /, '');
    if (restante <= 0) terminar();
  }
  function terminar() {
    clearInterval(tique); tique = null;
    painel.classList.add('is-fim');
    elTempo.textContent = 'Pronto!';
    btnPausa.innerHTML = $('[data-timer-fechar]', painel).innerHTML;
    btnPausa.setAttribute('aria-label', 'Fechar cronômetro');
    elAviso.textContent = 'Tempo de pausa concluído. Siga para o próximo passo.';
    document.title = document.title.replace(/^\d\d:\d\d · /, '');
    if (navigator.vibrate) navigator.vibrate([300, 150, 300, 150, 300]);
    bip();
    manterTela(false);
  }
  function iniciar(min, rotulo, botao) {
    origem = botao;
    total = min * 60 * 1000;
    fim = Date.now() + total;
    pausado = false;
    painel.hidden = false;
    painel.classList.remove('is-fim');
    elRotulo.textContent = rotulo + ' · ' + min + ' min';
    elAviso.textContent = `Cronômetro de ${min} minutos iniciado.`;
    btnPausa.innerHTML = iconePausa;
    btnPausa.setAttribute('aria-label', 'Pausar cronômetro');
    document.body.classList.add('com-timer');
    clearInterval(tique);
    tique = setInterval(desenhar, 250);
    desenhar();
    manterTela(true);
  }
  function encerrar() {
    clearInterval(tique); tique = null;
    painel.hidden = true;
    document.body.classList.remove('com-timer');
    document.title = document.title.replace(/^\d\d:\d\d · /, '');
    manterTela(false);
    if (origem) origem.focus();
  }

  document.querySelectorAll('[data-timer]').forEach((b) => {
    b.addEventListener('click', () => iniciar(Number(b.dataset.timer), b.dataset.timerRotulo, b));
  });
  btnPausa.addEventListener('click', () => {
    if (painel.classList.contains('is-fim')) { encerrar(); return; }
    pausado = !pausado;
    if (pausado) { restante = fim - Date.now(); clearInterval(tique); manterTela(false); }
    else { fim = Date.now() + restante; tique = setInterval(desenhar, 250); manterTela(true); }
    btnPausa.innerHTML = pausado ? iconePlay : iconePausa;
    btnPausa.setAttribute('aria-label', pausado ? 'Continuar cronômetro' : 'Pausar cronômetro');
    elAviso.textContent = pausado ? 'Cronômetro pausado.' : 'Cronômetro retomado.';
  });
  $('[data-timer-fechar]', painel).addEventListener('click', encerrar);
  // Ao voltar para a aba, a tela pode ter liberado a trava: pede de novo.
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && tique) manterTela(true); });
})();
