
class Pessoa {

  constructor(posicao) {
    this.posicao = posicao;
    this.vel = p5.Vector.fromAngle(random() * TWO_PI, 0.2);
    this.acc = createVector(0, 0);
    this.dataInfeccao = undefined;
    this.emQuarentena = false;
    this.movendoParaQuarentena = false;
    this.qtdInfectados = 0;
    // 50% de chance de participar do isolamento social
    this.distanciamentoSocial = HABILITA_DISTANCIAMENTO ? (random() <= PERCENTUAL_PARTICIPANDO_DISTANCIAMENTO_SOCIAL) : false;
  }

  setEstado(estado) {
    this.estado = estado;
    this.estado.setPessoa(this);
  }

  distanciaSocialMantida(infecciosa) {
    //se a pessoa está de quarentena, não pode mais infectar
    if (infecciosa.emQuarentena) {
      return true;
    }
    return this.posicao.dist(infecciosa.posicao) > RAIO_ALCANCE;
  }

  aplicaContagio() {
    this.dataInfeccao = new Date();
    this.setEstado(new PessoaInfecciosa());
    this.estado.assintomatico = random() <= PERCENTUAL_ASSINTOMATICO;
  }

  aplicaRecuperacao() {
    this.dataInfeccao = undefined;
    this.setEstado(new PessoaRecuperada());
  }

  protegeComMascara() {
    this.setEstado(new PessoaSuscetivelComMascara());
  }

  vacina() {
    this.setEstado(new PessoaVacinada());
  }

  enviaParaQuarentena() {
    this.emQuarentena = true;
    this.movendoParaQuarentena = true;

    var deltaX = limitesQuarentena.centro.x - this.posicao.x;
    var deltaY = -(this.posicao.y - limitesQuarentena.centro.y);

    // faz com que o vetor de aceleração aponte para o centro da quarentena
    this.acc.set(deltaX, deltaY);
    this.acc.normalize();
    this.acc.mult(5);
  }

  anda(populacao, iAtual) {

    if (this.movendoParaQuarentena) {
      this._moveParaQuarentena();
      return;
    }

    if (this.distanciamentoSocial) {

      for (let i = 0; i < populacao.length; i++) {
        const outraPessoa = populacao[i];

        if (i == iAtual) continue;
        
        var distancia = this.posicao.dist(outraPessoa.posicao);
        if (distancia <= FATOR_DISTANCIAMENTO) {

          //debug
          // push();
          // stroke(255);
          // line(this.posicao.x, this.posicao.y, outraPessoa.posicao.x, outraPessoa.posicao.y);
          // pop();

          var deltaX = outraPessoa.posicao.x - this.posicao.x;
          // inverte o sinal pois o y é invertido
          var deltaY = -(this.posicao.y - outraPessoa.posicao.y);
          var angle = Math.atan2(deltaY, deltaX);

          // add 180 para apontar para a direção oposta
          angle += PI;

          // essa função gera uma força de acordo a distância, quanto mais longe
          // menos força exercida, por isso o "1-", para poder inverter a proporção, 
          // se o resultado for 0.6, fica 0.4. A parte 1/distancia, gera um número entre
          // 1 e algo próximo de 0. E log é para mapear (ver função de log)
          var forca = -Math.log(1 - (1/distancia));

          this.acc.x = cos(angle) * forca;
          this.acc.y = sin(angle) * forca;

          // debug
          // var xAcc = this.posicao.x + cos(angle) * 10 * forca;
          // var yAcc = this.posicao.y + sin(angle) * 10 * forca;

          // var cor = forca > 0.8 ? [0, 255, 0] : [0, 0, 255];
          // push();
          // stroke(cor);
          // line(this.posicao.x, this.posicao.y, xAcc, yAcc);
          // pop();
        }

        this.vel.add(this.acc);    
        this.vel.limit(1);
      }
    } else {
      this.acc = p5.Vector.fromAngle(random() * TWO_PI, randomGaussian(0, 0.05));
      this.vel.add(this.acc);
      this.vel.limit(0.5);
    }

    this.posicao.add(this.vel);

    // delimita fronteiras
    var limites = this.emQuarentena ? limitesQuarentena : limitesPopulacao;

    if (this.posicao.x >= limites.x2 || this.posicao.x <= limites.x1) {
      this.vel.x *= -1;
      this.acc.x *= -1;
    }

    if (this.posicao.y >= limites.y2 || this.posicao.y <= limites.y1) {
      this.vel.y *= -1;
      this.acc.y *= -1;
    }
  }

  _moveParaQuarentena() {
    this.vel.add(this.acc);
    this.posicao.add(this.vel);

    // verifica se já está na área de quarentena
    var centroQuarentena = createVector(limitesQuarentena.centro.x, limitesQuarentena.centro.y);
    if (centroQuarentena.dist(this.posicao) <= 40) {
      this.movendoParaQuarentena = false;
    }
  }

  atualizaQtdInfectados() {
    this.qtdInfectados++;
  }

  draw() {
    this.estado.draw();
  }

}