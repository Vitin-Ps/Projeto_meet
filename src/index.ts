import express, { Request, Response } from 'express';
import http from 'http';
import { Socket } from 'socket.io';

const PORT = process.env.PORT || 3002;

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

app.use(express.static('public'));

app.get('/', (req: Request, res: Response) => {
  //   res.sendFile(__dirname + 'public/index.html');
  res.sendFile(__dirname + '/public/index.html');
});

let peersConectados: String[] = [];
let peersAleatoriosConectados: String[] = [];

io.on('connection', (socket: Socket) => {
  console.log('Novo usuário conectado: ', socket.id);
  peersConectados.push(socket.id);
  console.log(peersConectados);

  socket.on('pedido-chamada', (data) => {
    const { chamadorSocketId, ligacaoTipo } = data;
    const peerConectado = peersConectados.find((peerSokcketId) => peerSokcketId === chamadorSocketId);

    console.log(peerConectado);

    if (peerConectado) {
      const data = {
        chamadorSocketId: socket.id,
        ligacaoTipo,
      };

      io.to(chamadorSocketId).emit('pedido-chamada', data);
    } else {
      const data = {
        pedidoChamadaResposta: 'CHAMADA_NAO_ENCONTRADA',
      };

      io.to(socket.id).emit('pedido-chamada-resposta', data);
    }
  });

  socket.on('pedido-chamada-resposta', (data) => {
    const { chamadorSocketId } = data;

    const peerConectado = peersConectados.find((peerSokcketId) => peerSokcketId === chamadorSocketId);

    if (peerConectado) {
      io.to(data.chamadorSocketId).emit('pedido-chamada-resposta', data);
    }
  });

  socket.on('sinal-webRTC', (data) => {
    const { usuarioConectadoSocketId } = data;

    const peerConectado = peersConectados.find((peerSokcketId) => peerSokcketId === usuarioConectadoSocketId);

    if (peerConectado) {
      io.to(usuarioConectadoSocketId).emit('sinal-webRTC', data);
    }
  });

  socket.on('usuario-desconectado', (data) => {
    const { usuarioConectadoSocketId } = data;

    const peerConectado = peersConectados.find((peerSocketId) => peerSocketId === usuarioConectadoSocketId);

    if (peerConectado) {
      io.to(usuarioConectadoSocketId).emit('usuario-desconectado');
    }
  });

  socket.on('status-conexao-aleatorio', (data) => {
    const { status } = data;

    if (status) {
      peersAleatoriosConectados.push(socket.id);
    } else {
      const novosPeersAleatoriosConectados = peersAleatoriosConectados.filter((peerSocketId) => peerSocketId !== socket.id);

      peersAleatoriosConectados = novosPeersAleatoriosConectados;
    }
    console.log('Peers Aleatórios: ', peersAleatoriosConectados);
  });

  socket.on('get-socket-id-aleatorio', () => {
    let socketIdAleatorio;
    const peersAleatoriosConectadosFiltrados = peersAleatoriosConectados.filter((peerKocketId) => peerKocketId !== socket.id);

    if (peersAleatoriosConectadosFiltrados.length > 0) {
      socketIdAleatorio = peersAleatoriosConectadosFiltrados[Math.floor(Math.random() * peersAleatoriosConectadosFiltrados.length)];
    } else {
      socketIdAleatorio = null;
    }

    const data = {
      socketIdAleatorio,
    };

    io.to(socket.id).emit('get-socket-id-aleatorio', data);
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado');

    const newPeersConectados = peersConectados.filter((peerSokcketId) => peerSokcketId !== socket.id);

    peersConectados = newPeersConectados;
    console.log('Peers: ', peersConectados);

    const newPeersAlatoriosConectados = peersAleatoriosConectados.filter((peerSokcketId) => peerSokcketId !== socket.id);

    peersAleatoriosConectados = newPeersAlatoriosConectados;
    console.log('Peers Alatórios: ', peersConectados);
  });
});

server.listen(PORT, () => {
  console.log(`Server iniciado na porta ${PORT}\nPara acessar a aplicação, clique em http://localhost:${PORT}`);
});
