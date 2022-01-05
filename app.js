const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// routes 
const indexRouter = require('./routes/index');
const booksRouter = require('./routes/books');

// require
const db = require('./models');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// other defaults w/ setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// serve static files
app.use('/static', express.static(path.join(__dirname, 'public')));

// use routers
app.use('/', indexRouter);
app.use('/books', booksRouter);

(async () => {

  await db.sequelize.sync(/* { force: true } */);

  // connection test 
  try {
    await db.sequelize.authenticate();
    console.log("Connection to the database was successful!");
  } catch (error) {
    console.log("Error connecting to the database.", error); 
  }

})();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const error = new Error();
  error.status = 404;
  error.message = "The page you're looking for does not exist!";
  res.render("page-not-found", { error });
});

// error handler
app.use(function(err, req, res, next) {
  if (err.status = 404) {
    const error = err;
    res.render("page-not-found", { error });
  } else {
    err.status = err.status || 500;
    err.message = err.message || "Sorry! There was an unexpected error on the server.";
    
    console.log(err.status);
    console.log(err.message);

    res.render("error", { err });
  }
});

module.exports = app;