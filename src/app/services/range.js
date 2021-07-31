const logger = require('../logger');
const { Range } = require('../models');
const { databaseError } = require('../errors/builders');

exports.bulkCreateRanges = ({ ranges, walkerId, options }) => {
  const rangesToCreate = ranges.map(r => {
    return { ...r, walkerId };
  });
  logger.info('Attempting to create multiple ranges');
  return Range.bulkCreate(rangesToCreate, options).catch(error => {
    logger.error('Error creating multiple ranges, reason:', error);
    databaseError(error.message);
  });
};
