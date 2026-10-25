/* =====================================================================
   Funcionamento da página. Não é preciso editar este arquivo:
   os dados ficam em js/config.js
   ===================================================================== */
(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const escapar = (txt) =>
    String(txt).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Imagem reserva quando uma foto não carrega ---------- */
  function placeholder(texto) {
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">` +
      `<rect width="1200" height="800" fill="#161920"/>` +
      `<text x="600" y="390" fill="#33b5ff" font-family="sans-serif" font-size="34" text-anchor="middle">Foto não encontrada</text>` +
      `<text x="600" y="440" fill="#9aa3b2" font-family="sans-serif" font-size="24" text-anchor="middle">${escapar(texto).slice(0, 70)}</text></svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }
  function protegerImagem(img) {
    const trocar = () => {
      if (img.dataset.falhou) return;
      img.dataset.falhou = "1";
      img.src = placeholder(img.getAttribute("src").split("/").pop().split("?")[0] || img.alt);
    };
    img.addEventListener("error", trocar);
    if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) trocar();
  }

  /* ---------- WhatsApp ---------- */
  const numero = String(CONFIG.whatsapp).replace(/\D/g, "");
  const linkWhatsapp = `https://wa.me/${numero}?text=${encodeURIComponent(CONFIG.mensagemWhatsapp)}`;

  function formatarTelefone(n) {
    const local = n.startsWith("55") ? n.slice(2) : n;
    const ddd = local.slice(0, 2);
    const resto = local.slice(2);
    const meio = resto.length === 9 ? 5 : 4;
    return `(${ddd}) ${resto.slice(0, meio)}-${resto.slice(meio)}`;
  }

  /* ---------- Aplica os dados do config.js na página ---------- */
  function aplicarConfig() {
    const valores = { ...CONFIG, whatsappFormatado: formatarTelefone(numero) };

    $$("[data-cfg]").forEach((el) => {
      const v = valores[el.dataset.cfg];
      if (typeof v === "string") {
        el.textContent = v;
        if (!v) el.hidden = true;
      }
    });

    $$("[data-cfg-img]").forEach((img) => {
      const src = CONFIG.imagens[img.dataset.cfgImg];
      if (src && img.getAttribute("src") !== src) img.src = src;
    });

    $$(".js-whatsapp").forEach((a) => (a.href = linkWhatsapp));

    if (CONFIG.instagram) {
      $$(".js-instagram").forEach((a) => (a.href = `https://instagram.com/${CONFIG.instagram.replace(/^@/, "")}`));
    } else {
      $$("[data-instagram]").forEach((el) => el.remove());
    }

    if (!CONFIG.atendeDomicilio) $$("[data-domicilio]").forEach((el) => el.remove());

    if (CONFIG.endereco) {
      const busca = encodeURIComponent(`${CONFIG.endereco}, ${CONFIG.cidade}`);
      $$(".js-maps").forEach((a) => (a.href = `https://www.google.com/maps/search/?api=1&query=${busca}`));
    } else {
      $$("[data-endereco]").forEach((el) => el.remove());
    }

    $("#ano").textContent = new Date().getFullYear();
  }

  /* ---------- Números de destaque (com contagem animada) ---------- */
  function montarNumeros() {
    const lista = $("#stats");
    lista.innerHTML = CONFIG.numeros
      .map(
        (n) => `<li class="stat">
          <span class="stat__value"><span>${escapar(n.prefixo || "")}</span><b data-alvo="${Number(n.valor)}">${reduzMovimento ? Number(n.valor) : 0}</b><span>${escapar(n.sufixo || "")}</span></span>
          <span class="stat__label">${escapar(n.rotulo)}</span>
        </li>`
      )
      .join("");
    $$("b", lista).forEach((b) => (b.style.fontWeight = "inherit"));
    if (reduzMovimento) return;

    const contar = (el) => {
      const alvo = Number(el.dataset.alvo);
      const duracao = 1600;
      const inicio = performance.now();
      const passo = (agora) => {
        const t = Math.min((agora - inicio) / duracao, 1);
        el.textContent = Math.round(alvo * (1 - Math.pow(1 - t, 3))).toLocaleString("pt-BR");
        if (t < 1) requestAnimationFrame(passo);
      };
      requestAnimationFrame(passo);
    };
    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        $$("b[data-alvo]", lista).forEach(contar);
        obs.disconnect();
      });
    }, { threshold: 0.4 });
    obs.observe(lista);
  }

  /* ---------- Galeria + lightbox ---------- */
  function montarGaleria() {
    const galeria = $("#gallery");
    galeria.innerHTML = CONFIG.galeria
      .map(
        (f, i) => `<button class="gallery__item reveal" type="button" data-index="${i}" aria-label="Ampliar foto: ${escapar(f.alt)}">
          <img src="${escapar(f.src)}" alt="${escapar(f.alt)}" loading="lazy" decoding="async">
        </button>`
      )
      .join("");

    const box = $("#lightbox");
    const img = $(".lightbox__img", box);
    const legenda = $(".lightbox__caption", box);
    let atual = 0;
    let ultimoFoco = null;

    const mostrar = (i) => {
      atual = (i + CONFIG.galeria.length) % CONFIG.galeria.length;
      const f = CONFIG.galeria[atual];
      img.src = f.src;
      img.alt = f.alt;
      legenda.textContent = `${f.alt}  ·  ${atual + 1}/${CONFIG.galeria.length}`;
    };
    const abrir = (i) => {
      ultimoFoco = document.activeElement;
      mostrar(i);
      box.hidden = false;
      document.body.style.overflow = "hidden";
      $(".lightbox__close", box).focus();
    };
    const fechar = () => {
      box.hidden = true;
      document.body.style.overflow = "";
      if (ultimoFoco) ultimoFoco.focus();
    };

    galeria.addEventListener("click", (e) => {
      const item = e.target.closest(".gallery__item");
      if (item) abrir(Number(item.dataset.index));
    });
    $(".lightbox__close", box).addEventListener("click", fechar);
    $(".lightbox__prev", box).addEventListener("click", () => mostrar(atual - 1));
    $(".lightbox__next", box).addEventListener("click", () => mostrar(atual + 1));
    box.addEventListener("click", (e) => { if (e.target === box) fechar(); });
    document.addEventListener("keydown", (e) => {
      if (box.hidden) return;
      if (e.key === "Escape") fechar();
      if (e.key === "ArrowLeft") mostrar(atual - 1);
      if (e.key === "ArrowRight") mostrar(atual + 1);
    });

    // deslizar no celular
    let inicioX = null;
    box.addEventListener("touchstart", (e) => (inicioX = e.touches[0].clientX), { passive: true });
    box.addEventListener("touchend", (e) => {
      if (inicioX === null) return;
      const dx = e.changedTouches[0].clientX - inicioX;
      if (Math.abs(dx) > 50) mostrar(atual + (dx < 0 ? 1 : -1));
      inicioX = null;
    });
  }

  /* ---------- Dados estruturados para o Google ---------- */
  function seoEstruturado() {
    const dados = {
      "@context": "https://schema.org",
      "@type": "AutoWash",
      name: `${CONFIG.marca} ${CONFIG.marcaDestaque}`.trim(),
      description: `Polimento cristalizado profissional em ${CONFIG.cidade}.`,
      telephone: "+" + numero,
      areaServed: CONFIG.cidade,
      image: CONFIG.imagens.hero,
      url: location.origin + location.pathname,
    };
    if (CONFIG.endereco) {
      dados.address = { "@type": "PostalAddress", streetAddress: CONFIG.endereco, addressLocality: CONFIG.cidade, addressCountry: "BR" };
    }
    if (CONFIG.instagram) dados.sameAs = [`https://instagram.com/${CONFIG.instagram.replace(/^@/, "")}`];
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(dados);
    document.head.appendChild(s);
  }

  /* ---------- Header muda ao rolar ---------- */
  function headerAoRolar() {
    const header = $(".header");
    const checar = () => header.classList.toggle("is-scrolled", window.scrollY > 30);
    checar();
    window.addEventListener("scroll", checar, { passive: true });
  }

  /* ---------- Fade-in ao rolar ---------- */
  function animarAoRolar() {
    const itens = $$(".reveal");
    if (reduzMovimento || !("IntersectionObserver" in window)) {
      itens.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    // pequeno atraso em cascata para itens lado a lado
    itens.forEach((el) => {
      const irmaos = Array.from(el.parentElement.children).filter((c) => c.classList.contains("reveal"));
      el.style.transitionDelay = Math.min(irmaos.indexOf(el), 5) * 90 + "ms";
    });
    const obs = new IntersectionObserver(
      (entradas) =>
        entradas.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    itens.forEach((el) => obs.observe(el));
  }

  /* ---------- Início ---------- */
  aplicarConfig();
  montarNumeros();
  montarGaleria();
  seoEstruturado();
  $$("img").forEach(protegerImagem);
  headerAoRolar();
  animarAoRolar();
})();
