const InvariantError = require('../../exceptions/InvariantError');
const { ActivitiesPayloadSchema } = require('./schema');

const ActivitiesValidator = {
  validateActivityPayload: (payload) => {
    const validationResult = ActivitiesPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ActivitiesValidator;
