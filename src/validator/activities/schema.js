const Joi = require('joi');

const ActivitiesPayloadSchema = Joi.object({
  id: Joi.string().max(50).required(),
  playlist_id: Joi.string().max(50).required(),
  song_id: Joi.string().max(50).required(),
  user_id: Joi.string().max(50).required(),
  action: Joi.string().valid('add', 'remove', 'play', 'pause').required(),
  time: Joi.string().isoDate().required(),
});

module.exports = { ActivitiesPayloadSchema };
