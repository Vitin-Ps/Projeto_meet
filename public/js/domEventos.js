var show_painel = true;
var show_mensagens = false;

function mostrarPainel(btnPainel) {
  const painel_container = document.querySelector('.painel_container');
  const painel_header_container = document.querySelector('.painel_header_container');
  const painel_main_container = document.querySelector('.painel_main_container');

  if (show_painel) {
    btnPainel.style = 'background-color: transparent;  border-color: #FFF;';
    painel_container.style.width = '50px';
    setTimeout(() => {
      painel_header_container.style.padding = '0';
      painel_header_container.style = 'justify-content: center; flex-direction: column;';
    }, 400);
    painel_main_container.style.display = 'none';

    show_painel = !show_painel;
  } else {
    btnPainel.style = 'background-color: #FFF;';
    painel_container.style.width = '300px';
    setTimeout(() => {
      painel_header_container.style.padding = '0 1em';
      painel_header_container.style = 'justify-content: space-between; flex-direction: row;';
      painel_main_container.style.display = 'flex';
    }, 400);

    show_painel = !show_painel;
  }
}

function mostrarMenssagens(btnMostrarMsn) {
  const mensagem_container = document.querySelector('.mensagens_container');
  const mensagens_container_main = document.querySelector('.mensagens_container_main');
  const nova_mensagem_container = document.querySelector('.nova_mensagem_container');

  if (show_mensagens) {
    btnMostrarMsn.style = 'background-color: transparent;';

    mensagem_container.style = 'width: 30px;';
    mensagens_container_main.style.display = 'none';
    nova_mensagem_container.style.display = 'none';
    
    show_mensagens = !show_mensagens;
  } else {
    btnMostrarMsn.style = 'background-color: var(--cor001);';
    
    mensagem_container.style = 'width: 300px;';
    mensagens_container_main.style.display = 'flex';
    nova_mensagem_container.style.display = 'flex';

    show_mensagens = !show_mensagens;
  }
}
