const express = require('express');
const http = require('http');
const path = require('path')

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

let peersConmectados = [];

io.on('connection', (socket) => {
  console.log('Novo usuário conectado: ', socket.id);
  peersConmectados.push(socket.id);
  console.log(peersConmectados);

  socket.on('pedido-chamada', (data) => {
    const { chamadorSocketId, ligacaoTipo } = data;
    const peerConectado = peersConmectados.find((peerSokcketId) => peerSokcketId === chamadorSocketId);

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

    const peerConectado = peersConmectados.find((peerSokcketId) => peerSokcketId === chamadorSocketId);

    if (peerConectado) {
      io.to(data.chamadorSocketId).emit('pedido-chamada-resposta', data);
    }
  });

  socket.on('sinal-webRTC', (data) => {
    const { usuarioConectadoSocketId } = data;

    const peerConectado = peersConmectados.find((peerSokcketId) => peerSokcketId === usuarioConectadoSocketId);

    if (peerConectado) {
      io.to(usuarioConectadoSocketId).emit('sinal-webRTC', data);
    }
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado');

    const newPeersConectados = peersConmectados.filter((peerSokcketId) => peerSokcketId !== socket.id);

    peersConmectados = newPeersConectados;
    console.log(peersConmectados);
  });
});

// teste
server.listen(PORT, () => {
  console.log(`Server iniciado na porta ${PORT}\nPara acessar a aplicação, clique em http://localhost:${PORT}`);
});
