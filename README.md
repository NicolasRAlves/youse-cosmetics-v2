# Youse Cosmetics · Site v2

Site estático da Youse Cosmetics: HTML, CSS e JavaScript puros, sem framework e sem etapa de build obrigatória.
As páginas já estão geradas na pasta: dá para abrir com duplo clique ou publicar como está.

## Estrutura

```
site-v2/
├── index.html                 Home
├── produtos/index.html        Catálogo com filtros (aceita ?linha=tratamento e ?necessidade=liso)
├── produtos/<slug>/index.html 12 páginas de produto (geradas)
├── onde-comprar/              Mercado Livre e Dot Cosméticos lado a lado
├── seja-distribuidor/         Atacado + formulário que envia pelo WhatsApp
├── 404.html                   Página de erro (autossuficiente)
├── data/produtos.js           FONTE ÚNICA DE DADOS (produtos, rituais, vídeos, contatos)
├── templates/                 Modelos das páginas (home, produto, catálogo, onde comprar, distribuidor)
├── scripts/
│   ├── gerar-paginas.mjs      Gera as páginas a partir de data/ + templates/
│   ├── checar-links.mjs       Confere se toda imagem, vídeo, CSS, JS e link local existe
│   ├── processar-midia.sh     Recorta/otimiza fotos e vídeos a partir da pasta da v1 (ffmpeg)
│   └── lib/componentes.mjs    Cabeçalho, rodapé, cards, ícones e os “fios” em SVG
├── assets/css/                base.css · components.css · pages.css
├── assets/js/                 main · stories · antes-depois · diagnostico · produto · distribuidor
├── assets/img/                produtos (WebP 300/600/1200 + PNG), home, antes-depois, og, brand
├── assets/video/              vídeos recomprimidos + posters
└── sitemap.xml, robots.txt, favicon.ico, apple-touch-icon.png
```

## Abrir localmente

- **Duplo clique** em `index.html`. Os links funcionam: no modo arquivo, o `main.js` completa os endereços com `index.html`.
- **Com servidor**, mais fiel ao site publicado:
  ```bash
  npx serve .                 # ou
  python -m http.server 8000  # e abra http://localhost:8000
  ```

## Editar textos e produtos

1. Edite `data/produtos.js`: nome, descrição, ativos, passos, FAQ, ritual, cor, etc.
2. Rode `node scripts/gerar-paginas.mjs` (Node 18+, sem instalar nada).
3. Rode `node scripts/checar-links.mjs` para garantir que nada quebrou.

Textos fixos de cada página ficam em `templates/*.html`. **Não edite os `index.html` gerados à mão**: eles são sobrescritos na próxima geração.

## Trocar fotos e vídeos

**Foto de produto.** Coloque o PNG com fundo transparente em `../Youse-Cosmetics-main/img/produtos/` (mesmo nome) e rode:
```bash
bash scripts/processar-midia.sh
```
O script recorta o espaço vazio, gera os WebP 300/600/1200, o PNG de reserva e a imagem de compartilhamento na cor do produto. Para um **produto novo**, adicione o nome do arquivo e a cor no mapa `COR` do script e no campo `img` do produto em `data/produtos.js`.

**Vídeo.** Substitua `video_N.mp4` na pasta de origem e rode o mesmo script: ele recomprime (H.264, crf 28, `faststart`) e gera um novo poster. Os títulos e o produto ligado a cada vídeo ficam em `videos` dentro de `data/produtos.js`.

**Antes & depois.** O Youliss usa fotos reais de cliente (2 pares). O par "Do ondulado ao liso" usa quadros do vídeo 3. Para adicionar um par:
1. Salve as fotos em `../midia-extra/antes-depois/` como `<nome>-antes.png` e `<nome>-depois.png`. O ideal é 3:4, mas outros formatos são cortados no centro.
2. Rode `bash scripts/processar-midia.sh`. Ele gera `assets/img/antes-depois/<nome>-antes.webp/.jpg` (720×960).
3. Em `antesDepois` (`data/produtos.js`), crie o par com `id`, `antes`, `depois`, `produto`, `fonte` e os textos alternativos (`altAntes`/`altDepois`). Use `home: false` se ele não deve aparecer na home.
4. No produto, coloque `antesDepois: ['<id>']`. Pode listar mais de um par.
5. Rode `node scripts/gerar-paginas.mjs`.

Os produtos sem par mostram o espaço reservado `[FOTO ANTES — cliente]`.

**Galeria de clientes (home).** Em `blocoGaleria()` (`scripts/gerar-paginas.mjs`), troque cada vaga pelo `<li class="ugc">` com a imagem, como descrito no comentário, e gere de novo.

Sem ffmpeg, dá para gerar WebP em qualquer conversor online. Mantenha os nomes e tamanhos acima.

## Publicar

Antes de publicar, confirme o domínio em `data/produtos.js` → `site.url`. Ele é usado em canonical, Open Graph e `sitemap.xml`. Depois gere as páginas de novo.

- **Hostinger / hospedagem comum:** envie todo o conteúdo de `site-v2/` para `public_html/`. Para usar a página de erro própria, configure `404.html` no painel ou no `.htaccess` (`ErrorDocument 404 /404.html`).
- **Netlify:** arraste a pasta `site-v2` em app.netlify.com/drop. O `404.html` é usado automaticamente.
- **GitHub Pages:** suba o conteúdo de `site-v2` na raiz do repositório (ou em `/docs`) e ative o Pages. Os caminhos são relativos, então funciona também em `usuario.github.io/repositorio/`. Só os botões da `404.html` apontam para `/`: num subdiretório, troque por `/repositorio/`.

As pastas `templates/` e `scripts/` podem ir junto (o `robots.txt` bloqueia a indexação delas) ou ficar de fora da publicação.

## Qualidade verificada

- `checar-links.mjs`: 0 referências quebradas.
- Teste automatizado no Edge (85 verificações):
  - sem scroll horizontal em 360, 390, 768, 1280 e 1440 px;
  - diagnóstico com as 6 opções;
  - filtros;
  - stories: abrir, avançar, Esc e devolução do foco;
  - antes/depois;
  - mega-menu e menu móvel: foco preso e Esc;
  - barra de compra;
  - cronômetro;
  - formulário;
  - abertura com duplo clique;
  - console sem erros.
- Lighthouse mobile (Performance / Acessibilidade / Boas práticas / SEO):

| Página | Perf. | Acess. | Boas práticas | SEO |
|---|---|---|---|---|
| Home | 90 | 100 | 100 | 100 |
| Youliss | 97 | 100 | 100 | 100 |
| SOS | 97 | 100 | 100 | 100 |
| Onde comprar | 99 | 100 | 100 | 100 |
| Seja distribuidor | 90 | 100 | 100 | 100 |

## Marcadores no código

Busque por `[PREENCHER`, `[CLIENTE VALIDAR]`, `[CLIENTE APROVAR]` e `[CLIENTE INFORMAR]`. Todos estão listados em `../PENDENTES-CLIENTE.md`.
