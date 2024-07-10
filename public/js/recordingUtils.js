import * as store from './store.js';

let mediaGravada;

const vp9Codec = 'video/webm; codecs=vp=9';
const vp90Options = { mimeType: vp9Codec };
let pedacosGravados = [];

export const comecarGravacao = () => {
  const streamRemoto = store.getState().remoteStream;

  if (MediaRecorder.isTypeSupported(vp9Codec)) {
    mediaGravada = new MediaRecorder(streamRemoto, vp90Options);
  } else {
    mediaGravada = new MediaRecorder(streamRemoto);
  }

  mediaGravada.ondataavailable = executaDataDisponivel;
  mediaGravada.start();
};

export const pausarGravacao = () => {
  mediaGravada.pause();
};

export const continuarGravacao = () => {
  mediaGravada.resume();
};

export const pararGravacao = () => {
  mediaGravada.stop();
  pedacosGravados = [];
};

const baixarGravacaoVideo = () => {
  const blob = new Blob(pedacosGravados, {
    video: 'video/webm',
    type: 'mp4',
  });

  const dtAtual = new Date();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none;';
  a.href = url;
  a.download = `Gravacao_da_chamada/${dtAtual.getDate()}-${dtAtual.getMonth() + 1}-${dtAtual.getFullYear()}.mp4`;
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
};

const executaDataDisponivel = (event) => {
  if (event.data.size > 0) {
    pedacosGravados.push(event.data);
    baixarGravacaoVideo();
  }
};
