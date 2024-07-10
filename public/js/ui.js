import * as constants from './constants.js';
import * as elements from './elements.js';
import * as domEventos from './domEventos.js';

export const atualizaCodUnico = (codUnico) => {
  const cod_unico_valor = document.getElementById('cod_unico_valor');
  cod_unico_valor.innerHTML = codUnico;
};

export const atualizarVideoLocal = (stream) => {
  const videoLocal = document.getElementById('local_video');
  videoLocal.srcObject = stream;

  localVideo.addEventListener('loadedmetadata', () => {
    videoLocal.play();
  });
};

export const mostrarBotoesLigacaoVideo = () => {
  const btnCodUnicoVideo = document.getElementById('cod_unico_video_btn');
  const btnAleatorioVideo = document.getElementById('aleatorio_video_btn');

  mostrarElemento(btnCodUnicoVideo);
  mostrarElemento(btnAleatorioVideo);
};

// removendo todos os itens do elemento alerta
// const alerta = document.getElementById('dialog');
// alerta.querySelectorAll('*').forEach((alerta) => alerta.remove)

export const mostrarLigacaoMensagem = (acaoChamadaRejeitada) => {
  const chamandoAlerta = elements.getChamandoAlerta(acaoChamadaRejeitada);

  // removendo todos os itens do elemento alerta
  const alerta = document.getElementById('alerta');
  alerta.querySelectorAll('*').forEach((alerta) => alerta.remove);
  alerta.appendChild(chamandoAlerta);
};

export const mostrarEntradaLigacaoChamada = (ligacaoTipo, aceitarLigacao, rejeitarLigacao) => {
  const infoLigacaoTipo = ligacaoTipo === constants.ligacaoTipo.CHAT_COD_UNICO ? 'chat' : 'video';

  const chamandoLigacaoAlerta = elements.getChamandoLigacaoAlerta(infoLigacaoTipo, aceitarLigacao, rejeitarLigacao);

  // removendo todos os itens do elemento alerta
  const alerta = document.getElementById('alerta');
  alerta.querySelectorAll('*').forEach((alerta) => alerta.remove);
  alerta.appendChild(chamandoLigacaoAlerta);
};

export const atualizaVideoLocal = (stream) => {
  const videoLocal = document.getElementById('local_video');
  videoLocal.srcObject = stream;

  videoLocal.addEventListener('loadedmetadata', () => {
    videoLocal.play();
  });
};

export const atualizaVideoRemoto = (stream) => {
  const videoRemoto = document.getElementById('remote_video');
  videoRemoto.srcObject = stream;
};

export const removerTodosAlertas = () => {
  // removendo todos os itens do elemento alerta
  const alerta = document.getElementById('alerta');
  alerta.querySelectorAll('*').forEach((alerta) => alerta.remove());
};

export const mostrarAleatorioNaoDisponivelAlerta = () => {
  const infoAlerta = elements.getInfoAlerta('Nenhum usuário aleatório disponivel', 'Por favor, tente novamente mais tarde');

  if (infoAlerta) {
    const alerta = document.getElementById('alerta');
    alerta.appendChild(infoAlerta);

    setTimeout(() => {
      removerTodosAlertas();
    }, [4000]);
  }
};

export const mostrarInfoAlerta = (pedidoChamadaResposta) => {
  let infoAlerta = null;

  if (pedidoChamadaResposta === constants.pedidoChamadaResposta.CHAMADA_REJEITADA) {
    infoAlerta = elements.getInfoAlerta('Chamada rejeitada', 'Chamador rejeitou sua chamada');
  }

  if (pedidoChamadaResposta === constants.pedidoChamadaResposta.CHAMADA_NAO_ENCONTRADA) {
    infoAlerta = elements.getInfoAlerta('Chamada não encontrada', 'Cheque seu código único, por favor');
  }

  if (pedidoChamadaResposta === constants.pedidoChamadaResposta.CHAMADA_INDISPONIVEL) {
    infoAlerta = elements.getInfoAlerta('Não possivel fazer a chamada', 'Provavelmente a chamada está lenta. Porfavor, tente mais tarde');
  }

  if (infoAlerta) {
    const alerta = document.getElementById('alerta');
    alerta.appendChild(infoAlerta);

    setTimeout(() => {
      removerTodosAlertas();
    }, [3000]);
  }
};

export const mostrarLigacaoElementos = (ligacaoTipo) => {
  if (ligacaoTipo === constants.ligacaoTipo.CHAT_COD_UNICO || ligacaoTipo === constants.ligacaoTipo.CHAT_ALEATORIO) {
    mostrarChatLigacaoElementos();
  }

  if (ligacaoTipo === constants.ligacaoTipo.VIDEO_COD_UNICO || ligacaoTipo === constants.ligacaoTipo.VIDEO_ALEATORIO) {
    mostrarVideoLigacaoElementos();
  }

  domEventos.mostrarDivMensagens(true);
  domEventos.mostrarDivPainel(true, true);
};

