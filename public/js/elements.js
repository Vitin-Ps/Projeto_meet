export const getChamandoAlerta = (acaoChamadaRejeitada) => {
  const alerta = document.createElement('div');
  alerta.classList.add('alerta_fundo');

  const alertaContent = document.createElement('div');
  alertaContent.classList.add('alerta_content');
  alerta.appendChild(alertaContent);

  const titulo = document.createElement('p');
  titulo.classList.add('alerta_titulo');
  titulo.innerHTML = `Chamando`;

  const iconeContainer = document.createElement('div');
  iconeContainer.classList.add('alerta_icone_container');

  //<i class="fas fa-user"></i>
  const icone = document.createElement('i');
  icone.classList.add('fas');
  icone.classList.add('fa-user');
  iconeContainer.appendChild(icone);

  const btnContainer = document.createElement('div');
  btnContainer.classList.add('btn_alerta_container');

  const btnDesligarLigacao = document.createElement('button');
  btnDesligarLigacao.classList.add('btn_rejeitar_chamada_alerta');
  // <i class="fas fa-phone-slash"></i>
  const iconeDesligaChamada = document.createElement('i');
  iconeDesligaChamada.classList.add('fas');
  iconeDesligaChamada.classList.add('fa-phone-slash');
  const textBtnDesliga = document.createElement('span');
  textBtnDesliga.innerHTML = 'Desligar';
  btnDesligarLigacao.appendChild(iconeDesligaChamada);
  btnDesligarLigacao.appendChild(textBtnDesliga);
  btnContainer.appendChild(btnDesligarLigacao);

  alertaContent.appendChild(titulo);
  alertaContent.appendChild(iconeContainer);
  alertaContent.appendChild(btnContainer);

  btnDesligarLigacao.addEventListener('click', () => {
    acaoChamadaRejeitada();
  });

  return alerta;
};

export const getChamandoLigacaoAlerta = (infoLigacaoTipo, aceitarLigacao, rejeitarLigacao) => {
  const alerta = document.createElement('div');
  alerta.classList.add('alerta_fundo');

  const alertaContent = document.createElement('div');
  alertaContent.classList.add('alerta_content');
  alerta.appendChild(alertaContent);

  const titulo = document.createElement('p');
  titulo.classList.add('alerta_titulo');
  titulo.innerHTML = `Chamando ${infoLigacaoTipo} para Ligação`;

  const iconeContainer = document.createElement('div');
  iconeContainer.classList.add('alerta_icone_container');

  //<i class="fas fa-user"></i>
  const icone = document.createElement('i');
  icone.classList.add('fas');
  icone.classList.add('fa-user');
  iconeContainer.appendChild(icone);

  const btnContainer = document.createElement('div');
  btnContainer.classList.add('btn_alerta_container');

  const btnAceitarLigacao = document.createElement('button');
  btnAceitarLigacao.classList.add('btn_aceitar_chamada_alerta');
  // <i class="fas fa-phone"></i>
  const iconeAceitarChamada = document.createElement('i');
  iconeAceitarChamada.classList.add('fas');
  iconeAceitarChamada.classList.add('fa-phone');
  const textBtnAtender = document.createElement('span');
  textBtnAtender.innerHTML = 'Atender';
  btnAceitarLigacao.appendChild(iconeAceitarChamada);
  btnAceitarLigacao.appendChild(textBtnAtender);
  btnContainer.appendChild(btnAceitarLigacao);

  const btnDesligarLigacao = document.createElement('button');
  btnDesligarLigacao.classList.add('btn_rejeitar_chamada_alerta');
  // <i class="fas fa-phone-slash"></i>
  const iconeDesligaChamada = document.createElement('i');
  iconeDesligaChamada.classList.add('fas');
  iconeDesligaChamada.classList.add('fa-phone-slash');
  const textBtnDesliga = document.createElement('span');
  textBtnDesliga.innerHTML = 'Desligar';
  btnDesligarLigacao.appendChild(iconeDesligaChamada);
  btnDesligarLigacao.appendChild(textBtnDesliga);
  btnContainer.appendChild(btnDesligarLigacao);

  alertaContent.appendChild(titulo);
  alertaContent.appendChild(iconeContainer);
  alertaContent.appendChild(btnContainer);

  btnAceitarLigacao.addEventListener('click', () => {
    aceitarLigacao();
  });

  btnDesligarLigacao.addEventListener('click', () => {
    rejeitarLigacao();
  });

  return alerta;
};

export const getInfoAlerta = (tituloAlerta, descricaoAlerta) => {
  const alerta = document.createElement('div');
  alerta.classList.add('alerta_fundo');

  const alertaContent = document.createElement('div');
  alertaContent.classList.add('alerta_content');
  alerta.appendChild(alertaContent);

  const titulo = document.createElement('p');
  titulo.classList.add('alerta_titulo');
  titulo.innerHTML = tituloAlerta;

  const iconeContainer = document.createElement('div');
  iconeContainer.classList.add('alerta_icone_container');

  //<i class="fas fa-user"></i>
  const icone = document.createElement('i');
  icone.classList.add('fas');
  icone.classList.add('fa-user');
  iconeContainer.appendChild(icone);

  const descricao = document.createElement('p');
  descricao.classList.add('descricao_alerta');
  descricao.innerHTML = descricaoAlerta;

  alertaContent.appendChild(titulo);
  alertaContent.appendChild(iconeContainer);
  alertaContent.appendChild(descricao);

  return alerta;
};

export const getMensagemDireita = (mensagem) => {
  const mensagemContainer = document.createElement('div');
  mensagemContainer.classList.add('mensagem_direita_constainer');
  const mensagemParagrafo = document.createElement('p');

  mensagemParagrafo.innerHTML = mensagem;
  mensagemContainer.appendChild(mensagemParagrafo);

  return mensagemContainer;
};

export const getMensagemEsquerda = (mensagem) => {
  const mensagemContainer = document.createElement('div');
  mensagemContainer.classList.add('mensagem_esquerda_constainer');
  const mensagemParagrafo = document.createElement('p');

  mensagemParagrafo.innerHTML = mensagem;
  mensagemContainer.appendChild(mensagemParagrafo);

  return mensagemContainer;
};
