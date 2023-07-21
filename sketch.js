// Variáveis da Bolinha
let xBolinha = 300;
let yBolinha = 200;
let diametro = 18;
let raio = diametro / 2;
let velocidadeXBolinha = 7;
let velocidadeYBolinha = 7;

// Variáveis da Raquete do Jogador
let xRaquete = 1;
let yRaquete = 150;
let wRaquete = 10;
let hRaquete = 100;
let velocidadeRaquete = 5;

// Variáveis da Raquete do Oponente
let xRaqueteOponente = 589;
let yRaqueteOponente = 150;
let velocidadeYOponente;
let chanceDeErrar = 0;

// Placar do Jogo
let meusPontos = 0;
let pontosDoOponente = 0;

// Sons do Jogo
let raquetada;
let ponto;
let trilha;

let isJogoPausado = false; // Variável para controlar o estado do jogo (pausado ou não)

function preload() {
  trilha = loadSound("trilha.mp3");
  raquetada = loadSound("raquetada.mp3");
  ponto = loadSound("ponto.mp3");
}

function setup() {
  createCanvas(600, 400);
  trilha.loop();
}

function draw() {
  background(0);
  
  if (isJogoPausado) {
    // Se o jogo estiver pausado, mostrar o aviso no meio da tela
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Jogo Pausado", width / 2, height / 2);
  } else {
    // Restante do código de desenho e lógica do jogo
    mostraBolinha();
    movimentaBolinha();
    verificaColisaoBorda();
    mostraRaquete(xRaquete, yRaquete);
    movimentaRaquete();
    verificaColisaoRaquete(xRaquete, yRaquete);
    verificaColisaoRaquete(xRaqueteOponente, yRaqueteOponente);
    mostraRaqueteOponente(xRaqueteOponente, yRaqueteOponente);
    movimentaRaqueteOponente();
    incluiPlacar();
    marcaPonto();
    bolinhaNaoFicaPresa();
  }
}

// Função para exibir a Bolinha
function mostraBolinha() {
  fill(255);
  circle(xBolinha, yBolinha, diametro);
}

// Função para mover a Bolinha
function movimentaBolinha() {
  xBolinha += velocidadeXBolinha;
  yBolinha += velocidadeYBolinha;
}

// Função para verificar colisão com as bordas da tela
function verificaColisaoBorda() {
  if (xBolinha + raio > width || xBolinha - raio < 0) {
    velocidadeXBolinha *= -1;
  }
  if (yBolinha + raio > height || yBolinha - raio < 0) {
    velocidadeYBolinha *= -1;
  }
}

// Função para exibir a Raquete
function mostraRaquete(x, y) {
  fill(255);
  rect(x, y, wRaquete, hRaquete);
}

// Função para mover a Raquete do Jogador
function movimentaRaquete() {
  if (keyIsDown(UP_ARROW)) {
    yRaquete -= velocidadeRaquete;
  }
  if (keyIsDown(DOWN_ARROW)) {
    yRaquete += velocidadeRaquete;
  }
  yRaquete = constrain(yRaquete, 10, 310); // Limita a movimentação dentro da tela
}

// Função para verificar colisão da Bolinha com a Raquete
function verificaColisaoRaquete(x, y) {
  if (
    xBolinha - raio < x + wRaquete &&
    xBolinha + raio > x &&
    yBolinha - raio < y + hRaquete &&
    yBolinha + raio > y
  ) {
    velocidadeXBolinha *= -1; // Inverte a direção da Bolinha
    raquetada.play();
  }
}

// Função para exibir a Raquete do Oponente
function mostraRaqueteOponente() {
  fill(255);
  rect(xRaqueteOponente, yRaqueteOponente, wRaquete, hRaquete);
}

// Função para mover a Raquete do Oponente
function movimentaRaqueteOponente() {
  velocidadeYOponente = yBolinha - yRaqueteOponente - wRaquete / 2 - 30;
  yRaqueteOponente += velocidadeYOponente + chanceDeErrar;
  calculaChanceDeErrar();
  yRaqueteOponente = constrain(yRaqueteOponente, 10, 310); // Limita a movimentação dentro da tela
}

// Função para exibir o Placar do Jogo
function incluiPlacar() {
  stroke(255);
  textAlign(CENTER, CENTER);
  textSize(16);
  fill(color(255, 140, 0));
  let placarXJogador = 190; // Coordenada X do retângulo do placar do jogador
  let placarXOponente = 490; // Coordenada X do retângulo do placar do oponente

  // Desenha o retângulo para o placar do jogador
  rect(placarXJogador, 14, 40, 20);
  fill(255);
  text(meusPontos, placarXJogador + 20, 26); // Centraliza o placar do jogador no retângulo

  // Desenha o retângulo para o placar do oponente
  fill(color(255, 140, 0));
  rect(placarXOponente, 14, 40, 20);
  fill(255);
  text(pontosDoOponente, placarXOponente + 20, 26); // Centraliza o placar do oponente no retângulo
}


// Função para marcar pontos quando a Bolinha ultrapassa a tela do adversário
function marcaPonto() {
  if (xBolinha > 589) {
    meusPontos += 1;
    reiniciarBolinha();
    ponto.play();
  }
  if (xBolinha < 11) {
    pontosDoOponente += 1;
    reiniciarBolinha();
    ponto.play();
  }
}

// Função para reiniciar a posição da Bolinha
function reiniciarBolinha() {
  xBolinha = width / 2;
  yBolinha = height / 2;
}

// Função para calcular a chance de erro do oponente
function calculaChanceDeErrar() {
  if (pontosDoOponente >= meusPontos) {
    chanceDeErrar += 1;
    if (chanceDeErrar >= 39) {
      chanceDeErrar = 40;
    }
  } else {
    chanceDeErrar -= 1;
    if (chanceDeErrar <= 35) {
      chanceDeErrar = 35;
    }
  }
}

// Função para evitar que a bolinha fique presa na borda
function bolinhaNaoFicaPresa() {
  if (xBolinha - raio < 0) {
    xBolinha = 23;
  }
}

// Função para pausar e despausar o jogo
function keyTyped() {
  if (key === 'p') {
    if (isJogoPausado) {
      // Se o jogo estiver pausado, despausar (retomar as velocidades)
      velocidadeXBolinha = direcaoXBolinhaAntesPausa;
      velocidadeYBolinha = direcaoYBolinhaAntesPausa;
      velocidadeRaquete = 5;
      isJogoPausado = false;
    } else {
      // Se o jogo estiver em execução, pausar (armazenar as direções e zerar as velocidades)
      direcaoXBolinhaAntesPausa = velocidadeXBolinha;
      direcaoYBolinhaAntesPausa = velocidadeYBolinha;
      velocidadeXBolinha = 0;
      velocidadeYBolinha = 0;
      velocidadeRaquete = 0;
      isJogoPausado = true;
    }
  }
}