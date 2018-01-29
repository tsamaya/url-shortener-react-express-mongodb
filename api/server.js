const debug = require('debug')('url-shortener:server');
const http = require('http');
// express app
const app = require('./lib/app');

require('dotenv').load();

//  Log unhandled exceptions.
process.on('uncaughtException', err => {
  debug(`Unhandled Exception: ${err}`);
});

process.on('unhandledRejection', (err, promise) => { // eslint-disable-line
  debug(`Unhandled Rejection: ${err}`);
});

/**
 * normalize Port used
 * @param  {Number} val port value
 * @return {Number}     normalized port value or false
 */
const normalizePort = val => {
  const port = parseInt(val, 10);
  if (Number.isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const onError = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  switch (error.code) {
    case 'EACCES':
      process.exit(1);
      break;
    case 'EADDRINUSE':
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const port = normalizePort(process.env.API_PORT || '3000');
app.set('port', port);
const server = http.createServer(app);

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `Pipe ${port}` : `Port ${port}`;
  debug(`Listening on ${bind}`);
};

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
