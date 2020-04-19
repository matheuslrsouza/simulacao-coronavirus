
class Grafico {

  constructor() {
    this.valores = [limitesGrafico.eixos.y2];
    this.tempoInicio = new Date();
    // vincula o indice de um valor no gráfico, cujo a virada de +4 dias aconteceu
    this.indicesDias = {};
    // mantem os dias já adicionados
    this.dias = [];

    this.mod = 4;
    this.maxDiasAMostrar = 4;
  }

  draw() {
    this._drawPlane();
    this._drawCapacidadeSistemaDeSaude();
    this._drawValores(); 
    this._drawSetaPercentualInfectado();    
  }

  addValor(valor) {
    var v = map(valor, 0, TAM_POPULACAO, limitesGrafico.eixos.y2, limitesGrafico.eixos.y1);
    this.valores.push(v);

    this._vinculaDiasDecorridos();    
  }

  _vinculaDiasDecorridos() {

    var diffSegundos = abs(this.tempoInicio - new Date()) / 1000;
    // cada 1s equivalem a 4 dias
    var diasDecorridos = ceil(diffSegundos * 4);    
    
    // se já passou 4 dias adicionamos o tempo no grafico
    if ((diasDecorridos) % this.mod == 0) {
      // como estamos arredondando, mais de um valor pode estar na virada de +4 dias
      // por isso só fazemos para o primeiro
      if (!this.dias[diasDecorridos]) {
        this.dias[diasDecorridos] = 1;
        //console.log('dias dec ', diasDecorridos/this.mod);

        // vincula o indice do ultimo valor adicionado com o tempo em que completou +4 dias
        this.indicesDias[""+(this.valores.length-1)] = 
          new Dia(diasDecorridos);
      }
        
    }

  }

  _drawValores() {
    push();
    beginShape();
    noStroke();
    fill(cores.grafico.preenchimento);

    var len = this.valores.length;

    var qtdMostradas = 0;
    var indicesMostrando = [];
    for (var dia in this.indicesDias) {      
      if (this.indicesDias[dia].inicioApaga == undefined) {
        qtdMostradas++;
        indicesMostrando.push(dia);
      }
    }

    if (qtdMostradas > this.maxDiasAMostrar) {
      for (let i = 0; i < indicesMostrando.length; i++) {
        if (i % 2 == 0) { // par
          this.indicesDias[indicesMostrando[i]].apaga();
        }
      }
      this.mod = this.mod * 2;
    } 

    for (var i = 0; i < len; i++) {
      var v = this.valores[i];
      // calcula o x 
      var x = map(i, 
        0, this.valores.length-1, limitesGrafico.eixos.x1, limitesGrafico.eixos.x2);

      vertex(x, v);

      if (this.indicesDias[i]) {
        this.indicesDias[i].draw(x);
      }
    }
    vertex(limitesGrafico.eixos.x2, limitesGrafico.eixos.y2);
    endShape();
    pop();
  }

  _drawSetaPercentualInfectado() {
    push();
    stroke(200);    

    beginShape();
    noStroke();
    fill(cores.grafico.seta);

    var larguraSeta = 4;
    // valor minimo pois o y diminui na direcao do topo da tela
    var valorMaximo = Math.min.apply(Math, this.valores);
    
    // parte inferior da seta
    vertex(50, valorMaximo+larguraSeta);
    vertex(90, valorMaximo+larguraSeta);
    vertex(90, valorMaximo+larguraSeta+5);

    // ponta da seta
    vertex(100, valorMaximo);

    // parte superior da seta
    vertex(90, valorMaximo-larguraSeta-5);
    vertex(90, valorMaximo-larguraSeta);
    vertex(50, valorMaximo-larguraSeta);
    // fecha no ponto inicial
    vertex(50, valorMaximo+larguraSeta);
    endShape();
    

    var valorNormalizado = map(valorMaximo, limitesGrafico.eixos.y2, limitesGrafico.eixos.y1, 0, TAM_POPULACAO);
    var percentual = ceil((valorNormalizado / TAM_POPULACAO) * 100);
    textSize(20);
    fill(cores.grafico.percentual);
    text(percentual + '%', 50, valorMaximo-15);
    

    pop();
  }

  _drawPlane() {
    push();
    stroke(255, 255, 255, 150);
    line(limitesGrafico.eixos.x1, limitesGrafico.eixos.y2, limitesGrafico.eixos.x2, limitesGrafico.eixos.y2); //eixo x
    line(limitesGrafico.eixos.x1, limitesGrafico.eixos.y1, limitesGrafico.eixos.x1, limitesGrafico.eixos.y2); //eixo y

    beginShape();
    noStroke();
    fill(cores.grafico.fundo);
    vertex(limitesGrafico.eixos.x1 + 1, limitesGrafico.eixos.y2);
    vertex(limitesGrafico.eixos.x2, limitesGrafico.eixos.y2);
    vertex(limitesGrafico.eixos.x2, limitesGrafico.eixos.y1);
    vertex(limitesGrafico.eixos.x1 + 1, limitesGrafico.eixos.y1);
    vertex(limitesGrafico.eixos.x1 + 1, limitesGrafico.eixos.y2);
    endShape();

    textSize(15);
    fill(255);
    text('Dias', (limitesGrafico.eixos.x1 + limitesGrafico.eixos.x2) / 2, 
      limitesGrafico.eixos.y2 + 50);

    pop();
  }

  _drawCapacidadeSistemaDeSaude() {
    if (CAPACIDADE_SISTEMA_SAUDE == 0) return;

    var percent = map(
      TAM_POPULACAO * CAPACIDADE_SISTEMA_SAUDE, 
      0, TAM_POPULACAO, limitesGrafico.eixos.y2, limitesGrafico.eixos.y1);
    push();
    //stroke(0, 100, 0, 100);
    //fill(cores.grafico.capacidadeSistemaSaude);
    strokeWeight(3);
    stroke(cores.grafico.capacidadeSistemaSaude);
    line(limitesGrafico.eixos.x1 + 1, percent, limitesGrafico.eixos.x2 - 2, percent);
    pop();
  }


}