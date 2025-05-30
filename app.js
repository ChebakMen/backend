const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const updateNewsPublished = require('./cron/updateNewsPublised');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./utils/swaggerOptions');
const path = require('path');

require('dotenv').config();

const mongoDB = process.env.DATABASE_URL;

mongoose.connect(mongoDB).then(() => {
  updateNewsPublished();
});

mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const app = express();
const allowedOrigins = [
  'https://backend-newsapp.onrender.com', // продакшен на render
  'http://localhost:3000', // локальный back
  'http://127.0.0.1:3000', // локальный back
  'http://localhost:5173', // локальный front
  'http://127.0.0.1:5173', // локальный front
];
const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Статика из 'uploads'
app.use('/uploads', express.static(this.path.join(__dirname, 'uploads')));

app.use('/api', require('./routes'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    error: req.app.get('env') === 'development' ? err : {},
  });
});

module.exports = app;