const mostrarChatLigacaoElementos = () => {
  const finaliza_chat_btn = document.getElementById('finaliza_chat_btn');

  mostrarElemento(finaliza_chat_btn);
  const mensagens_container_main = document.getElementById('mensagens_container_main');
  mostrarElemento(mensagens_container_main);

  //bloquear painel
  desativaDashboard();
};

const mostrarVideoLigacaoElementos = () => {
  const btns_ligacao = document.getElementById('btns_ligacao');
  mostrarElemento(btns_ligacao);

  const area_video = document.getElementById('area_video');
  esconderElemento(area_video);

  const remote_video = document.getElementById('remote_video');
  mostrarElemento(remote_video);

  const mensagens_container_main = document.getElementById('mensagens_container_main');
  mostrarElemento(mensagens_container_main);

  //bloquear painel
  desativaDashboard();
};

// ui mensagens
export const inserirMensagem = (mensagem, direita = false) => {
  const mensagensContainer = document.getElementById('mensagens_container');
  const elementoMensagem = direita ? elements.getMensagemDireita(mensagem) : elements.getMensagemEsquerda(mensagem);
  mensagensContainer.appendChild(elementoMensagem);
};

export const limparMensagens = () => {
  const mensagensContainer = document.getElementById('mensagens_container');
  mensagensContainer.querySelectorAll('*').forEach((elemento) => elemento.remove());
};

// gravação

export const mostrarPainelGravacao = () => {
  const btnsGravacao = document.getElementById('status_gravando_btn');
  mostrarElemento(btnsGravacao);

  // esconder o botão de começar a gravação se estiver ativo
  const btnComecaGravacao = document.getElementById('btn_grava');
  esconderElemento(btnComecaGravacao);
};

export const reiniciarBtnsGravacao = () => {
  const btnComecaGravacao = document.getElementById('btn_grava');
  const btnsGravacao = document.getElementById('status_gravando_btn');

  esconderElemento(btnsGravacao);
  mostrarElemento(btnComecaGravacao);
};

export const btnInterruptorGravacao = (btnInterruptorContinuar = false) => {
  const btnContinuar = document.getElementById('btn_continuar_gravacao');
  const btnPausar = document.getElementById('btn_pausa_gravacao');

  if (btnInterruptorContinuar) {
    esconderElemento(btnPausar);
    mostrarElemento(btnContinuar);
  } else {
    esconderElemento(btnContinuar);
    mostrarElemento(btnPausar);
  }
};

// ui depois de desligar
export const atualizaUIDepoisDeDesligar = (ligacaoTipo) => {
  ativarDashBoard();

  //esconder os botões da ligação
  if (ligacaoTipo === constants.ligacaoTipo.VIDEO_COD_UNICO || ligacaoTipo === constants.ligacaoTipo.VIDEO_ALEATORIO) {
    const btns_ligacao = document.getElementById('btns_ligacao');
    esconderElemento(btns_ligacao);
  } else {
    const btns_ligacao_chat = document.getElementById('finaliza_chat_btn');
    esconderElemento(btns_ligacao_chat);
  }

  const mensagens_container_main = document.getElementById('mensagens_container_main');
  esconderElemento(mensagens_container_main);
  limparMensagens();

  atualizarBtnMic(false);
  atualizarBtnCamera(false);

  // esconder video remoto e mostrar painel
  const areaVideo = document.getElementById('area_video');
  const videoRemoto = document.getElementById('remote_video');

  esconderElemento(videoRemoto);
  mostrarElemento(areaVideo);

  removerTodosAlertas();

  domEventos.mostrarDivMensagens(true, true);
  domEventos.mostrarDivPainel(true);
};

// ui funções de ajuda

const ativarDashBoard = () => {
  const dashboard_blur = document.getElementById('dashboard_blur');
  if (!dashboard_blur.classList.contains('display_none')) {
    dashboard_blur.classList.add('display_none');
  }
};

const desativaDashboard = () => {
  const dashboard_blur = document.getElementById('dashboard_blur');
  if (dashboard_blur.classList.contains('display_none')) {
    dashboard_blur.classList.remove('display_none');
  }
};

const mostrarElemento = (elemento) => {
  if (elemento.classList.contains('display_none')) {
    elemento.classList.remove('display_none');
  }
};

const esconderElemento = (elemento) => {
  if (!elemento.classList.contains('display_none')) {
    elemento.classList.add('display_none');
  }
};

// ui botões de ligação

const offBgColor = 'var(--cor011)';
const onBgColor = 'var(--cor005)';

export const atualizarBtnMic = (micAtivado) => {
  const btn_mic = document.getElementById('btn_mic');

  btn_mic.style.backgroundColor = micAtivado ? offBgColor : onBgColor;
};

export const atualizarBtnCamera = (cameraAtivada) => {
  const btn_camera = document.getElementById('btn_camera');

  btn_camera.style.backgroundColor = cameraAtivada ? offBgColor : onBgColor;
};

export const atualizarBtnCompartilhaTela = (compartilhaTelaAtivado) => {
  const btn_compartilha_tela = document.getElementById('btn_compartilha_camera');

  btn_compartilha_tela.style.backgroundColor = compartilhaTelaAtivado ? offBgColor : onBgColor;
};
