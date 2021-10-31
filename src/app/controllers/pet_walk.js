const { createPetWalkMapper, getPetWalksMapper, getPetWalkMapper } = require('../mappers/pet_walks');
const { sequelizeInstance: sequelize } = require('../models');
const { forbidden } = require('../errors/builders');
const logger = require('../logger');
const { createPetWalk, getPetWalks, getPetWalk } = require('../services/pet_walks');
const { sendNewPetWalkNotification } = require('../services/firebase_tokens');
const { petWalkListSerializer, completePetWalkSerializer } = require('../serializers/pet_walks');

exports.createPetWalk = async (req, res, next) => {
  let transaction = {};
  try {
    transaction = await sequelize.transaction();
    const params = createPetWalkMapper(req);
    if (parseInt(params.walkerId) !== req.user.id) {
      return next(forbidden('The provided user cannot access to this resource'));
    }
    const reservations = await createPetWalk({ user: req.user, params, options: { transaction } });
    await sendNewPetWalkNotification({ user: req.user, reservations });
    await transaction.commit();
    return res.sendStatus(201);
  } catch (error) {
    logger.error(error);
    if (transaction) await transaction.rollback();
    return next(error);
  }
};

exports.getPetWalks = async (req, res, next) => {
  let transaction = {};
  try {
    transaction = await sequelize.transaction();
    const params = getPetWalksMapper(req);
    if (parseInt(params.userId) !== req.user.id) {
      return next(forbidden('The provided user cannot access to this resource'));
    }
    const petWalks = await getPetWalks({ user: req.user, params, options: { transaction } });
    await transaction.commit();
    return res.send(petWalkListSerializer(petWalks));
  } catch (error) {
    logger.error(error);
    if (transaction) await transaction.rollback();
    return next(error);
  }
};

exports.getPetWalk = async (req, res, next) => {
  let transaction = {};
  try {
    transaction = await sequelize.transaction();
    const params = getPetWalkMapper(req);
    if (parseInt(params.userId) !== req.user.id) {
      return next(forbidden('The provided user cannot access to this resource'));
    }
    const petWalk = await getPetWalk({ user: req.user, params, options: { transaction } });
    await transaction.commit();
    return res.send(completePetWalkSerializer(petWalk));
  } catch (error) {
    logger.error(error);
    if (transaction) await transaction.rollback();
    return next(error);
  }
};
