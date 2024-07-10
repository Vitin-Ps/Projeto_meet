import * as wss from './wss.js';
import * as constants from './constants.js';
import * as ui from './ui.js';
import * as store from './store.js';

let userDetailsConectado;
let peerConexao;

const constraintsPadroes = {
  audio: true,
  video: true,
};

const configuracao = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302',
    },
  ],
};

export const getPreviewLocal = () => {
  navigator.mediaDevices
    .getUserMedia(constraintsPadroes)
    .then((stream) => {
      ui.atualizaVideoLocal(stream);
      store.setLocalStream(stream);
    })
    .catch((erro) => {
      console.log('Ocorreu algum erro ao tentar ter acesso á câmera: ', erro);
    });
};

const criarPeerConexao = () => {
  peerConexao = new RTCPeerConnection(configuracao);

  peerConexao.onicecandidate = (evento) => {
    console.log('buscandos ice candidates para criar a conexão de ponto a ponto');
    if (evento.candidate) {
      // envia essa ice candidates para outro peer
    }
  };

  peerConexao.onconnectionstatechange = (evento) => {
    if (peerConexao.connectionState === 'connected') {
      console.log('A conexão com o outro peer foi um sucesso');
    }
  };

  // recebendo tracks(faixas)
  const streamRemoto = new MediaStream();
  store.setRemoteStream(streamRemoto);
  ui.atualizaVideoRemoto(streamRemoto);

  peerConexao.ontrack = (evento) => {
    streamRemoto.addTrack(evento.track);
  };

  // adicionar esse stream no peer de conexão
  if (userDetailsConectado.ligacaoTipo === constants.ligacaoTipo.VIDEO_COD_UNICO) {
    const streamLocal = store.getState().localStream;
    for (const track of streamLocal.getTracks()) {
      peerConexao.addTrack(track, streamLocal);
    }
  }
};

export const enviarPedidoChamada = (ligacaoTipo, cod_unico_ligacao) => {
  userDetailsConectado = {
    ligacaoTipo,
    socketId: cod_unico_ligacao,
  };

  if (ligacaoTipo === constants.ligacaoTipo.CHAT_COD_UNICO || ligacaoTipo === constants.ligacaoTipo.VIDEO_COD_UNICO) {
    const data = {
      ligacaoTipo,
      chamadorSocketId: cod_unico_ligacao,
    };
    ui.mostrarLigacaoMensagem(rejeitaLigacaoMensagem);
    wss.enviarPedidoChamada(data);
  }
};

export const executaPedidoChamada = (data) => {
  const { ligacaoTipo, chamadorSocketId } = data;

  userDetailsConectado = {
    socketId: chamadorSocketId,
    ligacaoTipo,
  };

  if (ligacaoTipo === constants.ligacaoTipo.CHAT_COD_UNICO || ligacaoTipo === constants.ligacaoTipo.VIDEO_COD_UNICO) {
    console.log('Mostrando ligação Mensagem');
    ui.mostrarEntradaLigacaoChamada(ligacaoTipo, aceitarLigacao, rejeitarLigacao);
  }
};

export const executaPedidoChamadaResposta = (data) => {
  const { pedidoChamadaResposta } = data;
  ui.removerAllAlertas();

  if (pedidoChamadaResposta === constants.pedidoChamadaResposta.CHAMADA_NAO_ENCONTRADA) {
    ui.mostrarInfoAlerta(pedidoChamadaResposta);
  }

  if (pedidoChamadaResposta === constants.pedidoChamadaResposta.CHAMADA_INDISPONIVEL) {
    ui.mostrarInfoAlerta(pedidoChamadaResposta);
  }

  if (pedidoChamadaResposta === constants.pedidoChamadaResposta.CHAMADA_REJEITADA) {
    ui.mostrarInfoAlerta(pedidoChamadaResposta);
  }

  if (pedidoChamadaResposta === constants.pedidoChamadaResposta.CHAMADA_ACEITA) {
    // enciar o webRtc pedido
    ui.mostrarLigacaoElementos(userDetailsConectado.ligacaoTipo);
    criarPeerConexao();

    enviarPedidoWebRTC();
  }
};

const aceitarLigacao = () => {
  console.log('ligacao aceita...');
  criarPeerConexao();
  enviarPedidoChamadaResposta(constants.pedidoChamadaResposta.CHAMADA_ACEITA);
  ui.mostrarLigacaoElementos(userDetailsConectado.ligacaoTipo);
};

const rejeitarLigacao = () => {
  console.log('Ligação rejeitada...');
  enviarPedidoChamadaResposta(constants.ligacaoTipo.CHAMADA_REJEITADA);
};

const rejeitaLigacaoMensagem = () => {
  console.log('Rejeitando a ligação...');
};

const enviarPedidoChamadaResposta = (pedidoChamadaResposta) => {
  const data = {
    chamadorSocketId: userDetailsConectado.socketId,
    pedidoChamadaResposta,
  };
  ui.removerAllAlertas();
  wss.enviarPedidoChamadaResposta(data);
};

export const enviarPedidoWebRTC = async () => {
  const pedido = await peerConexao.createOffer();
  await peerConexao.setLocalDescription(pedido);

  wss.enviarDadosUsandoSinalWebRTC({
    usuarioConectadoSocketId: userDetailsConectado.socketId,
    tipo: constants.sinalWebRTC.PEDIDO,
    pedido: pedido,
  });
};

export const executaWebRTCPedido = async (data) => {
  await peerConexao.setRemoteDescription(data.pedido);
  const resposta = await peerConexao.createAnswer();

  await peerConexao.setLocalDescription(resposta);
  wss.enviarDadosUsandoSinalWebRTC({
    usuarioConectadoSocketId: userDetailsConectado.socketId,
    tipo: constants.sinalWebRTC.RESPOSTA,
    resposta: resposta,
  });
};

export const executaWebRTCResposta = async (data) => {
  console.log('executando webRTC resposta');
  await peerConexao.setRemoteDescription(data.resposta);
};
