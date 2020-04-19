
class Simulacao {

  constructor() {
    this.populacao = [];
    this.regioes = [];
    this.RNought = 0;
    this.pacienteZero = undefined;
    this.ultimaVerificacaoContagio = new Date();
    this.ultimaAtualizacaoInfectados = new Date();
    this._criaPopulacao();
  }

  _draw() {    
    for (var i = 0; i < this.populacao.length; i++) {
      var p = this.populacao[i];
      p.anda(this.populacao, i);
      p.draw();
    }
    this._drawAreaQuarentena();
  }

  _criaPopulacao() {
    for (var i = 0; i < TAM_POPULACAO; i++) {
      var pessoa = this._criaPessoa();
      this.populacao.push(pessoa);
    }
    
    for (let i = 0; i < TAM_POPULACAO * PERCENTUAL_COM_MASCARA; i++) {
      this.populacao[i].protegeComMascara();
    }

    // vacina
    for (let i = 0; i < TAM_POPULACAO * PERCENTUAL_VACINACAO; i++) {
      this.populacao[i].vacina();
    }

    var iParaInfectar = parseInt(random() * TAM_POPULACAO);
    this.populacao[iParaInfectar].aplicaContagio();
    this.pacienteZero = this.populacao[iParaInfectar];
  }

  _criaPessoa() {
    var x = map(random() * width, 0, width, limitesPopulacao.x1, limitesPopulacao.x2);
    var y = map(random() * height, 0, height, limitesPopulacao.y1, limitesPopulacao.y2);

    var pos = createVector(x, y);
    var pessoa = new Pessoa(pos);
    pessoa.setEstado(new PessoaSuscetivel());
    return pessoa;
  }

  executa() {
    this._draw();
    this._atualizaRNought();
    this._verificaContagio();
  }

  _atualizaRNought() {
    var diffSegundos = abs(this.ultimaAtualizacaoInfectados - new Date()) / 1000;
    var qtdInfectados = this.getQtdInfectados();

    var x = 1;
    // depois de x segundos atualiza R nought
    if (diffSegundos < x  || qtdInfectados == 0) {
      return;
    }

    var infecciosos = this.populacao.filter(p => p.estado instanceof PessoaInfecciosa);

    var totalInfectados = 0;
    var qtdPropagadores = 0;
    for (var pInfecciosa of infecciosos) {
      if (pInfecciosa.qtdInfectados > 0) {
        // acumula quantos cada pessoa infectou
        totalInfectados += pInfecciosa.qtdInfectados;
        qtdPropagadores++;
      }
    }

    // média de transmissão
    this.RNought = qtdPropagadores > 0 ? totalInfectados / qtdPropagadores : 0;
    
    this.ultimaAtualizacaoInfectados = new Date();
  }

  _verificaContagio() {
    var diffSegundos = abs(this.ultimaVerificacaoContagio - new Date()) / 1000;

    // verifica a cada TEMPO_VERIFICACAO segundos
    if (diffSegundos < TEMPO_VERIFICACAO) {
      return;
    }
    
    this.ultimaVerificacaoContagio = new Date();

    var infecciosos = this.populacao.filter(p => p.estado instanceof PessoaInfecciosa);
    var suscetiveis = this.populacao.filter(p => 
      p.estado instanceof PessoaSuscetivel || p.estado instanceof PessoaSuscetivelComMascara);

    for (var pInfecciosa of infecciosos) {
      var diffSegundos = abs(pInfecciosa.dataInfeccao - new Date()) / 1000;
      // na metade do primeiro dia não é capaz de infectar outras pessoas, com execao do paciente zero
      var periodoSemInfectar = 1/8;
      if (diffSegundos < periodoSemInfectar && this.pacienteZero != pInfecciosa) {
        continue;
      }

      for (var pSuscetivel of suscetiveis) {
        // % de chance de infectar
        if (random() > PROBALIDADE_INFECCAO * pSuscetivel.estado.getProbabilidadeProtecao()) {
          continue;
        }
        if (!pSuscetivel.distanciaSocialMantida(pInfecciosa)) {
          pInfecciosa.atualizaQtdInfectados();
          pSuscetivel.aplicaContagio();
        }
      }
    };
  }

  getQtdInfectados() {
    return this.populacao
      .filter(p => p.estado instanceof PessoaInfecciosa)
      .length;
  }

  _drawAreaQuarentena() {
    if (!HABILITA_ISOLAMENTO) return;

    push();
    stroke(cores.isolamento.bordas);
    var margem = 10;
    line(limitesQuarentena.x1-margem, limitesQuarentena.y1-margem, 
      limitesQuarentena.x2+margem, limitesQuarentena.y1-margem);
    line(limitesQuarentena.x1-margem, limitesQuarentena.y1-margem, 
      limitesQuarentena.x1-margem, limitesQuarentena.y2+margem);
    line(limitesQuarentena.x1-margem, limitesQuarentena.y2+margem, 
      limitesQuarentena.x2+margem, limitesQuarentena.y2+margem);
    line(limitesQuarentena.x2+margem, limitesQuarentena.y2+margem, 
      limitesQuarentena.x2+margem, limitesQuarentena.y1-margem);

    fill(cores.isolamento.titulo);
    noStroke();
    textSize(20);
    text('Isolamento', limitesQuarentena.x1-margem, limitesQuarentena.y1-margem-5);
    pop();
  }

}