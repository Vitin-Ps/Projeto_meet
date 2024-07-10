import * as wss from './wss.js';
import * as constants from './constants.js';
import * as ui from './ui.js';
import * as store from './store.js';

let detalhesUsuarioConectado;
let peerConexao;
let dataCanal;

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
      ui.mostrarBotoesLigacaoVideo();
      store.setCallState(constants.estadoLigacao.LIGACAO_DISPONIVEL);
      store.setLocalStream(stream);
    })
    .catch((erro) => {
      console.log('Ocorreu algum erro ao tentar ter acesso á câmera: ', erro);
    });
};

const criarPeerConexao = () => {
  peerConexao = new RTCPeerConnection(configuracao);

  // parte do chat

  dataCanal = peerConexao.createDataChannel('chat');

  peerConexao.ondatachannel = (event) => {
    const dataCanal = event.channel;

    dataCanal.onopen = () => {
      console.log(' Conexão peer está pronta para receber as mensagens dos dados do canal');
    };

    dataCanal.onmessage = (event) => {
      console.log('mensagem veio do data Canal');
      const mensagem = JSON.parse(event.data);
      ui.inserirMensagem(mensagem);
    };
  };

  peerConexao.onicecandidate = (event) => {
    console.log('buscando ice candidates para criar a conexão de ponto a ponto');
    if (event.candidate) {
      // envia essa ice candidates para outro peer
      wss.enviarDadosUsandoSinalWebRTC({
        usuarioConectadoSocketId: detalhesUsuarioConectado.socketId,
        tipo: constants.sinalWebRTC.ICE_CANDIDATE,
        candidate: event.candidate,
      });
    }
  };

  peerConexao.onconnectionstatechange = (event) => {
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
  if (
    detalhesUsuarioConectado.ligacaoTipo === constants.ligacaoTipo.VIDEO_COD_UNICO ||
    detalhesUsuarioConectado.ligacaoTipo === constants.ligacaoTipo.VIDEO_ALEATORIO
  ) {
    const streamLocal = store.getState().localStream;
    for (const track of streamLocal.getTracks()) {
      peerConexao.addTrack(track, streamLocal);
    }
  }
};

export const enviarMensagemUsandoDataCanal = (mensagem) => {
  const stringfieldMensagem = JSON.stringify(mensagem);
  dataCanal.send(stringfieldMensagem);
};

export const enviarPedidoChamada = (ligacaoTipo, cod_unico_ligacao) => {
  detalhesUsuarioConectado = {
    ligacaoTipo,
    socketId: cod_unico_ligacao,
  };

  if (ligacaoTipo === constants.ligacaoTipo.CHAT_COD_UNICO || ligacaoTipo === constants.ligacaoTipo.VIDEO_COD_UNICO) {
    const data = {
      ligacaoTipo,
      chamadorSocketId: cod_unico_ligacao,
    };
    ui.mostrarLigacaoMensagem(ligandoAlertaParaLigacaoReigeitadaExecutada);

    store.setCallState(constants.estadoLigacao.LIGACAO_INDISPONIVEL);

    wss.enviarPedidoChamada(data);
  }

  if (ligacaoTipo === constants.ligacaoTipo.CHAT_ALEATORIO || ligacaoTipo === constants.ligacaoTipo.VIDEO_ALEATORIO) {
    const data = {
      ligacaoTipo,
      chamadorSocketId: cod_unico_ligacao,
    };

    store.setCallState(constants.estadoLigacao.LIGACAO_INDISPONIVEL);
    wss.enviarPedidoChamada(data);
  }
};

export const executaPedidoChamada = (data) => {
  const { ligacaoTipo, chamadorSocketId } = data;

  if (!checarPossibilidadeLigacao()) {
    return enviarPedidoChamadaResposta(constants.pedidoChamadaResposta.CHAMADA_INDISPONIVEL, chamadorSocketId);
  }

  detalhesUsuarioConectado = {
    socketId: chamadorSocketId,
    ligacaoTipo,
  };

  store.setCallState(constants.estadoLigacao.LIGACAO_INDISPONIVEL);

  if (ligacaoTipo === constants.ligacaoTipo.CHAT_COD_UNICO || ligacaoTipo === constants.ligacaoTipo.VIDEO_COD_UNICO) {
    console.log('Mostrando ligação Mensagem');
    ui.mostrarEntradaLigacaoChamada(ligacaoTipo, aceitarLigacao, rejeitarLigacao);
  }

  if (ligacaoTipo === constants.ligacaoTipo.CHAT_ALEATORIO || ligacaoTipo === constants.ligacaoTipo.VIDEO_ALEATORIO) {
    criarPeerConexao();
    enviarPedidoChamadaResposta(constants.pedidoChamadaResposta.CHAMADA_ACEITA);
    ui.mostrarLigacaoElementos(detalhesUsuarioConectado.ligacaoTipo);
  }
};

const aceitarLigacao = () => {
  console.log('ligacao aceita...');
  criarPeerConexao();
  enviarPedidoChamadaResposta(constants.pedidoChamadaResposta.CHAMADA_ACEITA);
  ui.mostrarLigacaoElementos(detalhesUsuarioConectado.ligacaoTipo);
};

const rejeitarLigacao = () => {
  console.log('Ligação rejeitada...');
  setEntradaLigacaoDisponivel();
  enviarPedidoChamadaResposta(constants.pedidoChamadaResposta.CHAMADA_REJEITADA);
};

const ligandoAlertaParaLigacaoReigeitadaExecutada = () => {
  const data = {
    usuarioConectadoSocketId: detalhesUsuarioConectado.socketId,
  };

  fecharPeerConectadoEReiniciarEstado();

  wss.enviarUsuarioDesconectado(data);
};

const enviarPedidoChamadaResposta = (pedidoChamadaResposta, chamadorSocketId = null) => {
  const socketId = chamadorSocketId ? chamadorSocketId : detalhesUsuarioConectado.socketId;

  const data = {
    chamadorSocketId: socketId,
    pedidoChamadaResposta,
  };
  ui.removerTodosAlertas();
  wss.enviarPedidoChamadaResposta(data);
};

export const executaPedidoChamadaResposta = (data) => {
  const { pedidoChamadaResposta } = data;
  ui.removerTodosAlertas();

  if (pedidoChamadaResposta === constants.pedidoChamadaResposta.CHAMADA_NAO_ENCONTRADA) {
    ui.mostrarInfoAlerta(pedidoChamadaResposta);
    setEntradaLigacaoDisponivel();
  }

  if (pedidoChamadaResposta === constants.pedidoChamadaResposta.CHAMADA_INDISPONIVEL) {
    setEntradaLigacaoDisponivel();
    ui.mostrarInfoAlerta(pedidoChamadaResposta);
  }

  if (pedidoChamadaResposta === constants.pedidoChamadaResposta.CHAMADA_REJEITADA) {
    setEntradaLigacaoDisponivel();
    ui.mostrarInfoAlerta(pedidoChamadaResposta);
  }

  if (pedidoChamadaResposta === constants.pedidoChamadaResposta.CHAMADA_ACEITA) {
    // enciar o webRtc pedido
    ui.mostrarLigacaoElementos(detalhesUsuarioConectado.ligacaoTipo);
    criarPeerConexao();

    enviarPedidoWebRTC();
  }
};

export const enviarPedidoWebRTC = async () => {
  const pedido = await peerConexao.createOffer();
  await peerConexao.setLocalDescription(pedido);

  wss.enviarDadosUsandoSinalWebRTC({
    usuarioConectadoSocketId: detalhesUsuarioConectado.socketId,
    tipo: constants.sinalWebRTC.PEDIDO,
    pedido: pedido,
  });
};

export const executaWebRTCPedido = async (data) => {
  await peerConexao.setRemoteDescription(data.pedido);
  const resposta = await peerConexao.createAnswer();

  await peerConexao.setLocalDescription(resposta);
  wss.enviarDadosUsandoSinalWebRTC({
    usuarioConectadoSocketId: detalhesUsuarioConectado.socketId,
    tipo: constants.sinalWebRTC.RESPOSTA,
    resposta: resposta,
  });
};

export const executaWebRTCResposta = async (data) => {
  console.log('executando webRTC resposta');
  await peerConexao.setRemoteDescription(data.resposta);
};

export const executaWebRTCCandidate = async (data) => {
  console.log('executando entrada webRTC candidates');
  try {
    await peerConexao.addIceCandidate(data.candidate);
  } catch (erro) {
    console.error('ocorreu um erro ao tentar adicionar ice candidate recebido: ', erro);
  }
};

let compartilharTelaStream;

export const trocaEntreCameraETelaCompartilhada = async (telaCompatilhadaAtivada) => {
  if (telaCompatilhadaAtivada) {
    const streamLocal = store.getState().localStream;
    const senders = peerConexao.getSenders();

    const sender = senders.find((sender) => {
      return sender.track.kind === streamLocal.getVideoTracks()[0].kind;
    });

    if (sender) {
      sender.replaceTrack(streamLocal.getVideoTracks()[0]);
    }

    // parar de compartilhar o stream da tela

    store
      .getState()
      .screenSharingStream.getTracks()
      .forEach((track) => track.stop());

    store.setScreenSharingActive(!telaCompatilhadaAtivada);

    ui.atualizarVideoLocal(streamLocal);
  } else {
    console.log('Trocando pelo compartilhamento de tela');

    try {
      compartilharTelaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      store.setScreenSharingStream(compartilharTelaStream);

      // Substituir track pelo sender enviado
      const senders = peerConexao.getSenders();

      const sender = senders.find((sender) => {
        return sender.track.kind === compartilharTelaStream.getVideoTracks()[0].kind;
      });

      if (sender) {
        sender.replaceTrack(compartilharTelaStream.getVideoTracks()[0]);
      }

      store.setScreenSharingActive(!telaCompatilhadaAtivada);

      ui.atualizarVideoLocal(compartilharTelaStream);
    } catch (erro) {
      console.log('Ocorreu um erro ao tentar pegar o stream compartilhado: ', erro);
    }
  }
};

// desligar ligação
export const executaDesligamento = () => {
  console.log('Finalizando a ligação');
  const data = {
    usuarioConectadoSocketId: detalhesUsuarioConectado.socketId,
  };

  wss.enviarUsuarioDesconectado(data);
  fecharPeerConectadoEReiniciarEstado();
};

export const executaDesligamentoUsuarioConectado = () => {
  fecharPeerConectadoEReiniciarEstado();
};

const fecharPeerConectadoEReiniciarEstado = () => {
  if (peerConexao) {
    peerConexao.close();
    peerConexao = null;
  }

  if (
    detalhesUsuarioConectado.ligacaoTipo === constants.ligacaoTipo.VIDEO_COD_UNICO ||
    detalhesUsuarioConectado.ligacaoTipo === constants.ligacaoTipo.VIDEO_ALEATORIO
  ) {
    store.getState().localStream.getVideoTracks()[0].enabled = true;
    store.getState().localStream.getAudioTracks()[0].enabled = true;
  }

  ui.atualizaUIDepoisDeDesligar(detalhesUsuarioConectado.ligacaoTipo);
  setEntradaLigacaoDisponivel();
};

const checarPossibilidadeLigacao = (ligacaoTipo) => {
  const estadoLigacao = store.getState().callState;

  if (estadoLigacao === constants.estadoLigacao.LIGACAO_DISPONIVEL) {
    return true;
  }

  if (
    (ligacaoTipo === constants.ligacaoTipo.VIDEO_COD_UNICO || ligacaoTipo === constants.ligacaoTipo.VIDEO_ALEATORIO) &&
    estadoLigacao === constants.estadoLigacao.LIGACAO_DISPONIVEL_SOMENTE_CHAT
  ) {
    return false;
  }

  return false;
};

const setEntradaLigacaoDisponivel = () => {
  const streamLocal = store.getState().localStream;

  if (streamLocal) {
    store.setCallState(constants.estadoLigacao.LIGACAO_DISPONIVEL);
  } else {
    store.setCallState(constants.estadoLigacao.LIGACAO_DISPONIVEL_SOMENTE_CHAT);
  }
};
