/* Youse Cosmetics · v2 — comparador antes & depois
 * O <input type="range"> cobre a foto inteira: funciona com arraste (mouse e toque)
 * e com as setas do teclado, sem biblioteca. */
(function () {
  'use strict';
  document.querySelectorAll('[data-ad]').forEach((fig) => {
    const range = fig.querySelector('[data-ad-range]');
    if (!range) return;
    const pintar = () => {
      fig.style.setProperty('--pos', range.value + '%');
      range.setAttribute('aria-valuetext', `${range.value}% antes, ${100 - range.value}% depois`);
    };
    range.addEventListener('input', pintar);
    pintar();

    // Dica de movimento uma vez, quando o comparador aparece pela 1ª vez.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((en) => {
      if (!en[0].isIntersecting) return;
      io.disconnect();
      const quadros = [50, 62, 38, 50];
      let i = 0;
      const passo = () => {
        if (document.activeElement === range) return;
        range.value = quadros[i++];
        pintar();
        if (i < quadros.length) setTimeout(passo, 380);
      };
      setTimeout(passo, 500);
    }, { threshold: 0.6 });
    io.observe(fig);
  });
})();
