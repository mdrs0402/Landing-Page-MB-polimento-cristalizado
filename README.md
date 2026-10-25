# Landing Page: Polimento Cristalizado

Landing page de conversão para um profissional de estética automotiva de Manaus (AM). O objetivo é levar o visitante a pedir orçamento pelo WhatsApp. Foi feita **sem frameworks e sem dependências**, só com HTML, CSS e JavaScript puros.

🔗 **Site no ar:** https://mdrs0402.github.io/Landing-Page-MB-polimento-cristalizado/

![Prévia da landing page](docs/preview.png)

---

## Destaques técnicos

| Área | O que foi feito |
|---|---|
| **Arquitetura** | O conteúdo fica separado do código: marca, telefone, endereço, números, imagens e galeria estão em `js/config.js`, e o JavaScript aplica esses dados na página (`data-cfg`). Assim, quem não programa consegue editar o site sem mexer no HTML. |
| **Responsividade** | Layout *mobile-first* com CSS Grid, tipografia fluida com `clamp()` e galeria que muda de formato conforme a quantidade de fotos (seletores `:nth-child` / `:nth-last-child`). |
| **Performance** | Imagens em WebP, `loading="lazy"` e `decoding="async"` na galeria, `fetchpriority="high"` na imagem principal, `preconnect` para fontes e zero bibliotecas externas de JS. |
| **Acessibilidade** | HTML semântico, `aria-label` nos ícones e botões, lightbox acessível (`role="dialog"`, foco devolvido ao fechar, navegação por teclado com Esc e setas) e respeito a `prefers-reduced-motion`. |
| **SEO** | Meta tags, Open Graph para a prévia do link no WhatsApp e redes sociais, e dados estruturados **Schema.org (JSON-LD)** gerados dinamicamente a partir da configuração. |
| **Segurança** | Os dados da configuração passam por uma função de escape antes de entrar no HTML, o que evita injeção de HTML/XSS. Os links externos usam `rel="noopener"`. |
| **Robustez** | Se uma imagem não carregar, entra no lugar um *placeholder* SVG gerado em tempo de execução. |

## Funcionalidades

- Links de WhatsApp gerados automaticamente, com mensagem pré-preenchida
- Galeria de trabalhos com **lightbox**: teclado, clique fora para fechar e **gesto de deslizar no celular**
- Contadores animados (com *easing*) disparados por `IntersectionObserver` quando a seção aparece na tela
- Animações de entrada em cascata ao rolar a página
- Cabeçalho com efeito *glassmorphism* (`backdrop-filter`) depois da rolagem
- Botão flutuante de WhatsApp
- Link do endereço para o Google Maps e seções opcionais que somem quando o dado não é preenchido (Instagram, endereço, atendimento a domicílio)

## Tecnologias

- **HTML5** semântico
- **CSS3**: custom properties (tema trocável por variáveis), Grid, Flexbox, `clamp()`, animações com `@keyframes`
- **JavaScript (ES6+)** puro: IIFE, template literals, arrow functions, `IntersectionObserver`, `requestAnimationFrame`, `matchMedia`
- Ícones em **SVG sprite** (`<symbol>` / `<use>`), sem bibliotecas de ícones

## Estrutura

```
├── index.html       # Estrutura e conteúdo das seções
├── css/style.css    # Estilos, tema (variáveis CSS) e responsividade
├── js/config.js     # Dados editáveis do negócio (único arquivo que o cliente edita)
├── js/main.js       # Lógica: aplica a config, galeria, lightbox, animações e SEO
└── img/             # Fotos em WebP
```

## Como rodar localmente

Não há etapa de build. Basta abrir o `index.html` no navegador ou subir um servidor estático:

```bash
python -m http.server 5500
```

Depois, acesse `http://localhost:5500`.

## Personalização

Para adaptar a página a outro negócio, edite apenas `js/config.js`. Para mudar a cor do tema, troque as variáveis `--accent` e `--accent-2` no início de `css/style.css`.

---

Desenvolvido por **[mdrs0402](https://github.com/mdrs0402)**. Fique à vontade para entrar em contato!
