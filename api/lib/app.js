const debug = require('debug')('url-shortener:app');
// minimalist web framework for node
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

const helper = require('./helper');
const Models = require('./Models');

const app = express();

const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
const dbHost = process.env.MONGO_HOST;
const dbPort = process.env.MONGO_PORT;
const dbName = process.env.MONGO_NAME;

const mongoURI = `mongodb://${dbHost}:${dbPort}/${dbName}`;

mongoose.Promise = global.Promise;

mongoose.connect(mongoURI);
mongoose.connection.on('error', () => {
  debug(
    `MongoDB connection error. Please make sure that MongoDB is running and available at ${mongoURI}`
  );
  process.exit(1);
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// view engine
const hbs = exphbs.create({
  defaultLayout: 'main',
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// routes
const API_VERSION = 1;
const API_ROOT = `/api/v${API_VERSION}`;

app.use(API_ROOT, require('./routers'));

app.get('/', (req, res) => {
  debug('route `/`');
  res.send('Nothing here!');
});

// app.get('/:short', (req, res, next) => {
//   if (['api', 'docs', '/'].indexOf(req.params.short) !== -1) {
//     return res.status(301).redirect(`/s/${req.params.short}`);
//   }
//   return next();
// });

app.get('/r', (req, res, next) => {
  debug('route `/r`');
  Models.Url.find().count((err, shortlinks) => { // eslint-disable-line
    if (err) {
      return next(err);
    }
    res.json({ links: shortlinks });
  });
});

app.get('/r/:short', (req, res, next) => {
  Models.Url.findOne({ short: req.params.short }, (err, doc) => {
    if (err) return next(err);
    if (!doc) return next();

    res.render('redirect', { layout: false, short: doc });

    doc.incrementHit((error, result) => { // eslint-disable-line
      if (error) debug(error);
    });
    return true;
  });
});

app.use((req, res, next) => {
  debug('route `not found`');
  const e = new Error('Page Not Found');
  e.status = 404;
  next(e);
});

// api error handler
app.use('/api', (err, req, res, next) => { // eslint-disable-line
  debug('api error handler');
  let error = err;
  error.status = err.status || 500;
  if (error.status === 500) debug(error);

  switch (error.name) {
    case 'CastError': {
      error.message = `Unable to convert ${error.value} at ${error.path} to ${
        error.kind
      }`;
      error.status = 400;
      break;
    }

    case 'ValidationError': {
      // hack or what
      const info = error.errors[Object.keys(err.errors)[0]];
      const userDefined = info.properties.type === 'user defined';
      if (userDefined) {
        const newError = new Error(info.message);
        newError.status = err.status;
        error = newError;
      }
      error.status = err.status || 400;
      break;
    }

    default:
      debug('Nothing here');
      break;
  }

  res
    .status(err.status)
    .json({ code: err.status, message: err.message, error: err.error });
});

// HTTP error handler
app.use((err, req, res, next) => { // eslint-disable-line
  debug('app `error handler`');
  const error = err;
  error.status = err.status || 500;
  if (error.status === 500) {
    debug(error.stack);
  }

  res
    .status(error.status)
    .json({ error: error.status, message: error.message });
});
// no more use after error handler

debug(`short base URL: ${baseUrl}`);
debug(`API version: ${helper.version}`);
debug(`Mongo: ${mongoURI}`);
debug(`Mode: ${process.env.NODE_ENV}`);

module.exports = app;
