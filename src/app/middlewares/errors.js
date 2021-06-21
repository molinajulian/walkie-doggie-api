const errors = require('../errors/internal_codes');
const logger = require('../logger');

const DEFAULT_STATUS_CODE = 500;

const statusCodes = {
  [errors.DATABASE_ERROR]: 503
};

// eslint-disable-next-line
exports.handle = (error, req, res, next) => {
  /* istanbul ignore next */
  logger.error(error);
  res.status((error.internalCode && statusCodes[error.internalCode]) || DEFAULT_STATUS_CODE);
  return res.send({ message: error.message, internal_code: error.internalCode });
};
