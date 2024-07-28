const Joi = require('joi');

const AlbumSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
  cover: Joi.string(),
});

const CoverHeadersSchema = Joi.object({
  'content-type': Joi.string().valid(
    'image/apng',
    'image/avif',
    'image/gif',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/jpg',
  ).required(),
}).unknown();

module.exports = { AlbumSchema, CoverHeadersSchema };
