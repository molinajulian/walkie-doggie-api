const { DATABASE_ERROR, INTERNAL_SERVER_ERROR, ALREADY_EXIST, INVALID_PARAMS } = require('./internal_codes');

const buildError = (message, internalCode) => ({
  message,
  internalCode
});

exports.databaseError = message => buildError(message, DATABASE_ERROR);
/* istanbul ignore next */
exports.internalServerError = message =>
  buildError(`There was an unexpected error, reason: ${message}`, INTERNAL_SERVER_ERROR);
exports.alreadyExist = message => buildError(message, ALREADY_EXIST);
exports.invalidParams = arrayErrors => buildError(arrayErrors, INVALID_PARAMS);
