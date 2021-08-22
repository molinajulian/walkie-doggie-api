const { FirebaseToken } = require('../models');
const logger = require('../logger');
const { databaseError, notFound } = require('../errors/builders');

exports.deleteFirebaseToken = ({ user, firebaseToken }, options = {}) =>
  FirebaseToken.destroy({ where: { token: firebaseToken, userId: user.id }, ...options })
    .catch(error => {
      logger.error('Error deleting certification, reason:', error);
      throw databaseError(error.message);
    })
    .then(tokensDestroyed => {
      if (!tokensDestroyed) throw notFound('The provided firebase token does not exist');
    });

exports.createFirebaseToken = ({ user, firebaseToken }, options = {}) =>
  FirebaseToken.create({ userId: user.id, token: firebaseToken }, options).catch(error => {
    logger.error('Error creating a firebase token, reason:', error);
    throw databaseError(error.message);
  });
