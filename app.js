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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('static'))

app.use(fileUpload());

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

app.listen(config.PORT, async () => {
  try {
    await mongoose.connect(config.MONGO_DB_URL);
    console.log('Server listen ' + config.PORT);
    cronRunner();
  } catch (err) {
    console.log('Error >', err.message);
  }
});
