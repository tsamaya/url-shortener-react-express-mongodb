const debug = require('debug')('url-shortener:controller');
const Url = require('./Url');
const helper = require('./helper');
/* eslint no-underscore-dangle: off */
// TODO: underscore dangle from mongodb _id

/**
 * @apiDefine ShortLinkErrors
 * @apiError {String} LinkNotFound The short link was not found
 * @apiError {String} Unauthorized You do not have permission to update this short link
 * @apiErrorExample {json} Example error response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "code": 404,
 *       "message": "Short link not found",
 *       "error": "LinkNotFound"
 *     }
 */

/**
 * @apiDefine LinkFoundResponse
 *
 * @apiSuccess {Object} data The short link document
 * @apiSuccess {String} data.short The short link
 * @apiSuccess {String} data.url URL which the short corresponds to
 * @apiSuccess {String} data.title Title of the site to redirect to
 * @apiSuccess {String} data.description Meta description of the site to redirect to
 * @apiSuccess {String} data.og_description og_description of the site to redirect to
 * @apiSuccess {String} data.og_image og_image of the site to redirect to
 * @apiSuccess {Number} data.hits Number of times this short was visited
 * @apiSuccess {Date} data.updatedAt The last time the short link was updated
 * @apiSuccess {Date} data.createdAt When the short link was created
 * @apiSuccess {String} data.id The ID of the short link document
 * @apiSuccess {String} data.secret_key The key to use when updating the short
 *                      link (not provided when getting a single short link)
 */

/**
 * @apiDefine InvalidParamSecretKeyError
 * @apiError {String} InvalidParamSecretKey Missing parameter secret_key
 */

/**
 * @api {get} /short Request information about short URLs
 * @apiGroup Short
 * @apiName IndexShort
 * @apiParam secret_keys Commma-delimited string of secret_key values
 *
 * @apiUse LinkFoundResponse
 * @apiUse InvalidParamSecretKeyError
 *
 * @apiSuccessExample {json} Example success response:
 *    HTTP/1.1 200 OK
 *    {
 *      "data": [{
 *        "short": "_q7ctfo",
 *        "og_image": null,
 *        "og_description": null,
 *        "description": null,
 *        "title": "Example Domain",
 *        "updatedAt": "2017-07-12T13:42:45.925Z",
 *        "createdAt": "2017-07-12T13:42:45.925Z",
 *        "url": "http://example.com",
 *        "hits": 0,
 *        "id": "596627557dcab11665a21b5a",
 *        "secret_key": "secretkey"
 *      }]
 *    }
 */

module.exports.index = (req, res, next) => { // eslint-disable-line
  if (!req.query.secret_keys)
    return next(helper.makeError('InvalidParamSecretKeys'));

  const keys = req.query.secret_keys.split(',');
  Url.find({ secret_key: { $in: keys } })
    .where('secret_key')
    .ne(null)
    .exec((err, urls) => { // eslint-disable-line
      if (err) return next(err);
      res.json({
        data: urls,
      });
    });
};

/**
 * @api {get} /short/:id Request information about a short URL
 * @apiGroup Short
 * @apiName GetShort
 * @apiVersion 0.1.0
 *
 * @apiSuccessExample {json} Example success response:
 *    HTTP/1.1 200 OK
 *    {
 *      "data": {
 *        "short": "_q7ctfo",
 *        "og_image": null,
 *        "og_description": null,
 *        "description": null,
 *        "title": "Example Domain",
 *        "updatedAt": "2017-07-12T13:42:45.925Z",
 *        "createdAt": "2017-07-12T13:42:45.925Z",
 *        "url": "http://example.com",
 *        "hits": 0,
 *        "id": "596627557dcab11665a21b5a"
 *      }
 *    }
 *
 * @apiUse ShortLinkErrors
 * @apiUse LinkFoundResponse
 */

module.exports.get = (req, res, next) => {
  Url.findOne({ short: req.params.id }, (err, url) => { // eslint-disable-line
    if (err) return next(err);
    if (!url) return next(helper.makeError('LinkNotFound'));

    delete url.secret_key; // eslint-disable-line

    res.json({
      data: url,
    });
  });
};

