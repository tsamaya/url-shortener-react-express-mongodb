const debug = require('debug')('url-shortener:server');

require('dotenv').load();

//  Log unhandled exceptions.
process.on('uncaughtException', err => {
  debug(`Unhandled Exception: ${err}`);
});

process.on('unhandledRejection', (err, promise) => { // eslint-disable-line
  debug(`Unhandled Rejection: ${err}`);
});

const express = require('express');

const app = express();

app.get('/', (req, res) => {
  debug('server processing request');
  res.send('Hello World!');
});

app.listen(3000, () => {
  debug('Example app listening on port 3000!');
});
