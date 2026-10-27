/* Youse Cosmetics · v2 — formulário de distribuidor → mensagem no WhatsApp (sem backend) */
(function () {
  'use strict';
  const form = document.querySelector('[data-form-distribuidor]');
  if (!form || !window.YOUSE) return;
  const erro = form.querySelector('[data-form-erro]');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const campos = ['nome', 'cidade', 'tipo'].map((n) => form.elements[n]);
    const vazios = campos.filter((c) => !c.value.trim());
    campos.forEach((c) => c.setAttribute('aria-invalid', String(!c.value.trim())));
    if (vazios.length) {
      erro.hidden = false;
      erro.textContent = 'Preencha nome, cidade e tipo de negócio para enviar.';
      vazios[0].focus();
      return;
    }
    erro.hidden = true;
    const d = Object.fromEntries(new FormData(form));
    const linhas = [
      'Olá! Tenho interesse em saber mais sobre como me tornar um distribuidor da Youse Cosmetics.',
      '',
      'Nome: ' + d.nome.trim(),
      'Cidade: ' + d.cidade.trim(),
      'Tipo de negócio: ' + d.tipo
    ];
    if (d.mensagem && d.mensagem.trim()) linhas.push('Mensagem: ' + d.mensagem.trim());
    window.open(window.YOUSE.whats.livre(linhas.join('\n')), '_blank', 'noopener');
  });
})();
