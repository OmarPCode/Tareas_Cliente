const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado:', socket.id);

  socket.on('user_connected', (username) => {

    socket.broadcast.emit('user_connected', username);
  });

  socket.on('message', (data) => {
    io.emit('message', data);
  });

  socket.on('disconnect', (reason) => {
    console.log(`Cliente desconectado: ${socket.id} (motivo: ${reason})`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor Socket.IO en http://localhost:${PORT}`));
