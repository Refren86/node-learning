const http = require('http');
const socketIO = require('socket.io');
const express = require('express');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const swaggerUI = require('swagger-ui-express');

require('dotenv').config();
global.crypto = require('crypto'); // for unique ids

const { config } = require('./config');
const { cronRunner } = require('./cron');
const swaggerJSON = require('./swagger.json');
const { userRouter, carRouter, authRouter } = require('./router');

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('static'));

app.use(fileUpload());

const io = socketIO(server, {
  cors: 'http://127.0.0.1:5500/index.html', // whitelisted url (client)
});

// socket = client object
io.on('connection', (socket) => {
  console.log(socket.id);

  console.log(socket.handshake.auth); // getting access token from frontend

  socket.on('message:send', ({ message }) => {
    console.log(message);

    // ------------------------------------------------------
    // SEND EVENT TO ALL SOCKETS EXCEPT SENDER SOCKET
    socket.broadcast.emit('message:new', message);

    // SEND EVENT TO ALL SOCKETS
    // io.emit('message:new', message);

    // SEND EVENT ONLY TO SENDER SOCKET
    // socket.emit("message:new", message)
    // ------------------------------------------------------
  });

  socket.on('room:join', ({ roomId }) => {
    socket.join(roomId); // socket join room
    // socket.leave(roomId); // socket leave room

    // SEND TO ALL IN ROOM EXCEPT NEW MEMBER
    // socket.to(roomId).emit('room:newUser', {
    //   message: `User ${socket.id} connected to the room ${roomId}`,
    // });

    // SEND TO ALL IN ROOM
    io.to(roomId).emit('room:newUser', {
      message: `User ${socket.id} connected to the room ${roomId}`,
    });
  });

  socket.on('disconnect', () => {
    console.log(`User ${socket.id} has disconnected`);
  });
});

app.use('/auth', authRouter);
app.use('/cars', carRouter);
app.use('/users', userRouter);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerJSON));

app.get('/', (req, res) => {
  res.json('WELOCME');
});

// Global error handler
app.use((error, req, res, next) => {
  console.log('Caught error:', error.status, error.message);

  res.status(error.status || 500).json({
    message: error.message || 'Unknown error',
    status: error.status || 500,
  });
});

server.listen(config.PORT, async () => {
  try {
    await mongoose.connect(config.MONGO_DB_URL);
    console.log('Server listen ' + config.PORT);
    cronRunner();
  } catch (err) {
    console.log('Error >', err.message);
  }
});
