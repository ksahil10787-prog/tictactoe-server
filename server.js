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

io.on('connection', (socket) => {
  socket.on('joinRoom', (room) => {
    socket.join(room);
    const player = Math.random() > 0.5 ? 'X' : 'O';
    socket.emit('roomJoined', { room, player });
  });

  socket.on('move', ({ room, board }) => {
    io.to(room).emit('updateBoard', board);
  });

  socket.on('chatMessage', ({ room, msg }) => {
    io.to(room).emit('chatMessage', msg);
  });

  socket.on('voiceOffer', (data) => io.to(data.room).emit('voiceOffer', data));
  socket.on('voiceAnswer', (data) => io.to(data.room).emit('voiceAnswer', data));
  socket.on('iceCandidate', (data) => io.to(data.room).emit('iceCandidate', data));
});

server.listen(5000, () => console.log('Server running on port 5000'));
