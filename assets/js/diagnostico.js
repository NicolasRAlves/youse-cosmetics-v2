/* Youse Cosmetics · v2 — Diagnóstico capilar
 * Os 6 resultados já vêm prontos no HTML e aparecem só com CSS (:has + :checked),
 * então o diagnóstico funciona mesmo sem JavaScript. Aqui só melhoramos a experiência:
 * no celular, a página rola até o ritual escolhido. */
(function () {
  'use strict';
  const diag = document.querySelector('[data-diag]');
  if (!diag) return;
  let porToque = false;
  diag.addEventListener('pointerdown', () => { porToque = true; });
  diag.addEventListener('keydown', () => { porToque = false; });

  diag.addEventListener('change', (e) => {
    if (e.target.name !== 'queixa') return;
    const res = diag.querySelector(`[data-res="${e.target.value}"]`);
    if (!res) return;
    // Sem suporte a :has (navegadores antigos): mostra o resultado na mão.
    if (!CSS.supports('selector(:has(*))')) {
      diag.querySelectorAll('[data-res]').forEach((r) => { r.style.display = r === res ? 'block' : 'none'; });
      const vazio = diag.querySelector('.diag__vazio');
      if (vazio) vazio.style.display = 'none';
    }
    if (porToque && window.matchMedia('(max-width: 900px)').matches) {
      const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      requestAnimationFrame(() => res.scrollIntoView({ behavior: reduzido ? 'auto' : 'smooth', block: 'start' }));
    }
  });
})();
