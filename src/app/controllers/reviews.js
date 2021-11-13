const { sequelizeInstance: sequelize } = require('../models');
const logger = require('../logger');
const { createReviewMapper } = require('../mappers/reviews');
const { getPetWalkOfOwner } = require('../services/pet_walks');
const { createReview } = require('../services/reviews');

exports.createReview = async (req, res, next) => {
  let transaction = {};
  try {
    transaction = await sequelize.transaction();
    const options = { transaction };
    const params = createReviewMapper(req);
    const user = req.user;
    const petWalk = await getPetWalkOfOwner({ options, params, user });
    await createReview({ petWalk, options, params, user });
    await transaction.commit();
    return res.sendStatus(201);
  } catch (error) {
    logger.error(error);
    if (transaction) await transaction.rollback();
    return next(error);
  }
};
