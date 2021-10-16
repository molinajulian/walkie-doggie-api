const { createPetWalkMapper } = require('../mappers/pet_walks');
const { sequelizeInstance: sequelize } = require('../models');
const { forbidden } = require('../errors/builders');
const logger = require('../logger');
const { createPetWalk } = require('../services/pet_walks');
const { sendNewPetWalkNotification } = require('../services/firebase_tokens');

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
    return res.send();
  } catch (error) {
    logger.error(error);
    if (transaction) await transaction.rollback();
    return next(error);
  }
};
