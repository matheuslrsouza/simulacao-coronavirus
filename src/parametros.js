const TAM_POPULACAO = 350;
const CAPACIDADE_SISTEMA_SAUDE = .0;

// cada segundo representa 4 dias
// a cada 1 dia (1s/4) uma pessoa tem a chance de infectar 4 pessoas
const TEMPO_VERIFICACAO = (1/4)/4;

// depois de um dia de infeção a pessoa deve ser isolada
const TEMPO_ENVIO_QUARENTENA = (1/4);

const PROBALIDADE_INFECCAO = 0.1;

// .2 significa que a mascara proteja 80%
const PROBALIDADE_INFECCAO_MASCARA = .5;

const PERCENTUAL_COM_MASCARA = .0;

// 4 = 16 dias
const TEMPO_RECUPERACAO = 4;
const TAMANHO_PESSOA = 5;

const RAIO_ALCANCE = TAMANHO_PESSOA * 4;

const HABILITA_ISOLAMENTO = true;
const HABILITA_VACINA = false;
const HABILITA_DISTANCIAMENTO = true;
const FATOR_DISTANCIAMENTO = TAMANHO_PESSOA * 4 + 2;
const PERCENTUAL_PARTICIPANDO_DISTANCIAMENTO_SOCIAL = .6;

const PERCENTUAL_ASSINTOMATICO = HABILITA_ISOLAMENTO ? .16 : 0;

// R nought estimado para calcular o % de vacinação
const R0 = 3;
const PERCENTUAL_VACINACAO = HABILITA_VACINA ? 1 - (1/R0) : 0;

const limitesPopulacao = {
    x1: 600, 
    y1: 50,
    x2: 900,
    y2: 350
};

const limitesQuarentena = {
    x1: 1000, 
    y1: 50,
    x2: 1150,
    y2: 150    
};
limitesQuarentena.centro = { 
    x: (limitesQuarentena.x1 + limitesQuarentena.x2) / 2, 
    y: (limitesQuarentena.y1 + limitesQuarentena.y2) / 2
};

const limitesGrafico = {
    eixos: {
        x1: 100, 
        y1: 50,
        x2: 500,
        y2: 350
    }
};

const cores = {
    grafico: {
        preenchimento: [229, 129, 131, 230], 
        fundo: [0], 
        capacidadeSistemaSaude: [246, 157, 115],
        percentual: [174, 234, 224],
        seta: [204, 92, 91]
    }, 
    pessoa: {
        suscetivel: { preenchimento: [255] },
        suscetivelComMascara: { preenchimento: [140, 140, 236] },
        infectada: {
            preenchimento: [204, 92, 91],
            raio: [204, 92, 91], 
            preenchimentoAssintomatico: [254, 254, 90],
            raioAssintomatico: [254, 254, 90]
        }, 
        recuperada: { preenchimento: [60, 60, 60] },
        vacinada: { preenchimento: [0, 255, 0] }
    }, 
    isolamento: {
        titulo: [204, 92, 91], 
        bordas: [204, 92, 91]
    }, 
    info: {
        probContagio: [204, 92, 91],
        fatorProtecaoMascara: [16, 125, 137], 
        percentUsandoMascara: [140, 140, 236],
        percentAssintomatico: [254, 254, 90]
    }
}