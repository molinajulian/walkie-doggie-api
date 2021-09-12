const logger = require('../logger');
const { Range: Ranges } = require('../models');
const { databaseError } = require('../errors/builders');

exports.bulkCreateRanges = ({ ranges, walkerId, options }) => {
  const rangesToCreate = ranges.map(r => {
    return { ...r, walkerId };
  });
  logger.info('Attempting to create multiple ranges');
  return Ranges.bulkCreate(rangesToCreate, options).catch(error => {
    logger.error('Error creating multiple ranges, reason:', error);
    throw databaseError(error.message);
  });
};

exports.deleteRangesOfUser = ({ user }, { transaction }) =>
  Ranges.destroy({ where: { walkerId: user.id }, transaction }).catch(error => {
    logger.error('Error deleting multiple ranges, reason:', error);
    throw databaseError(error.message);
  });

exports.findBy = ({ where, options }) =>
  Ranges.findOne({ where, ...options }).catch(error => {
    logger.error('Error getting one range, reason:', error);
    throw databaseError(error.message);
  });
