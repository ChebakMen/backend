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
// app.use('/uploads', express.static('uploads'));

app.use('/api', require('./routes'));

// Middleware для парсинга JSON
app.use(express.json());

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
