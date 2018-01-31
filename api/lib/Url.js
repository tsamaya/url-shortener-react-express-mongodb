const debug = require('debug')('url-shortener:Url');
const mongoose = require('mongoose');
const ShortId = require('mongoose-shortid-nodeps');
const request = require('request');
const helper = require('./helper');

const schemaOptions = {
  strict: true,
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id; // eslint-disable-line
      delete ret._id; // eslint-disable-line
    },
  },
  toObject: {
    virtuals: true,
  },
};

const urlSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      trim: true,
      index: true,
      unique: false,
    },
    short: {
      type: ShortId,
      lowercase: true,
      trim: true,
      unique: true,
    },
    secret_key: { type: String, default: null },
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    og_description: { type: String, trim: true },
    og_image: { type: String, trim: true },
    ga: { type: String, trim: true, default: null },
    hits: { type: Number, default: 0, required: true },
  },
  schemaOptions
);

urlSchema.pre('update', function(next) { // eslint-disable-line
  debug('preupdate');
  this.options.runValidators = true;
  next();
});

const titleRegex = new RegExp('<title>(.*?)</title>', 'i');
const metaDescriptionRegex = new RegExp(
  '<meta[^>]*name=["|\']description["|\'][^>]*content=["]([^"]*)["][^>]*>',
  'i'
);
const ogDescriptionRegex = new RegExp(
  '<meta[^>]*property=["|\']og:description["|\'][^>]*content=["]([^"]*)["][^>]*>',
  'i'
);
const ogImageRegex = new RegExp(
  '<meta[^>]*property=["|\']og:image["|\'][^>]*content=["]([^"]*)["][^>]*>',
  'i'
);

urlSchema.pre('save', function(next) { // eslint-disable-line
  debug('presave');
  const urlFormat = helper.formatUri(this.url);

  if (urlFormat instanceof Error) {
    return next(urlFormat);
  }
  this.url = urlFormat;

  // update og_tags on create, update
  request(this.url, (err, response, body) => { // eslint-disable-line
    debug('request');
    if (err) return next(err);
    if (response.statusCode !== 404) {
      // we only care about 404s
      let title = body.match(titleRegex);
      if (title) {
        // TODO: Prefer destructuring from arrays
        title = title[1]; // eslint-disable-line
      } else title = null;
      this.title = title;

      let description = body.match(metaDescriptionRegex);
      if (description) {
        // TODO: Prefer destructuring from arrays
        description = description[1]; // eslint-disable-line
      } else {
        description = null;
      }
      this.description = description;

      let ogDescription = body.match(ogDescriptionRegex);
      if (ogDescription) {
        // TODO: Prefer destructuring from arrays
        ogDescription = ogDescription[1]; // eslint-disable-line
      } else if (description) {
        ogDescription = description; // use description instead
      } else {
        ogDescription = null;
      }
      this.og_description = ogDescription;

      let ogImage = body.match(ogImageRegex);
      if (ogImage) {
        // TODO: Prefer destructuring from arrays
        ogImage = ogImage[1]; // eslint-disable-line
      } else {
        ogImage = null;
      }
      this.og_image = ogImage;
      next();
    } else {
      const e = new Error(`${this.url} returned a ${response.statusCode}`);
      e.status = 400;
      return next(e);
    }
  });
});

urlSchema.post('save', function(doc) { // eslint-disable-line
  debug(`${doc.url} -> ${doc.short}`);
});

urlSchema.methods.incrementHit = function(cb) { // eslint-disable-line
  this.hits += 1;
  this.save(cb);
};

const Url = mongoose.model('Url', urlSchema);

module.exports = Url;
