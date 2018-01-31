const debug = require('debug')('url-shortener:helper');
const pkg = require('../package.json');

exports.version = pkg.version;

const urlRegExp = require('./UrlRegex');

exports.formatUri = inputUri => {
  debug(`formatUri(${inputUri})`);
  let uri = inputUri;
  if (typeof uri === 'undefined' || uri === '') {
    const e = new Error(`Invalid URI ${uri}`);
    e.status = 400;
    return e;
  }
  if (uri.indexOf('http') === -1) {
    // this also accounts for https
    uri = `http://${inputUri}`;
  }
  if (!uri || !urlRegExp.test(uri)) {
    // if us, doesn't exist or isn't valid url
    const e = new Error(`Invalid URI ${uri}`);
    e.status = 400;
    return e;
  }
  return uri;
};

exports.makeError = error => {
  let message;
  let code;

  switch (error) {
    case 'LinkNotFound':
      message = 'Short link not found';
      code = 404;
      break;

    case 'Unauthorized':
      message = 'Permission denied';
      code = 401;
      break;

    case 'InvalidParamSecretKey':
      message = 'Missing parameter secret_key';
      code = 400;
      break;

    case 'InvalidParamSecretKeys':
      message = 'Missing parameter secret_keys';
      code = 400;
      break;

    default:
      message = 'Sorry, an unknown error occured';
      code = 500;
  }

  const e = new Error(message);
  e.status = code;
  e.error = error;

  return e;
};
