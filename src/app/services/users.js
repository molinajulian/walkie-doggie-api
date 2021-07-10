const { inspect } = require('util');
const logger = require('../logger');
const { hashString } = require('../utils/hashes');
const { alreadyExist } = require('../errors/builders');
const { databaseError } = require('../errors/builders');
const { User } = require('../models');

exports.createUser = attrs => {
  logger.info(`Attempting to create user with attributes: ${inspect(attrs)}`);
  return hashString(attrs.password).then(hash =>
    User.findCreateFind({ where: { email: attrs.email }, defaults: { ...attrs, password: hash } })
      .catch(err => {
        /* istanbul ignore next */
        logger.error(inspect(err));
        /* istanbul ignore next */
        throw databaseError(`Error creating a user, reason: ${err.message}`);
      })
      .then(([instance, created]) => {
        if (!created) throw alreadyExist('The provided user already exist');
        return instance;
      })
  );
};
