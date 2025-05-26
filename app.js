const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const updateNewsPublished = require('./cron/updateNewsPublised');
require('dotenv').config();

const mongoDB = process.env.DATABASE_URL;

mongoose.connect(mongoDB).then(() => {
  updateNewsPublished();
});

mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const app = express();
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Статика из 'uploads'
app.use('/uploads', express.static('uploads'));

app.use('/api', require('./routes'));

app.use(express.json());

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
