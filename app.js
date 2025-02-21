const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config()

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const catalogRouter = require('./routes/catalog');

const app = express();

// Set up mongoose connetion
mongoose.set("strictQuery", false);
const dbPassword = encodeURIComponent(process.env.DB_PASSWORD);
const mongoDB = `mongodb+srv://root:${dbPassword}@cluster0.56aay6l.mongodb.net/local_library?retryWrites=true&w=majority`;

try {
	mongoose.connect(mongoDB);
} catch (err) {
	console.log(err);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);

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
