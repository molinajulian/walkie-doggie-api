const { inspect } = require('util');
const { hash, compare, genSalt } = require('bcryptjs');
const logger = require('../logger');
const { internalServerError } = require('../errors/builders');

exports.hashString = string =>
  genSalt(10)
    .then(salt => hash(string, salt))
    .catch(err => {
      /* istanbul ignore next */
      logger.error(inspect(err));
      /* istanbul ignore next */
      throw internalServerError(err.message);
    });

exports.compareHash = (password, hashedPassword) =>
  compare(password, hashedPassword).catch(err => {
    /* istanbul ignore next */
    logger.error(inspect(err));
    /* istanbul ignore next */
    throw internalServerError(err.message);
  });
