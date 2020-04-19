
class PessoaSuscetivel {

  setPessoa(pessoa) {
    this.pessoa = pessoa;
  }

  draw() {
    push();
    translate(this.pessoa.posicao.x, this.pessoa.posicao.y);
    fill(cores.pessoa.suscetivel.preenchimento);
    noStroke();
    circle(0, 0, TAMANHO_PESSOA);
    pop();
  }

  get probabilidadeProtecao() {
    return 1;
  }

}

class PessoaInfecciosa {

  constructor() {
    this.assintomatico = false;
  }

  setPessoa(pessoa) {
    this.pessoa = pessoa;
  }

  draw() {
    push();
    translate(this.pessoa.posicao.x, this.pessoa.posicao.y);
    noStroke();
    if (this.assintomatico) {
      fill(cores.pessoa.infectada.preenchimentoAssintomatico);      
    } else {
      fill(cores.pessoa.infectada.preenchimento);
    }
    
    circle(0, 0, TAMANHO_PESSOA);

    this._drawRaio();

    pop();

    var diffSegundos = abs(this.pessoa.dataInfeccao - new Date()) / 1000;

    // verifica se está recuperado
    if (diffSegundos >= TEMPO_RECUPERACAO) {
      this.pessoa.aplicaRecuperacao();
    }

    // após x dias e feito o teste, deve ser enviado para quarentena
    if (!this.pessoa.emQuarentena && diffSegundos >= TEMPO_ENVIO_QUARENTENA && HABILITA_ISOLAMENTO
        && !this.assintomatico) {
      this.pessoa.enviaParaQuarentena();
    }
  }

  _drawRaio() {

    var alpha = map(this.pessoa.raioAnimacao, TAMANHO_PESSOA, RAIO_ALCANCE, 255, 100);
    var sWeight = map(this.pessoa.raioAnimacao, TAMANHO_PESSOA, RAIO_ALCANCE, 5, 2);

    push();
    strokeWeight(sWeight);

    if (this.assintomatico) {
      stroke(cores.pessoa.infectada.raioAssintomatico.concat([alpha]));      
    } else {
      stroke(cores.pessoa.infectada.raio.concat([alpha]));
    }    

    //stroke(255, 20, 20, alpha);
    noFill();
    circle(0, 0, this.pessoa.raioAnimacao);
    pop();

    if (this.pessoa.raioAnimacao < RAIO_ALCANCE) {
      // calcula para a animação durar 1/2s
      var taxa = (RAIO_ALCANCE - TAMANHO_PESSOA) / 30;
      this.pessoa.raioAnimacao += taxa;      
    } else {
      this.pessoa.raioAnimacao = TAMANHO_PESSOA;
    }
  }

  get probabilidadeProtecao() {
    return 1;
  }
}

class PessoaRecuperada {

  setPessoa(pessoa) {
    this.pessoa = pessoa;
  }

  draw() {
    push();
    translate(this.pessoa.posicao.x, this.pessoa.posicao.y);
    noStroke();
    fill(cores.pessoa.recuperada.preenchimento);
    circle(0, 0, TAMANHO_PESSOA);
    pop();
  }

  get probabilidadeProtecao() {
    return 1;
  }

}

class PessoaSuscetivelComMascara {

  setPessoa(pessoa) {
    this.pessoa = pessoa;
  }

  draw() {
    push();
    translate(this.pessoa.posicao.x, this.pessoa.posicao.y);
    fill(cores.pessoa.suscetivelComMascara.preenchimento);
    noStroke();
    circle(0, 0, TAMANHO_PESSOA);
    pop();
  }

  get probabilidadeProtecao() {
    return PROBALIDADE_INFECCAO_MASCARA;
  }

}

class PessoaVacinada {
  setPessoa(pessoa) {
    this.pessoa = pessoa;
  }

  draw() {
    push();
    translate(this.pessoa.posicao.x, this.pessoa.posicao.y);
    fill(cores.pessoa.vacinada.preenchimento);
    noStroke();
    circle(0, 0, TAMANHO_PESSOA);
    pop();
  }
}

