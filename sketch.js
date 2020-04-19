var simulacao;
var grafico;

function setup() {
    createCanvas(1260, 500);
    simulacao = new Simulacao();
    grafico = new Grafico();
}

function draw() {
    background(0);
    simulacao.executa();

    var infectados = simulacao.qtdInfectados;
    if (infectados != 0) {
        grafico.addValor(infectados);
    }

    grafico.draw();

    _drawInfo();
}

function _drawInfo() {

    push();
    textSize(18);

    fill(cores.info.probContagio);
    text('Prob. Contágio: ' + (PROBALIDADE_INFECCAO * 100) + '%', 100, 450);

    if (PERCENTUAL_COM_MASCARA > 0) {
        fill(cores.info.fatorProtecaoMascara);
        text('Fator Proteção Máscara: ' + ((1 - PROBALIDADE_INFECCAO_MASCARA) * 100) + '%', 290, 450);

        fill(cores.info.percentUsandoMascara);
        text('Usando Máscara: ' + (PERCENTUAL_COM_MASCARA * 100) + '%', 550, 450);
    }

    if (PERCENTUAL_ASSINTOMATICO > 0) {
        fill(cores.info.percentAssintomatico);
        text('Prob. Assintomáticos: ' + (PERCENTUAL_ASSINTOMATICO * 100) + '%', 290, 450);
    }

    fill(255);
    textSize(14);
    text('R0 = ' + simulacao.RNought.toFixed(2), 100, 475);


    pop();

}