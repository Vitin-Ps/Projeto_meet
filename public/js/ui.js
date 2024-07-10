import * as constants from './constants.js';
import * as elements from './elements.js';

export const atualizaCodUnico = (codUnico) => {
  const cod_unico_valor = document.getElementById('cod_unico_valor');
  cod_unico_valor.innerHTML = codUnico;
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

export const removerAllAlertas = () => {
  // removendo todos os itens do elemento alerta
  const alerta = document.getElementById('alerta');
  alerta.querySelectorAll('*').forEach((alerta) => alerta.remove());
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
      removerAllAlertas();
    }, [3000]);
  }
};

export const mostrarLigacaoElementos = (ligacaoTipo) => {
  if (ligacaoTipo === constants.ligacaoTipo.CHAT_COD_UNICO) {
    mostrarChatLigacaoElementos();
  }

  if (ligacaoTipo === constants.ligacaoTipo.VIDEO_COD_UNICO) {
    mostrarVideoLigacaoElementos();
  }
};

const mostrarChatLigacaoElementos = () => {
  const finaliza_chat_btn = document.getElementById('finaliza_chat_btn');

  mostrarElemento(finaliza_chat_btn);
  const novaMensagemInput = document.getElementById('nova_mensagem');
  mostrarElemento(novaMensagemInput);

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

  const novaMensagemInput = document.getElementById('nova_mensagem');
  mostrarElemento(novaMensagemInput);

  //bloquear painel
  desativaDashboard();
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
