import * as wss from './wss.js';
import * as store from './store.js';
import * as constants from './constants.js';
import * as webRTCHandler from './webRTCHandler.js';
import * as ui from './ui.js';
import * as recordingUtils from './recordingUtils.js';
import * as strangerUtils from './strangerUtils.js';

// Inicialização da conexão do soketio

const socket = io('/');
wss.registraSocketEventos(socket);

webRTCHandler.getPreviewLocal();

// registrando evento para copiar cod_unico

const btn_copiar_cod_unico = document.getElementById('btn_copiar_cod_unico');
btn_copiar_cod_unico.addEventListener('click', () => {
  const codUnico = store.getState().socketId;

  // comando usado para copiar a mensagem (ctrl + c)
  navigator.clipboard && navigator.clipboard.writeText(codUnico);
});

// Registrando eventos para a conexão dos botoes

const cod_unico_chat_btn = document.getElementById('cod_unico_chat_btn');
const cod_unico_video_btn = document.getElementById('cod_unico_video_btn');

cod_unico_chat_btn.addEventListener('click', () => {
  console.log('CHAT');
  const cod_unico_ligacao = document.getElementById('cod_unico_input').value;

  const ligacaoTipo = constants.ligacaoTipo.CHAT_COD_UNICO;
  webRTCHandler.enviarPedidoChamada(ligacaoTipo, cod_unico_ligacao);
});

cod_unico_video_btn.addEventListener('click', () => {
  console.log('VIDEO');
  const cod_unico_ligacao = document.getElementById('cod_unico_input').value;

  const ligacaoTipo = constants.ligacaoTipo.VIDEO_COD_UNICO;
  webRTCHandler.enviarPedidoChamada(ligacaoTipo, cod_unico_ligacao);
});

const btnChatAleatorio = document.getElementById('aleatorio_chat_btn');
btnChatAleatorio.addEventListener('click', () => {
  strangerUtils.getSocketIdAleatorioEConectar(constants.ligacaoTipo.CHAT_ALEATORIO);
});

const btnVideoAleatorio = document.getElementById('aleatorio_video_btn');
btnVideoAleatorio.addEventListener('click', () => {
  strangerUtils.getSocketIdAleatorioEConectar(constants.ligacaoTipo.VIDEO_ALEATORIO);
});

// registrando evento para permitir conexões aleatórias

const checkboxAleatorio = document.getElementById('aleatorio_checkbox');
checkboxAleatorio.addEventListener('change', (event) => {
  if (event.target.checked) store.setPermitirConexoesAleatorias(true);
  else store.setPermitirConexoesAleatorias(false);

  const estadoCheckbox = store.getState().permitirConexoesAleatorias;
  strangerUtils.mudarStatusConexaoAleatorio(estadoCheckbox);
});

// Lista de eventos dos botões de video

const btn_mic = document.getElementById('btn_mic');
btn_mic.addEventListener('click', () => {
  const streamLocal = store.getState().localStream;
  const micAtivado = streamLocal.getAudioTracks()[0].enabled;

  streamLocal.getAudioTracks()[0].enabled = !micAtivado;
  ui.atualizarBtnMic(micAtivado);
});

const btn_camera = document.getElementById('btn_camera');
btn_camera.addEventListener('click', () => {
  const streamLocal = store.getState().localStream;
  const cameraAtivada = streamLocal.getVideoTracks()[0].enabled;

  streamLocal.getVideoTracks()[0].enabled = !cameraAtivada;
  ui.atualizarBtnCamera(cameraAtivada);
});

const btnInterruptorCompartilhaTela = document.getElementById('btn_compartilha_camera');
btnInterruptorCompartilhaTela.addEventListener('click', () => {
  const telaCompartilhadaAtivada = store.getState().screenSharingActive;
  webRTCHandler.trocaEntreCameraETelaCompartilhada(telaCompartilhadaAtivada);

  ui.atualizarBtnCompartilhaTela(!telaCompartilhadaAtivada);
});

// Mensagem

const inputNovaMensagem = document.getElementById('nova_mensagem_input');
inputNovaMensagem.addEventListener('keydown', (event) => {
  console.log('ocorreu mudança');
  const chave = event.key;

  if (chave === 'Enter') {
    webRTCHandler.enviarMensagemUsandoDataCanal(event.target.value);
    ui.inserirMensagem(event.target.value, true);
    inputNovaMensagem.value = '';
  }
});

const btnEnviaMensagem = document.getElementById('enviar_mensagem_btn');
btnEnviaMensagem.addEventListener('click', (event) => {
  const mensagem = inputNovaMensagem.value;
  webRTCHandler.enviarMensagemUsandoDataCanal(mensagem);
  ui.inserirMensagem(mensagem, true);
  inputNovaMensagem.value = '';
});

// gravação
const btnComecarGravacao = document.getElementById('btn_grava');
btnComecarGravacao.addEventListener('click', () => {
  recordingUtils.comecarGravacao();
  ui.mostrarPainelGravacao();
});

const btnPararGravacao = document.getElementById('btn_para_gravacao');
btnPararGravacao.addEventListener('click', () => {
  recordingUtils.pararGravacao();
  ui.reiniciarBtnsGravacao();
});

const btnPausarGravacao = document.getElementById('btn_pausa_gravacao');
btnPausarGravacao.addEventListener('click', () => {
  recordingUtils.pausarGravacao();
  ui.btnInterruptorGravacao(true);
});

const btnContinuarrGravacao = document.getElementById('btn_continuar_gravacao');
btnContinuarrGravacao.addEventListener('click', () => {
  recordingUtils.continuarGravacao();
  ui.btnInterruptorGravacao();
});

// desligar ligação
const btnDesligaVideo = document.getElementById('btn_desliga');
btnDesligaVideo.addEventListener('click', () => {
  webRTCHandler.executaDesligamento();
});

const btnDesligaChat = document.getElementById('btn_desliga_chat');
btnDesligaChat.addEventListener('click', () => {
  webRTCHandler.executaDesligamento();
});
