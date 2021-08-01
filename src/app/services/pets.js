const logger = require('../logger');
const { Pet: Pets } = require('../models');
const { databaseError } = require('../errors/builders');

exports.bulkCreatePets = ({ pets, ownerId, options }) => {
  const petsToCreate = pets.map(pet => {
    return { ...pet, ownerId };
  });

  return Pets.bulkCreate(petsToCreate, options).catch(error => {
    logger.error('Error creating multiple pets, reason:' + error);
    databaseError(error.message);
  });
};
