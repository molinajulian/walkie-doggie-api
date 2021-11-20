const { sequelizeInstance: sequelize } = require('../models');
const logger = require('../logger');
const { createReviewMapper, getReviewsMapper } = require('../mappers/reviews');
const { getPetWalkOfOwner } = require('../services/pet_walks');
const { createReview, getReviews } = require('../services/reviews');
const { findByPk } = require('../services/users');
const { invalidUserType } = require('../errors/builders');
const { USER_TYPES } = require('../utils/constants');
const { reviewsOfWalker } = require('../serializers/users');

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

exports.getReviews = async (req, res, next) => {
  try {
    const params = getReviewsMapper(req);
    const walker = await findByPk(params.walkerId);
    if (walker.type !== USER_TYPES.WALKER)
      throw invalidUserType('The provided user must be walker and the logged user must be owner');
    const reviews = await getReviews({ walker });
    return res.send(reviewsOfWalker({ reviews, walker }));
  } catch (error) {
    logger.error(error);
    return next(error);
  }
};