/**
 * @api {post} /short Create a new short link
 * @apiGroup Short
 * @apiName PostShort
 * @apiVersion 0.1.0
 * @apiUse InvalidParamSecretKeyError
 *
 * @apiParam {String} url The URL which the short points to
 * @apiParam {String} secret_key The secret key to use when creating the short link
 *
 *
 * @apiSuccessExample {json} Example success response:
 *    HTTP/1.1 202 Created
 *    {
 *      "message": "Created",
 *      "data": {
 *        "short": "_q7ctfo",
 *        "og_image": null,
 *        "og_description": null,
 *        "description": null,
 *        "title": "Example Domain",
 *        "updatedAt": "2017-07-12T13:42:45.925Z",
 *        "createdAt": "2017-07-12T13:42:45.925Z",
 *        "url": "http://example.com",
 *        "secret_key": "my secret key"
 *        "hits": 0,
 *        "id": "596627557dcab11665a21b5a"
 *      }
 *    }
 */

module.exports.post = (req, res, next) => { // eslint-disable-line
  // a null secret_key means it cannot be created
  if (typeof req.body.secret_key === 'undefined' || req.body.secret_key === '')
    return next(helper.makeError('InvalidParamSecretKey'));
  debug(req.body);
  Url.create(req.body, (err, doc) => { // eslint-disable-line
    if (err) return next(err);
    res.status(201).json({
      message: 'Created',
      data: doc,
    });
  });
};

/**
 * @api {put} /short/:short Update a short link
 * @apiGroup Short
 * @apiName PutShort
 * @apiVersion 0.1.0
 * @apiUse InvalidParamSecretKeyError
 *
 * @apiParam {String} url The URL which the short points to
 * @apiParam {String} secret_key Random secret key to use when updating the short link
 *
 * @apiSuccessExample {json} Example success response:
 *    HTTP/1.1 200 OK
 *    {
 *      "message": "Updated",
 *      "data": {
 *        "short": "_q7ctfo",
 *        "og_image": null,
 *        "og_description": null,
 *        "description": null,
 *        "title": "Example Domain",
 *        "updatedAt": "2017-07-12T13:42:45.925Z",
 *        "createdAt": "2017-07-12T13:42:45.925Z",
 *        "url": "http://example.com",
 *        "secret_key": "my secret key"
 *        "hits": 0,
 *        "id": "596627557dcab11665a21b5a"
 *      }
 *    }
 * @apiUse ShortLinkErrors
 */

module.exports.put = (req, res, next) => {
  debug('put');

  Url.findOne(
    { short: req.params.id, secret_key: { $ne: null } },
    (err, doc) => { //eslint-disable-line
      if (err) return next(err);
      if (!doc) return next(helper.makeError('LinkNotFound'));

      if (req.body.secret_key !== doc.secret_key)
        return next(helper.makeError('Unauthorized'));

      Url.findOneAndUpdate(doc._id, req.body, (error, docUpdated) => { //eslint-disable-line
        if (error) return next(error);
        res.status(200).json({
          message: 'Updated',
          data: docUpdated,
        });
      });
    }
  );
};

/**
 * @api {delete} /short/:short Delete a short link
 * @apiGroup Short
 * @apiName DeleteShort
 * @apiVersion 0.1.0
 * @apiUse InvalidParamSecretKeyError
 *
 * @apiParam {String} secret_key Random secret key to use when deleting the short link
 *
 * @apiSuccessExample {json} Example success response:
 *    HTTP/1.1 200 OK
 *    {
 *      "message": "Deleted",
 *      "data": {
 *        "short": "_q7ctfo",
 *        "og_image": null,
 *        "og_description": null,
 *        "description": null,
 *        "title": "Example Domain",
 *        "updatedAt": "2017-07-12T13:42:45.925Z",
 *        "createdAt": "2017-07-12T13:42:45.925Z",
 *        "url": "http://example.com",
 *        "secret_key": "my secret key"
 *        "hits": 0,
 *        "id": "596627557dcab11665a21b5a"
 *      }
 *    }
 * @apiUse ShortLinkErrors
 */

module.exports.delete = (req, res, next) => {
  debug(req.params.id);
  Url.findOne(
    { short: req.params.id, secret_key: { $ne: null } },
    (err, doc) => { // eslint-disable-line
      if (err) return next(err);
      if (!doc) return next(helper.makeError('LinkNotFound'));

      if (req.body.secret_key !== doc.secret_key)
        return next(helper.makeError('Unauthorized'));

      Url.findOneAndRemove({ _id: doc._id }, (error, docDeleted) => { // eslint-disable-line
        if (error) return next(error);
        res.status(200).json({
          message: 'Deleted',
          data: docDeleted,
        });
      });
    }
  );
};
