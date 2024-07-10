import * as wss from './wss.js';
import * as webRTCHandler from './webRTCHandler.js';
import * as ui from './ui.js';

let aleatoirioLigacaoTipo;

export const mudarStatusConexaoAleatorio = (status) => {
  const data = { status };
  wss.mudarStatusConexaoAleatorio(data);
};

export const getSocketIdAleatorioEConectar = (ligacaoTipo) => {
  aleatoirioLigacaoTipo = ligacaoTipo;
  wss.getSokectIdAleatorio();
};

export const conectarComAleatorio = (data) => {
  console.log(data.socketIdAleatorio);

  if(data.socketIdAleatorio) {
    webRTCHandler.enviarPedidoChamada(aleatoirioLigacaoTipo, data.socketIdAleatorio)
  } else {
    // sem usuário disponivel para conexão
    ui.mostrarAleatorioNaoDisponivelAlerta()
  }
};
