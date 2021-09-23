const logger = require('../logger');
const { Pet } = require('../models');
const { databaseError } = require('../errors/builders');

exports.bulkCreatePets = ({ pets, ownerId, options }) => {
  const petsToCreate = pets.map(pet => {
    return { ...pet, ownerId };
  });
  return Pet.bulkCreate(petsToCreate, options).catch(error => {
    logger.error('Error creating multiple pets, reason:' + error);
    throw databaseError(error.message);
  });
};

exports.deletePetsOfUser = ({ user }, { transaction }) =>
  Pet.destroy({ where: { ownerId: user.id }, transaction }).catch(error => {
    logger.error('Error deleting addresses, reason:', error);
    throw databaseError(error.message);
  });

exports.findBy = ({ where, options }) =>
  Pet.findOne({ where, ...options }).catch(error => {
    logger.error('Error getting one pet, reason:', error);
    throw databaseError(error.message);
  });

exports.updatePet = ({ data, pet, options }) => {
  pet.name = data.name;
  pet.breed = data.breed;
  pet.birthYear = data.birthYear;
  pet.gender = data.gender;
  pet.weight = data.weight;
  pet.photoUri = data.photoUri;
  pet.description = data.description;
  return pet.save({ ...options }).catch(error => {
    logger.error('Error updating one pet, reason:', error);
    throw databaseError(error.message);
  });
};

exports.createPet = ({ data, user, options }) =>
  Pet.create({ ...data, ownerId: user.id }, options).catch(error => {
    logger.error('Error creating one pet, reason:', error);
    throw databaseError(error.message);
  });
