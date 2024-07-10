var show_painel = true;
var show_mensagens = false;

const btn_show_mensagens = document.querySelector('.btn_show_mensagens');
btn_show_mensagens.addEventListener('click', () => {
  mostrarDivMensagens();
});

const btn_mostrar_painel = document.querySelector('.btn_mostrar_painel');
btn_mostrar_painel.addEventListener('click', () => {
  mostrarDivPainel();
});

export const mostrarDivPainel = (ativarAutomativamente = false, mostrarDiv = false) => {
  const painel_container = document.querySelector('.painel_container');
  const painel_header_container = document.querySelector('.painel_header_container');
  const painel_main_container = document.querySelector('.painel_main_container');
  const btn_mostrar_painel = document.querySelector('.btn_mostrar_painel');

  if (ativarAutomativamente) {
    show_painel = mostrarDiv;
  }

  if (show_painel) {
    btn_mostrar_painel.style = 'background-color: transparent;  border-color: #FFF;';
    painel_container.style.width = '50px';
    setTimeout(() => {
      painel_header_container.style.padding = '0';
      painel_header_container.style = 'justify-content: center; flex-direction: column;';
    }, 400);
    painel_main_container.style.display = 'none';

    show_painel = !show_painel;
  } else {
    btn_mostrar_painel.style = 'background-color: #FFF;';
    painel_container.style.width = '300px';
    setTimeout(() => {
      painel_header_container.style.padding = '0 1em';
      painel_header_container.style = 'justify-content: space-between; flex-direction: row;';
      painel_main_container.style.display = 'flex';
    }, 400);

    show_painel = !show_painel;
  }
};

export const mostrarDivMensagens = (ativarAutomativamente = false, mostrarDiv = false) => {
  const mensagem_container = document.querySelector('.mensagens_container');
  const mensagens_container_main = document.querySelector('.mensagens_container_main');
  const nova_mensagem_container = document.querySelector('.nova_mensagem_container');
  const btn_show_mensagens = document.querySelector('.btn_show_mensagens');

  if (ativarAutomativamente) {
    show_mensagens = mostrarDiv;
  }

  if (show_mensagens) {
    btn_show_mensagens.style = 'background-color: transparent;';

    mensagem_container.style = 'width: 30px;';
    mensagens_container_main.style.display = 'none';
    nova_mensagem_container.style.display = 'none';

    show_mensagens = !show_mensagens;
  } else {
    btn_show_mensagens.style = 'background-color: var(--cor001);';

    mensagem_container.style = 'width: 300px;';
    mensagens_container_main.style.display = 'flex';
    nova_mensagem_container.style.display = 'flex';

    show_mensagens = !show_mensagens;
  }
};
