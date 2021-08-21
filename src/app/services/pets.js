const logger = require('../logger');
const { Pet } = require('../models');
const { databaseError } = require('../errors/builders');

exports.bulkCreatePets = ({ pets, ownerId, options }) => {
  const petsToCreate = pets.map(pet => {
    return { ...pet, ownerId };
  });
  return Pet.bulkCreate(petsToCreate, options).catch(error => {
    logger.error('Error creating multiple pets, reason:' + error);
    databaseError(error.message);
  });
};

exports.deletePetsOfUser = ({ user }, { transaction }) =>
  Pet.destroy({ where: { ownerId: user.id }, transaction }).catch(error => {
    logger.error('Error deleting addresses, reason:', error);
    throw databaseError(error.message);
  });
