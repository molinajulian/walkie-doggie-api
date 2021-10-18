const { Center } = require('../models');
const logger = require('../logger');
const { inspect } = require('util');
const { databaseError } = require('../errors/builders');

exports.listCenters = ({ type }) => {
  return Center.scope('base')
    .findAndCountAll({ where: { type } })
    .catch(error => {
      logger.error(inspect(error));
      throw databaseError(`Error listing the centers, reason: ${error.message}`);
    });
};

exports.getCenterById = id =>
  Center.scope('base')
    .findOne({
      where: { id },
    })
    .catch(error => {
      logger.error('Error getting center, reason:', error);
      throw databaseError(error.message);
    });
