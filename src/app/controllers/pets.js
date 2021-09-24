const { editPetMapper } = require('../mappers/pets');
const { findBy: findPetBy, updatePet, createPet } = require('../services/pets');
const { notFound, forbidden, invalidParams } = require('../errors/builders');
const { sequelizeInstance: sequelize } = require('../models');
const logger = require('../logger');
const { petSerializer } = require('../serializers/pets');
const { USER_TYPES } = require('../utils/constants');

exports.editPet = async (req, res, next) => {
  let transaction = {};
  try {
    transaction = await sequelize.transaction();
    if (req.params.id !== req.user.id) {
      return next(forbidden('The provided user cannot access to this resource'));
    }
    if (req.user.type !== USER_TYPES.OWNER) {
      return next(invalidParams('The provided user must be OWNER'));
    }
    const data = editPetMapper(req);
    const pet = await findPetBy({ where: { id: req.params.petId }, options: { transaction } });
    if (!pet) throw notFound('The provided pet is invalid');
    const petUpdated = await updatePet({ data, pet, options: { transaction } });
    await transaction.commit();
    return res.send(petSerializer(petUpdated));
  } catch (error) {
    logger.error(error);
    if (transaction) await transaction.rollback();
    return next(error);
  }
};

exports.createPet = async (req, res, next) => {
  let transaction = {};
  try {
    transaction = await sequelize.transaction();
    if (req.params.id !== req.user.id) {
      console.log(req.params.id);
      console.log(req.user.id);
      return next(forbidden('The provided user cannot access to this resource'));
    }
    if (req.user.type !== USER_TYPES.OWNER) {
      return next(invalidParams('The provided user must be OWNER'));
    }
    const data = editPetMapper(req);
    const pet = await createPet({ data, user: req.user, options: { transaction } });
    await transaction.commit();
    return res.send(petSerializer(pet));
  } catch (error) {
    logger.error(error);
    if (transaction) await transaction.rollback();
    return next(error);
  }
};
