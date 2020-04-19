
class Dia {

  constructor(valor) {
    this.inicioApaga = undefined;
    this.valor = valor;
  }

  draw(x) {
    var alpha = 255;

    if (this.inicioApaga) {
      var diffSegundos = min (1, abs(this.inicioApaga - new Date()) / 1000);
      alpha = map(diffSegundos, 0, 1, 255, 40);
    }

    push();
    stroke(255, 255, 255, alpha);        
    line(x, limitesGrafico.eixos.y2+1, x, limitesGrafico.eixos.y2 + 5);
    textSize(10);
    noStroke();
    fill(255, 255, 255, alpha);
    text(this.valor, x-3, limitesGrafico.eixos.y2 + 20)
    pop();
  }

  apaga() {
    if (this.inicioApaga) return;

    this.inicioApaga = new Date();
  }

}