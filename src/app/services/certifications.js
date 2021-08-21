const { Certification } = require('../models');
const logger = require('../logger');
const { databaseError } = require('../errors/builders');

exports.deleteCertificationOfUser = ({ user }, { transaction }) =>
  Certification.destroy({ where: { walkerId: user.id }, transaction }).catch(error => {
    logger.error('Error deleting certification, reason:', error);
    throw databaseError(error.message);
  });

exports.bulkCreateCertifications = ({ user, certifications }, options) => {
  const certificationsToCreate = certifications.map(r => {
    return { ...r, walkerId: user.id };
  });
  return Certification.bulkCreate(certificationsToCreate, options).catch(error => {
    logger.error('Error creating certifications, reason:', error);
    throw databaseError(error.message);
  });
};
