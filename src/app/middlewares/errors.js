const errors = require('../errors/internal_codes');
const logger = require('../logger');

const DEFAULT_STATUS_CODE = 500;

const statusCodes = {
  [errors.DATABASE_ERROR]: 503,
  [errors.INTERNAL_SERVER_ERROR]: 500,
  [errors.ALREADY_EXIST]: 400,
  [errors.INVALID_PARAMS]: 400,
  [errors.NOT_FOUND]: 404,
  [errors.INVALID_CREDENTIALS]: 400,
  [errors.INVALID_TOKEN]: 400,
};

// eslint-disable-next-line
exports.handle = (error, req, res, next) => {
  /* istanbul ignore next */
  logger.error(error);
  res.status((error.internalCode && statusCodes[error.internalCode]) || DEFAULT_STATUS_CODE);
  return res.send({ message: error.message, internal_code: error.internalCode });
};
