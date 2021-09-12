const { inspect } = require('util');
const logger = require('../logger');
const { hashString } = require('../utils/hashes');
const { alreadyExist, databaseError, notFound } = require('../errors/builders');
const { User } = require('../models');

const { moment } = require('../utils/moment');
const { USER_TYPES } = require('../utils/constants');

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
      }),
  );
};

exports.getUserBy = (filters, scopes = ['complete']) => {
  logger.info(`Attempting to get user with filters: ${inspect(filters)}`);
  return User.scope(scopes)
    .findOne({ where: filters })
    .catch(err => {
      /* istanbul ignore next */
      logger.error(inspect(err));
      /* istanbul ignore next */
      throw databaseError(`Error getting a user, reason: ${err.message}`);
    })
    .then(user => {
      if (!user) throw notFound('User not found');
      return user;
    });
};

exports.updateLastLogin = user => {
  user.lastLogin = moment().format();
  return user.save().catch(err => {
    /* istanbul ignore next */
    logger.error(inspect(err));
    /* istanbul ignore next */
    throw databaseError(`Error updating a user, reason: ${err.message}`);
  });
};

exports.updateUser = async ({ user, data, options }) => {
  delete data.email;
  return user.update(data, options).catch(error => {
    logger.error(inspect(error));
    throw databaseError(`Error updating a user, reason: ${error.message}`);
  });
};

exports.listWalkers = () => {
  return User.findAndCountAll({ where: { type: USER_TYPES.WALKER } }).catch(error => {
    logger.error(inspect(error));
    throw databaseError(`Error listing the walkers, reason: ${error.message}`);
  });
};
