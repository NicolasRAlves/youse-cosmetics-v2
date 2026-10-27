/*
 * Youse Cosmetics — FONTE ÚNICA DE DADOS do site.
 *
 * Tudo o que aparece sobre produtos, rituais, vídeos e contatos sai daqui.
 * Depois de editar este arquivo, rode:  node scripts/gerar-paginas.mjs
 *
 * Regra da casa: nada de preço, estatística, depoimento ou certificação inventados.
 * O que falta está marcado com [PREENCHER: ...] e listado em PENDENTES-CLIENTE.md.
 */
(function (root) {
  'use strict';

  const WHATSAPP = '5518997456435';

  const site = {
    nome: 'Youse Cosmetics',
    // [PREENCHER: confirmar o domínio definitivo — usado em canonical, Open Graph e sitemap]
    url: 'https://www.yousecosmetics.com.br',
    slogan: 'A jornada da sua transformação capilar.',
    sobre: 'A Youse Cosmetics une tecnologia e ingredientes naturais para transformar a saúde dos seus fios. Excelência em cada gota.',
    fechamento: 'Encontre a sua química perfeita.',
    email: 'sac@yousecosmetics.com.br',
    telefone: '(18) 99745-6435',
    telefoneIntl: '+55 18 99745-6435',
    whatsapp: WHATSAPP,
    endereco: 'Echaporã, SP — Brasil',
    redes: {
      instagram: 'https://www.instagram.com/yousecosmetics',
      tiktok: 'https://www.tiktok.com/@yousecosmetics',
      facebook: 'https://www.facebook.com/YouseCosmetics'
    },
    instagramUser: '@yousecosmetics',
    // [CLIENTE APROVAR] hashtag da galeria de resultados
    hashtag: '#MeuResultadoYouse',
    lojas: [
      {
        id: 'ml',
        nome: 'Mercado Livre',
        rotulo: 'Loja oficial',
        texto: 'A loja oficial da Youse dentro do Mercado Livre, com a linha disponível para compra online.',
        url: 'https://www.mercadolivre.com.br/pagina/cy20241105132345',
        cta: 'Comprar no Mercado Livre'
      },
      {
        id: 'dot',
        nome: 'Dot Cosméticos',
        rotulo: 'Revendedor',
        texto: 'Loja de cosméticos que revende a Youse Cosmetics, com a página da marca reunindo os produtos.',
        url: 'https://www.dotcosmeticos.com.br/marcas/youse-cosmetics',
        cta: 'Comprar na Dot Cosméticos'
      }
    ],
    msgDistribuidor: 'Olá! Tenho interesse em saber mais sobre como me tornar um distribuidor da Youse Cosmetics.'
  };

  /* ---------- Links de WhatsApp (sempre com encodeURIComponent) ---------- */
  function wa(msg) {
    return 'https://wa.me/' + WHATSAPP + (msg ? '?text=' + encodeURIComponent(msg) : '');
  }
  const whats = {
    geral: () => wa('Olá! Vim pelo site da Youse Cosmetics e tenho uma dúvida.'),
    produto: (nome) => wa('Olá! Vi o ' + nome + ' no site e tenho uma dúvida.'),
    ritual: (nomes) => wa('Olá! Fiz o diagnóstico no site e meu ritual é: ' + nomes.join(', ') + '.'),
    distribuidor: () => wa(site.msgDistribuidor),
    livre: wa
  };

  /* ---------- Cor: contraste AA calculado, igual no Node e no navegador ---------- */
  function hexRgb(h) {
    h = h.replace('#', '');
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  }
  function rgbHex(c) {
    return '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
  }
  function lum(h) {
    const c = hexRgb(h).map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function contraste(a, b) {
    const x = lum(a), y = lum(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  }
  function misturar(a, b, t) {
    const x = hexRgb(a), y = hexRgb(b);
    return rgbHex(x.map((v, i) => v + (y[i] - v) * t));
  }
  /** Tokens de tema de um produto: cor pura, versão legível sobre fundo escuro e cor de texto sobre a cor. */
  function tema(cor) {
    const fundo = '#1A1A1E'; // pior caso: cartões sobre o fundo escuro
    let texto = cor, t = 0;
    while (contraste(texto, fundo) < 4.6 && t < 1) { t += 0.05; texto = misturar(cor, '#FFFFFF', t); }
    const tinta = contraste('#0A0A0A', cor) >= contraste('#FFFFFF', cor) ? '#0A0A0A' : '#FFFFFF';
    return {
      cor: cor,
      texto: texto,
      tinta: tinta,
      suave: misturar(cor, '#0A0A0A', 0.82),
      profunda: misturar(cor, '#0A0A0A', 0.55)
    };
  }

  const categorias = [
    { id: 'tratamento', nome: 'Tratamento' },
    { id: 'manutencao', nome: 'Manutenção & Finalização' }
  ];

  const necessidades = [
    { id: 'liso', nome: 'Liso' },
    { id: 'reconstrucao', nome: 'Reconstrução' },
    { id: 'hidratacao', nome: 'Hidratação' },
    { id: 'nutricao', nome: 'Nutrição' },
    { id: 'finalizacao', nome: 'Finalização' }
  ];

  /* Ordem = ordem do catálogo (menu da v1). Define também "anterior / próximo". */
  const produtos = [
    {
      slug: 'quiabo',
      nome: 'Quiabo',
      nomeCompleto: 'Quiabo Reestruturante Premium',
      tag: 'Linha Natural',
      subtitulo: 'Reestruturante Premium',
      categoria: 'tratamento',
      necessidades: ['liso', 'hidratacao'],
      cor: '#22C55E',
      cor2: '#4ADE80',
      img: 'quiabo',
      alt: 'Linha Quiabo Reestruturante Premium da Youse Cosmetics: frasco de 1 litro, frasco com válvula pump e frasco menor, com rótulos verdes',
      resumo: 'Alinhamento com extrato de quiabo: hidratação profunda e efeito liso sem agressões químicas.',
      descricao: 'Um tratamento de alinhamento dos fios formulado com extrato de quiabo. Promove hidratação profunda e reparadora, alinhando os fios de forma natural, suavizando o frizz e proporcionando um efeito liso sem agressões químicas.',
      papel: 'Alinha os fios com extrato de quiabo',
      beneficios: ['Hidratação profunda e reparadora', 'Alinhamento natural dos fios', 'Suaviza o frizz', 'Efeito liso sem agressões químicas'],
      ativos: [
        { nome: 'Extrato de quiabo', funcao: 'Ativo-assinatura da Youse. Promove hidratação profunda e reparadora enquanto alinha os fios de forma natural.' }
      ],
      passos: [
        // [CLIENTE VALIDAR] a v1 dizia "aplique a Máscara Youliss" neste passo — corrigido para "máscara Quiabo"
        { titulo: 'Preparação e aplicação', texto: 'Agite antes de usar. Com os cabelos já limpos pelo Shampoo Purify Antirresíduos e levemente úmidos, aplique a máscara Quiabo uniformemente por todo o comprimento dos fios, mecha a mecha.' },
        { titulo: 'Tempo de ação', texto: 'Deixe o produto agir nos fios por 40 minutos para garantir a absorção completa dos nutrientes.', tempo: '40 min', timer: [40] },
        { titulo: 'Enxágue e finalização', texto: 'Retire o excesso no lavatório (cerca de 10%). Escove e seque totalmente. Para um melhor resultado de maciez e brilho intenso, recomenda-se o uso de prancha.', tempo: 'Prancha' }
      ],
      ritual: ['purify', 'quiabo', 'oil-blend-argan'],
      faq: [
        { p: 'Quanto tempo de pausa?', r: '40 minutos, para garantir a absorção completa dos nutrientes.' },
        { p: 'Preciso lavar o cabelo antes?', r: 'Sim. Aplique com os cabelos limpos pelo Shampoo Purify Antirresíduos e levemente úmidos.' },
        { p: 'Enxáguo todo o produto?', r: 'Não. Retire apenas o excesso no lavatório, cerca de 10%, e depois escove e seque totalmente.' },
        { p: 'Precisa de prancha?', r: 'É recomendada: a prancha garante um melhor resultado de maciez e brilho intenso.' },
        { p: 'Tem química agressiva?', r: 'O Quiabo proporciona efeito liso sem agressões químicas.' }
      ]
    },
    {
      slug: 'youliss',
      nome: 'Youliss',
      nomeCompleto: 'Youliss Reestruturante Premium',
      tag: 'Liso Absoluto',
      subtitulo: 'Reestruturante Premium',
      categoria: 'tratamento',
      necessidades: ['liso'],
      cor: '#E7339A',
      cor2: '#BADE01',
      img: 'youliss_2',
      alt: 'Linha Youliss Reestruturante Premium da Youse Cosmetics: frasco de 1 litro, frasco com válvula pump e frasco menor, com rótulo magenta e verde-limão',
      resumo: 'Liso com brilho e maciez duradoura: alinha os fios e reduz o frizz, sem química agressiva.',
      descricao: 'O Youliss foi desenvolvido para quem busca um cabelo liso, com brilho e maciez duradoura. Sua fórmula promove o alinhamento dos fios, reduz o frizz e é enriquecida com ingredientes hidratantes e nutritivos. Efeito liso sem química agressiva.',
      papel: 'Alinha os fios e reduz o frizz',
      beneficios: ['Alinhamento dos fios', 'Reduz o frizz', 'Brilho e maciez duradoura', 'Sem química agressiva'],
      // [PREENCHER: lista oficial de ativos. A embalagem mostra "Queratina + Pantenol" — confirmar antes de publicar]
      ativos: [
        { nome: 'Ingredientes hidratantes e nutritivos', funcao: 'Enriquecem a fórmula para cuidar dos fios enquanto eles são alinhados.' },
        { nome: 'Ação alinhadora', funcao: 'Promove o alinhamento dos fios e reduz o frizz, com efeito liso sem química agressiva.' }
      ],
      passos: [
        { titulo: 'Preparação', texto: 'Agite antes de usar. Lave com Shampoo Purify Antirresíduos. Com os fios levemente úmidos, aplique a Máscara Youliss uniformemente, mecha a mecha.' },
        { titulo: 'Tempo de pausa', texto: 'Deixe o produto agir por 40 minutos. Esse tempo é essencial para o alinhamento da fibra capilar.', tempo: '40 min', timer: [40] },
        { titulo: 'Selagem térmica', texto: 'Enxágue retirando apenas o excesso (aprox. 10%). Escove e seque totalmente. Para brilho espelhado e maciez extrema, finalize com a prancha.', tempo: 'Prancha' }
      ],
      video: 1,
      antesDepois: ['youliss', 'youliss-2'],
      ritual: ['purify', 'youliss', 'oil-blend-argan'],
      faq: [
        { p: 'Quanto tempo de pausa?', r: '40 minutos. Esse tempo é essencial para o alinhamento da fibra capilar.' },
        { p: 'Preciso lavar o cabelo antes?', r: 'Sim. Lave com o Shampoo Purify Antirresíduos e aplique com os fios levemente úmidos.' },
        { p: 'Enxáguo todo o produto?', r: 'Não. Retire apenas o excesso, aproximadamente 10%, e depois escove e seque totalmente.' },
        { p: 'Precisa de prancha?', r: 'Sim. A finalização com a prancha garante o brilho espelhado e a maciez extrema.' },
        { p: 'Tem química agressiva?', r: 'O Youliss proporciona efeito liso sem química agressiva.' }
      ]
    },
    {
      slug: 'btx-quiabo',
      nome: 'BTX Quiabo',
      nomeCompleto: 'BTX Quiabo Tratamento Capilar',
      tag: 'Nano Tecnologia',
      subtitulo: 'Tratamento Inovador',
      categoria: 'tratamento',
      necessidades: ['liso', 'reconstrucao', 'nutricao'],
      cor: '#2DD4BF',
      img: 'btx',
      alt: 'BTX Quiabo Tratamento Capilar da Youse Cosmetics: pote de 1 kg e pote menor, brancos com rótulo verde-água',
      resumo: 'Extrato de quiabo + Nano Active: nutrição profunda, reposição de massa e redução drástica do frizz.',
      descricao: 'Enriquecido com extrato de quiabo e tecnologia Nano Active. Oferece nutrição profunda, reposição de massa e redução drástica do frizz. Revitaliza cabelos danificados, deixando-os alinhados, macios e com brilho espelhado.',
      papel: 'Repõe a massa e reduz o frizz',
      beneficios: ['Reposição de massa', 'Nutrição profunda', 'Redução drástica do frizz', 'Brilho espelhado'],
      ativos: [
        { nome: 'Extrato de quiabo', funcao: 'Nutrição profunda para revitalizar cabelos danificados.' },
        { nome: 'Tecnologia Nano Active', funcao: 'Tecnologia do BTX que atua na reposição de massa e na redução do frizz, deixando os fios alinhados e macios.' }
      ],
      passos: [
        { titulo: 'Higienização', texto: 'Lave os cabelos com shampoo antirresíduos para abrir as cutículas. Retire o excesso de umidade com uma toalha.' },
        { titulo: 'Aplicação e pausa', texto: 'Aplique o BTX mecha a mecha, enluvando bem. Deixe agir de 20 a 40 minutos, dependendo da resistência do fio.', tempo: '20–40 min', timer: [20, 30, 40] },
        { titulo: 'Selagem dos fios', texto: 'Enxágue parcialmente (deixando um pouco de produto). Finalize com secador e chapinha para ativar o tratamento térmico e selar os nutrientes.', tempo: 'Chapinha' }
      ],
      ritual: ['purify', 'btx-quiabo', 'oil-blend-argan'],
      faq: [
        { p: 'Quanto tempo de pausa?', r: 'De 20 a 40 minutos, dependendo da resistência do fio.' },
        { p: 'Enxáguo todo o produto?', r: 'Não. Enxágue parcialmente, deixando um pouco de produto nos fios.' },
        { p: 'Precisa de chapinha?', r: 'Sim. Secador e chapinha ativam o tratamento térmico e selam os nutrientes.' },
        { p: 'Preciso lavar o cabelo antes?', r: 'Sim, com shampoo antirresíduos, para abrir as cutículas. Depois retire o excesso de umidade com uma toalha.' }
      ]
    },
    {
      slug: 'sos',
      nome: 'SOS',
      nomeCompleto: 'Máscara SOS Antiemborrachamento',
      tag: 'Reconstrução Imediata',
      subtitulo: 'Antiemborrachamento',
      categoria: 'tratamento',
      necessidades: ['reconstrucao'],
      cor: '#EF4444',
      cor2: '#DDBD2A',
      img: 'sos',
      alt: 'Máscara SOS Antiemborrachamento da Youse Cosmetics: pote grande e pote menor, brancos com faixa vermelha e letras douradas',
      resumo: 'Para fios elásticos e danificados: repara a estrutura e restaura a força após a química.',
      descricao: 'A solução para cabelos elásticos e danificados. Formulada com D-Pantenol, Colágeno e Ômegas 3, 6 e 9. Repara profundamente a estrutura capilar, restaurando a força e devolvendo a vida aos fios pós-química.',
      papel: 'Reconstrói fios elásticos',
      beneficios: ['Repara a estrutura capilar', 'Restaura a força dos fios', 'Para fios elásticos (emborrachados)', 'Ideal pós-química'],
      // [CLIENTE VALIDAR] função atribuída a cada ativo a partir da descrição geral
      ativos: [
        { nome: 'D-Pantenol', funcao: 'Integra o complexo que repara profundamente a estrutura capilar.' },
        { nome: 'Colágeno', funcao: 'Contribui para restaurar a força dos fios danificados.' },
        { nome: 'Ômegas 3, 6 e 9', funcao: 'Ajudam a devolver a vida aos fios pós-química.' }
      ],
      passos: [
        { titulo: 'Aplicação generosa', texto: 'Com os cabelos limpos e úmidos, aplique uma quantidade generosa da máscara, enluvando mecha por mecha para garantir penetração total.' },
        { titulo: 'Ação reparadora', texto: 'Deixe agir de 5 a 10 minutos. Esse tempo é crucial para que o complexo de vitaminas recupere a elasticidade do fio.', tempo: '5–10 min', timer: [5, 10] },
        { titulo: 'Finalização', texto: 'Enxágue abundantemente. Para manter a saúde dos fios, utilize semanalmente como parte do seu cronograma capilar de reconstrução.', tempo: 'Semanal' }
      ],
      video: 2,
      ritual: ['purify', 'sos', 'natocream'],
      faq: [
        { p: 'Quanto tempo de pausa?', r: 'De 5 a 10 minutos, tempo para o complexo de vitaminas recuperar a elasticidade do fio.' },
        { p: 'Com que frequência usar?', r: 'Semanalmente, como parte do cronograma capilar de reconstrução.' },
        { p: 'Para que tipo de cabelo?', r: 'Cabelos elásticos (emborrachados) e danificados, principalmente após procedimentos químicos.' }
      ]
    },
    {
      slug: 'colageno',
      nome: 'Colágeno',
      nomeCompleto: 'Kit Colágeno',
      tag: 'Rejuvenescimento Capilar',
      subtitulo: 'Tratamento Revitalizante',
      categoria: 'tratamento',
      necessidades: ['reconstrucao', 'nutricao'],
      cor: '#B99062',
      img: 'marrom',
      kit: ['Shampoo', 'Máscara', 'Condicionador'],
      alt: 'Kit Colágeno da Youse Cosmetics: shampoo, condicionador e máscara em embalagens douradas',
      resumo: 'Colágeno hidrolisado para devolver densidade, prevenir a quebra e dar elasticidade aos fios.',
      descricao: 'Tratamento completo enriquecido com Colágeno Hidrolisado. Age como uma fonte de juventude para os fios, devolvendo a densidade, prevenindo a quebra e proporcionando elasticidade e maciez extrema.',
      papel: 'Devolve densidade e previne a quebra',
      beneficios: ['Devolve a densidade', 'Previne a quebra', 'Elasticidade', 'Maciez extrema'],
      ativos: [
        { nome: 'Colágeno hidrolisado', funcao: 'Fonte de juventude para os fios: devolve a densidade, previne a quebra e proporciona elasticidade e maciez.' }
      ],
      passos: [
        { titulo: 'Shampoo', texto: 'Aplique nos cabelos molhados e massageie suavemente até formar espuma rica. Enxágue bem.' },
        { titulo: 'Máscara', texto: 'Com os fios limpos e úmidos, aplique mecha a mecha. Deixe agir de 5 a 10 minutos para reposição de colágeno.', tempo: '5–10 min', timer: [5, 10] },
        { titulo: 'Condicionador', texto: 'Aplique para selar as cutículas e garantir o brilho. Deixe agir por 2 minutos e enxágue totalmente.', tempo: '2 min', timer: [2] }
      ],
      ritual: ['colageno', 'oil-blend-rose', 'natocream'],
      faq: [
        { p: 'Em que ordem uso o kit?', r: 'Shampoo, depois a máscara (5 a 10 minutos) e por fim o condicionador (2 minutos).' },
        { p: 'Quanto tempo de pausa da máscara?', r: 'De 5 a 10 minutos, para a reposição de colágeno.' },
        { p: 'Para que serve o condicionador?', r: 'Sela as cutículas e garante o brilho. Deixe agir por 2 minutos e enxágue totalmente.' }
      ]
    },
    {
      slug: 'hydraspecial',
      nome: 'Hydraspecial',
      nomeCompleto: 'Kit Hydraspecial',
      tag: 'Revitalização Total',
      subtitulo: 'Cuidados Intensivos',
      categoria: 'manutencao',
      necessidades: ['hidratacao', 'nutricao'],
      cor: '#65A30D',
      img: 'hydro',
      kit: ['Shampoo', 'Máscara', 'Condicionador'],
      alt: 'Kit Hydraspecial da Youse Cosmetics: shampoo, condicionador e dois potes de máscara com tampa verde-limão',
      resumo: 'Extrato de quiabo e biotina para fortalecer, nutrir e hidratar cabelos enfraquecidos.',
      descricao: 'Linha completa formulada com extrato de quiabo e biotina. Desenvolvida para fortalecer, nutrir e hidratar profundamente. Devolve a saúde, o brilho e a maciez para cabelos enfraquecidos, atuando de dentro para fora.',
      papel: 'Hidrata e fortalece',
      beneficios: ['Fortalece', 'Nutre', 'Hidrata profundamente', 'Brilho e maciez'],
      ativos: [
        { nome: 'Extrato de quiabo', funcao: 'Hidratação profunda para devolver saúde e maciez aos fios.' },
        { nome: 'Biotina', funcao: 'Contribui para fortalecer e nutrir cabelos enfraquecidos.' }
      ],
      passos: [
        { titulo: 'Shampoo', texto: 'Aplique nos cabelos molhados, massageando suavemente até formar espuma. Enxágue e repita se necessário.' },
        { titulo: 'Máscara', texto: 'Com os fios úmidos, aplique mecha a mecha enluvando bem. Deixe agir de 5 a 10 minutos para penetração profunda e enxágue.', tempo: '5–10 min', timer: [5, 10] },
        { titulo: 'Condicionador', texto: 'Aplique para selar as cutículas. Deixe agir por 2 a 3 minutos e enxágue completamente.', tempo: '2–3 min', timer: [2, 3] }
      ],
      ritual: ['hydraspecial', 'glamour', 'oil-blend-rose'],
      faq: [
        { p: 'Em que ordem uso o kit?', r: 'Shampoo, depois a máscara (5 a 10 minutos) e por fim o condicionador (2 a 3 minutos).' },
        { p: 'Quanto tempo de pausa da máscara?', r: 'De 5 a 10 minutos, enluvando bem os fios.' },
        { p: 'Para que tipo de cabelo?', r: 'Cabelos enfraquecidos, que precisam de força, nutrição e hidratação profunda.' }
      ]
    },
    {
      slug: 'pos-salao',
      nome: 'Pós Salão',
      nomeCompleto: 'Kit Pós Salão',
      tag: 'Manutenção Diária',
      subtitulo: 'Cuidados Intensivos',
      categoria: 'manutencao',
      necessidades: ['hidratacao'],
      cor: '#FB923C',
      img: 'salao',
      kit: ['Shampoo', 'Condicionador'],
      alt: 'Kit Pós Salão da Youse Cosmetics: shampoo e condicionador em frascos laranja com detalhes verdes',
      resumo: 'Prolonga o efeito dos procedimentos químicos com manteiga de karité e aminoácidos.',
      descricao: 'Desenvolvida para prolongar o efeito de procedimentos químicos. Enriquecida com manteiga de karité e blend de aminoácidos. Proporciona hidratação profunda, reparação da fibra e fortalecimento, garantindo fios nutridos e resistentes em casa.',
      papel: 'Prolonga o efeito do salão',
      beneficios: ['Prolonga o efeito da química', 'Hidratação profunda', 'Reparação da fibra', 'Fortalecimento em casa'],
      ativos: [
        { nome: 'Manteiga de karité', funcao: 'Hidratação profunda para manter os fios nutridos depois do salão.' },
        { nome: 'Blend de aminoácidos', funcao: 'Atua na reparação da fibra e no fortalecimento dos fios.' }
      ],
      passos: [
        { titulo: 'Higienização (Shampoo)', texto: 'Aplique nos cabelos molhados, massageando suavemente o couro cabeludo até formar espuma rica. Enxágue e repita se necessário.' },
        { titulo: 'Selagem e maciez (Condicionador)', texto: 'Após lavar, aplique o condicionador nos fios úmidos, distribuindo uniformemente. Deixe agir por 2 a 3 minutos e enxágue completamente.', tempo: '2–3 min', timer: [2, 3] }
      ],
      video: 3,
      ritual: ['pos-salao', 'oil-blend-argan', 'natocream'],
      faq: [
        { p: 'Para quem é o Pós Salão?', r: 'Para quem fez procedimentos químicos e quer prolongar o efeito em casa.' },
        { p: 'Quanto tempo deixo o condicionador?', r: 'De 2 a 3 minutos, depois enxágue completamente.' },
        { p: 'Preciso repetir o shampoo?', r: 'Apenas se necessário.' }
      ]
    },
    {
      slug: 'glamour',
      nome: 'Glamour',
      nomeCompleto: 'Kit Glamour',
      tag: 'Nutrição & Brilho',
      subtitulo: 'Luxo e Sofisticação',
      categoria: 'manutencao',
      necessidades: ['nutricao'],
      cor: '#D946EF',
      img: 'glamour',
      // [CLIENTE VALIDAR] a foto do kit mostra também uma Máscara Capilar; o catálogo cita só shampoo e condicionador
      kit: ['Shampoo', 'Condicionador'],
      alt: 'Linha Glamour da Youse Cosmetics: shampoo, condicionador e máscara em embalagens magenta',
      resumo: 'Óleo de argan para reparação intensa e brilho deslumbrante em cabelos ressecados.',
      descricao: 'O tratamento ideal para um toque de luxo. Formulada com óleo de argan, a linha proporciona reparação intensa e um brilho deslumbrante. Restaura a vitalidade de cabelos ressecados, deixando-os fortes e macios.',
      papel: 'Nutre e devolve o brilho',
      beneficios: ['Reparação intensa', 'Brilho deslumbrante', 'Restaura a vitalidade', 'Fios fortes e macios'],
      ativos: [
        { nome: 'Óleo de argan', funcao: 'Reparação intensa e brilho deslumbrante para cabelos ressecados.' }
      ],
      passos: [
        { titulo: 'Shampoo', texto: 'Aplique nos cabelos molhados e massageie o couro cabeludo até formar uma espuma rica e cremosa. Enxágue bem.' },
        { titulo: 'Condicionador', texto: 'Aplique nos fios ainda úmidos, distribuindo uniformemente. Deixe agir por 2 a 3 minutos para selar a nutrição e enxágue completamente.', tempo: '2–3 min', timer: [2, 3] }
      ],
      ritual: ['hydraspecial', 'glamour', 'oil-blend-rose'],
      faq: [
        { p: 'Para que tipo de cabelo?', r: 'Cabelos ressecados, que precisam de reparação, brilho e vitalidade.' },
        { p: 'Quanto tempo deixo o condicionador?', r: 'De 2 a 3 minutos, para selar a nutrição. Depois enxágue completamente.' }
      ]
    },
    {
      slug: 'purify',
      nome: 'Purify',
      nomeCompleto: 'Shampoo Purify Antirresíduos',
      tag: 'Limpeza Profunda',
      subtitulo: 'Shampoo Antirresíduos',
      categoria: 'manutencao',
      necessidades: ['liso'],
      cor: '#0D69CC',
      img: 'purify',
      alt: 'Shampoo Purify Antirresíduos da Youse Cosmetics: frasco branco com rótulo azul',
      resumo: 'Shampoo antirresíduos com alecrim e macadâmia: o passo 1 dos rituais de alinhamento.',
      descricao: 'Um shampoo formulado com extrato de alecrim e óleo de macadâmia. Ideal para preparar a fibra capilar, removendo impurezas, oleosidade e resíduos acumulados sem agredir. Garante frescor e leveza imediata.',
      papel: 'Limpa e prepara a fibra',
      beneficios: ['Remove impurezas e resíduos', 'Remove a oleosidade', 'Limpa sem agredir', 'Frescor e leveza imediata'],
      // [CLIENTE VALIDAR] função atribuída a cada ativo a partir da descrição geral
      ativos: [
        { nome: 'Extrato de alecrim', funcao: 'Compõe a limpeza profunda que remove impurezas e oleosidade, com sensação de frescor.' },
        { nome: 'Óleo de macadâmia', funcao: 'Compõe a fórmula que limpa a fibra sem agredir, deixando leveza imediata.' }
      ],
      passos: [
        { titulo: 'Aplicação inicial', texto: 'Com os cabelos molhados, aplique uma quantidade generosa do Shampoo Purify diretamente no couro cabeludo.' },
        { titulo: 'Massagem ativa', texto: 'Massageie suavemente com a ponta dos dedos até formar uma espuma rica e cremosa. Isso ativa a circulação e remove a oleosidade.' },
        { titulo: 'Enxágue e repetição', texto: 'Enxágue abundantemente. Se sentir necessidade (cabelos muito oleosos ou com muitos resíduos), repita a aplicação para abertura total das cutículas.', tempo: 'Repita se preciso' }
      ],
      ritual: ['purify', 'youliss', 'oil-blend-argan'],
      faq: [
        { p: 'Por que usar o Purify antes dos alinhadores?', r: 'Ele é o passo 1 dos rituais de alinhamento: remove impurezas, oleosidade e resíduos e prepara a fibra para receber o tratamento.' },
        { p: 'Preciso repetir a lavagem?', r: 'Se os cabelos estiverem muito oleosos ou com muitos resíduos, repita a aplicação para abertura total das cutículas.' },
        { p: 'Onde aplico?', r: 'Diretamente no couro cabeludo, com os cabelos molhados, massageando com a ponta dos dedos.' }
      ]
    },
    {
      slug: 'oil-blend-argan',
      nome: 'Oil Blend Argan',
      nomeCompleto: 'Oil Blend Argan',
      tag: 'Ouro Líquido',
      subtitulo: 'Argan Oil',
      categoria: 'manutencao',
      necessidades: ['finalizacao', 'nutricao'],
      cor: '#F59E0B',
      img: 'blend',
      alt: 'Oil Blend Argan da Youse Cosmetics: dois frascos de óleo dourado, um com válvula spray',
      resumo: 'Óleo de argan puro e antioxidante: combate o frizz na hora e protege dos danos diários.',
      descricao: 'Um tratamento luxuoso com óleo de argan puro. Conhecido pelo seu poder antioxidante, ele restaura a elasticidade, combate o frizz instantaneamente e cria uma película protetora contra danos diários.',
      papel: 'Finaliza, combate o frizz e protege',
      beneficios: ['Combate o frizz na hora', 'Restaura a elasticidade', 'Película protetora', 'Ação antioxidante'],
      ativos: [
        { nome: 'Óleo de argan puro', funcao: 'Poder antioxidante: restaura a elasticidade, combate o frizz e forma uma película protetora contra danos diários.' }
      ],
      passos: [
        { titulo: 'Ativação', texto: 'Aplique uma pequena quantidade nas palmas das mãos e esfregue levemente para aquecer e ativar o óleo.' },
        { titulo: 'Aplicação', texto: 'Espalhe uniformemente pelos fios, concentrando-se do meio para as pontas e nas áreas mais danificadas (evite a raiz).', tempo: 'Meio às pontas' },
        { titulo: 'Versatilidade', texto: 'Use nos cabelos úmidos para facilitar a escovação ou nos cabelos secos como finalizador de brilho e reparador de pontas.', tempo: 'Úmido ou seco' }
      ],
      ritual: ['purify', 'youliss', 'oil-blend-argan'],
      faq: [
        { p: 'Pode usar no cabelo seco?', r: 'Sim. No cabelo seco ele funciona como finalizador de brilho e reparador de pontas. No úmido, facilita a escovação.' },
        { p: 'Posso aplicar na raiz?', r: 'Evite a raiz. Concentre do meio para as pontas e nas áreas mais danificadas.' },
        { p: 'Quanto usar?', r: 'Uma pequena quantidade, aquecida nas palmas das mãos antes de aplicar.' }
      ]
    },
    {
      slug: 'oil-blend-rose',
      nome: 'Oil Blend Rosé',
      nomeCompleto: 'Oil Blend Rosé',
      tag: 'Regeneração & Brilho',
      subtitulo: 'Rosé',
      categoria: 'manutencao',
      necessidades: ['finalizacao', 'nutricao'],
      cor: '#E69094',
      img: 'rose',
      alt: 'Oil Blend Rosé da Youse Cosmetics: frasco rosa com válvula spray',
      resumo: 'Óleo de rosa mosqueta: renova a estrutura, elimina a opacidade e devolve a maciez.',
      descricao: 'Tratamento premium enriquecido com óleo de rosa mosqueta. Reconhecido por suas propriedades regeneradoras, ele renova a estrutura capilar, elimina a opacidade e devolve a maciez a cabelos fragilizados.',
      papel: 'Regenera e tira a opacidade',
      beneficios: ['Renova a estrutura capilar', 'Elimina a opacidade', 'Devolve a maciez', 'Para cabelos fragilizados'],
      ativos: [
        { nome: 'Óleo de rosa mosqueta', funcao: 'Propriedades regeneradoras: renova a estrutura capilar e devolve a maciez a cabelos fragilizados.' }
      ],
      passos: [
        { titulo: 'Aquecimento', texto: 'Coloque uma pequena quantidade nas mãos e friccione para aquecer o óleo, potencializando a absorção pela fibra capilar.' },
        { titulo: 'Distribuição', texto: 'Aplique uniformemente, focando nas pontas duplas e nas áreas mais ressecadas. Evite a raiz para manter o volume natural.', tempo: 'Pontas' },
        { titulo: 'Proteção diária', texto: 'Pode ser usado nos cabelos úmidos antes de secar ou nos cabelos secos para finalizar e proteger contra agressões externas.', tempo: 'Úmido ou seco' }
      ],
      ritual: ['hydraspecial', 'glamour', 'oil-blend-rose'],
      faq: [
        { p: 'Pode usar no cabelo seco?', r: 'Sim. Nos cabelos secos ele finaliza e protege contra agressões externas. Também pode ser usado nos úmidos, antes de secar.' },
        { p: 'Posso aplicar na raiz?', r: 'Evite a raiz para manter o volume natural. Foque nas pontas duplas e nas áreas mais ressecadas.' }
      ]
    },
    {
      slug: 'natocream',
      nome: 'Natocream',
      nomeCompleto: 'Natocream Leave-in Hidratante',
      tag: 'Finalização Perfeita',
      subtitulo: 'Leave-in Hidratante',
      categoria: 'manutencao',
      necessidades: ['finalizacao', 'hidratacao'],
      cor: '#2563EB',
      img: 'nato_azul',
      alt: 'Natocream Leave-in Hidratante da Youse Cosmetics: frasco branco com válvula pump e rótulo azul',
      resumo: 'Leave-in leve, de rápida absorção: hidrata, reduz o frizz e dá definição sem pesar.',
      descricao: 'Creme de finalização leve e de rápida absorção. Ideal para hidratar e proteger os fios ao longo do dia. Reduz o frizz e proporciona definição e controle, mantendo o movimento natural sem pesar.',
      papel: 'Finaliza com definição, sem pesar',
      beneficios: ['Hidrata e protege o dia todo', 'Reduz o frizz', 'Definição e controle', 'Leve, sem pesar'],
      // [PREENCHER: ativos do Natocream — a descrição oficial não cita ingredientes]
      ativos: [
        { nome: 'Textura leve de rápida absorção', funcao: 'Hidrata e protege os fios ao longo do dia, mantendo o movimento natural sem pesar.' }
      ],
      passos: [
        { titulo: 'Preparação', texto: 'Após lavar e tratar os cabelos (sugerimos o Shampoo Purify), retire o excesso de umidade suavemente com uma toalha.' },
        { titulo: 'Aplicação', texto: 'Coloque uma quantidade suficiente na palma da mão e distribua uniformemente por toda a extensão dos fios, evitando a raiz.', tempo: 'Evite a raiz' },
        { titulo: 'Finalização', texto: 'Não enxágue. Deixe secar naturalmente para um look despojado ou finalize como desejar para maior definição.', tempo: 'Sem enxágue' }
      ],
      ritual: ['pos-salao', 'oil-blend-argan', 'natocream'],
      faq: [
        { p: 'Precisa enxaguar?', r: 'Não. O Natocream é um leave-in: aplique e deixe nos fios.' },
        { p: 'Como finalizar?', r: 'Deixe secar naturalmente para um look despojado ou finalize como desejar para maior definição.' },
        { p: 'Pesa no cabelo?', r: 'Não. É um creme leve, de rápida absorção, que mantém o movimento natural.' }
      ]
    }
  ];

  /* Perguntas que dependem de informação nova: NÃO são publicadas respondidas. */
  const faqPendente = [
    '[CLIENTE INFORMAR] Qual o volume/gramatura de cada embalagem?',
    '[CLIENTE INFORMAR] Qual o registro/notificação na Anvisa?',
    '[CLIENTE INFORMAR] Pode usar durante a gestação ou amamentação?',
    '[CLIENTE INFORMAR] Pode usar em crianças?',
    '[CLIENTE INFORMAR] Pode usar em cabelo descolorido ou com mechas?',
    '[CLIENTE INFORMAR] Quanto tempo dura o efeito / quando reaplicar?'
  ];

  const videos = [
    { n: 1, arquivo: 'video_1.mp4', poster: 'poster-1', titulo: 'Liso Espelhado', legenda: 'Resultado com Youliss', produto: 'youliss', duracao: 36 },
    { n: 2, arquivo: 'video_2.mp4', poster: 'poster-2', titulo: 'Hidratação SOS', legenda: 'Recuperação total', produto: 'sos', duracao: 35 },
    // [CLIENTE VALIDAR] o vídeo 3 mostra a máscara SOS aplicada no salão; o botão leva ao Pós Salão
    { n: 3, arquivo: 'video_3.mp4', poster: 'poster-3', titulo: 'Salão em Casa', legenda: 'Linha Pós-Salão', produto: 'pos-salao', duracao: 23 }
  ];

  /* Antes & depois.
   * youliss / youliss-2: fotos de cliente enviadas pela Youse (originais em ../midia-extra/antes-depois).
   * salao: quadros do início e do fim do vídeo "Salão em Casa".
   * home: false → o par aparece só na página do produto. */
  const antesDepois = [
    { id: 'youliss', titulo: 'Liso com Youliss', antes: 'youliss-antes', depois: 'youliss-depois', produto: 'youliss', fonte: 'Fotos reais de cliente, antes e depois do Youliss', altAntes: 'Cabelo castanho escuro, de costas, antes do Youliss: fios armados, com frizz e pontas desalinhadas', altDepois: 'O mesmo cabelo, de costas, depois do Youliss: liso, alinhado e com brilho espelhado, ao lado do frasco Youliss' },
    { id: 'youliss-2', titulo: 'Youliss · outro ângulo', antes: 'youliss-2-antes', depois: 'youliss-2-depois', produto: 'youliss', home: false, fonte: 'Fotos reais de cliente, antes e depois do Youliss', altAntes: 'Mão levantando uma mecha de cabelo escuro antes do Youliss, mostrando frizz e fios rebeldes na raiz', altDepois: 'Cabelo escuro, de costas, depois do Youliss: liso e brilhante até as pontas, com o frasco Youliss ao lado' },
    { id: 'salao', titulo: 'Do ondulado ao liso', antes: 'salao-antes', depois: 'salao-depois', produto: 'pos-salao', fonte: 'Quadros do vídeo “Salão em Casa”', altAntes: 'Cabelo loiro, de costas, antes: ondulado, com frizz e pontas secas', altDepois: 'O mesmo cabelo loiro, de costas, depois: liso, alinhado e com brilho' }
  ];

  /* Diagnóstico Capilar — [CLIENTE VALIDAR] mapeamento queixa → ritual */
  const diagnostico = [
    { id: 'frizz', queixa: 'Frizz e volume', detalhe: 'Fios armados, que não assentam', ritual: ['purify', 'youliss', 'oil-blend-argan'], tempo: '40 min de pausa no Youliss' },
    { id: 'elastico', queixa: 'Fio elástico ou emborrachado', detalhe: 'Estica e não volta, depois da química', ritual: ['purify', 'sos', 'natocream'], tempo: '5–10 min de pausa no SOS' },
    { id: 'ressecado', queixa: 'Ressecado e opaco', detalhe: 'Sem brilho, áspero ao toque', ritual: ['hydraspecial', 'glamour', 'oil-blend-rose'], tempo: '5–10 min de máscara Hydraspecial' },
    { id: 'fino', queixa: 'Fino e quebradiço', detalhe: 'Quebra fácil, pouca densidade', ritual: ['colageno', 'oil-blend-rose', 'natocream'], tempo: '5–10 min de máscara Colágeno' },
    { id: 'progressiva', queixa: 'Quero manter minha progressiva', detalhe: 'Prolongar o efeito do salão', ritual: ['pos-salao', 'oil-blend-argan', 'natocream'], tempo: '2–3 min de condicionador' },
    { id: 'danificado', queixa: 'Danificado, sem massa', detalhe: 'Fios porosos, sem corpo', ritual: ['purify', 'btx-quiabo', 'oil-blend-argan'], tempo: '20–40 min de pausa no BTX' }
  ];

  const ingredientes = [
    { nome: 'Quiabo', detalhe: 'O ativo-assinatura da Youse: hidratação profunda e alinhamento natural.', produtos: ['quiabo', 'btx-quiabo', 'hydraspecial'] },
    { nome: 'Óleo de argan', detalhe: 'Antioxidante: reparação, brilho e proteção contra danos diários.', produtos: ['glamour', 'oil-blend-argan'] },
    { nome: 'Rosa mosqueta', detalhe: 'Regenerador: renova a estrutura e elimina a opacidade.', produtos: ['oil-blend-rose'] },
    { nome: 'Colágeno hidrolisado', detalhe: 'Devolve a densidade, previne a quebra e dá elasticidade.', produtos: ['colageno'] },
    { nome: 'Biotina', detalhe: 'Fortalece e nutre cabelos enfraquecidos.', produtos: ['hydraspecial'] },
    { nome: 'Alecrim & macadâmia', detalhe: 'Limpeza profunda que remove resíduos sem agredir.', produtos: ['purify'] },
    { nome: 'Karité & aminoácidos', detalhe: 'Hidratação profunda, reparação da fibra e fortalecimento.', produtos: ['pos-salao'] },
    { nome: 'D-Pantenol & Ômegas', detalhe: 'Com colágeno, reparam a estrutura e restauram a força.', produtos: ['sos'] }
  ];

  const porSlug = {};
  produtos.forEach((p, i) => { p.ordem = i; p.tema = tema(p.cor); porSlug[p.slug] = p; });

  root.YOUSE = {
    site, whats, categorias, necessidades, produtos, porSlug,
    faqPendente, videos, antesDepois, diagnostico, ingredientes,
    cores: { tema, contraste, misturar }
  };
})(typeof window !== 'undefined' ? window : globalThis);
