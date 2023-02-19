const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const { config } = require('./config');
const { userRouter, carRouter, authRouter } = require('./router');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRouter);
app.use('/cars', carRouter);
app.use('/users', userRouter);

app.get('/', (req, res) => {
  res.json('WELOCME');
});

// Global error handler
app.use((error, req, res, next) => {
  console.log('Caught error:', error.status, error.message);

  res.status(error.status || 500).json({
    message: error.message || 'Unknown error',
    status: error.status || 500
  })
});


app.listen(config.PORT, async () => {
  try {
    await mongoose.connect(config.MONGO_DB_URL);
    console.log('Server listen ' + config.PORT);
  } catch (err) {
    console.log('Error >', err.message);
  }
});
