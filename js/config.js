/* =====================================================================
   CONFIGURAÇÃO DO SITE  —  EDITE SOMENTE ESTE ARQUIVO
   ---------------------------------------------------------------------
   Tudo o que está aqui é EXEMPLO (fictício). Troque pelos dados reais.
   Cada item marcado com  // TROCAR  precisa ser substituído.

   Imagens: coloque suas fotos na pasta  img/  e troque o endereço,
   por exemplo:  hero: "img/hero.jpg"
   (os links do Unsplash abaixo servem só para a versão de demonstração)

   Atenção: o título, a descrição e a imagem que aparecem quando o link
   é compartilhado no WhatsApp ficam no <head> do index.html (procure
   por "TROCAR" lá também).
   ===================================================================== */

const CONFIG = {
  // ---------- Dados do profissional ----------
  marca: "MB Polimento",                 // TROCAR – nome da marca
  marcaDestaque: "Cristalizado",             // TROCAR – 2ª linha do logo (ou "" para esconder)
  nomePolidor: "Messias Ferreira Batista",   // nome do polidor
  whatsapp: "5592999999999",                 // TROCAR – 55 + DDD + número, só dígitos
  cidade: "Manaus - AM",                     // TROCAR – cidade / região
  atendeDomicilio: true,                     // TROCAR – true = sim | false = não
  endereco: "Rua Kako Caminha, 44 - Centro", // endereço do local próprio (ou "" para esconder)
  instagram: "mbpolimentoscristalizado",     // TROCAR – sem o @ (ou "" para esconder)

  // Mensagem que já vem escrita quando o cliente abre o WhatsApp
  mensagemWhatsapp:
    "Olá! Vi seu site e gostaria de um orçamento para polimento cristalizado.",

  // ---------- Números de destaque (seção "Sobre") ----------
  numeros: [                                  // TROCAR
    { valor: 320, prefixo: "+", sufixo: "",  rotulo: "carros polidos" },
    { valor: 5,   prefixo: "",  sufixo: "",  rotulo: "anos de experiência" },
    { valor: 100, prefixo: "",  sufixo: "%", rotulo: "clientes satisfeitos" },
  ],

  // ---------- Imagens principais ----------
  imagens: {
    hero:    "img/hero.webp",
    polidor: "img/polidor.jpg",
  },

  // ---------- Galeria de trabalhos ----------
  // Adicione ou remova itens à vontade.
  galeria: [
    { src: "img/trabalho1.webp", alt: "Toyota SW4 marrom com pintura espelhada após polimento" },
    { src: "img/trabalho2.webp", alt: "Fiat Mobi vermelho com brilho renovado na lataria" },
    { src: "img/trabalho3.webp", alt: "Honda City preto com reflexos profundos na pintura" },
    { src: "img/trabalho4.webp", alt: "Carro preto preparado e polido com acabamento cristalizado" },
    { src: "img/trabalho5.webp", alt: "Volkswagen Saveiro branca com lataria brilhando após polimento" },
  ],
};
