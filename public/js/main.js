import * as wss from './wss.js';
import * as store from './store.js';
import * as constants from './constants.js';
import * as webRTCHandler from './webRTCHandler.js';

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
