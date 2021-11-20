const { Review, PetWalk, User } = require('../models');
const logger = require('../logger');
const { databaseError } = require('../errors/builders');
const { RESERVATION_STATUS } = require('../utils/constants');

exports.createReview = async ({ petWalk, options, params, user }) => {
  await Review.create(
    {
      score: params.score,
      description: params.description,
      petWalkId: petWalk.id,
      ownerId: user.id,
    },
    options,
  ).catch(error => {
    logger.error('Error creating the review, reason:', error);
    throw databaseError(error.message);
  });
  await petWalk.petWalkReservations[0].update({ status: RESERVATION_STATUS.REVIEWED }, options).catch(error => {
    logger.error('Error updating the reservation, reason:', error);
    throw databaseError(error.message);
  });
  await petWalk.petWalker
    .update(
      { score: petWalk.petWalker.score + params.score, reviewsAmount: petWalk.petWalker.reviewsAmount + 1 },
      options,
    )
    .catch(error => {
      logger.error('Error updating the walker score, reason:', error);
      throw databaseError(error.message);
    });
};

exports.getReviews = ({ walker }) => {
  return Review.findAll({
    include: [
      { model: PetWalk, as: 'petWalk', where: { walkerId: walker.id }, required: true },
      { model: User, as: 'reviewer', required: true },
    ],
  }).catch(error => {
    logger.error('Error getting the reviews, reason:', error);
    throw databaseError(error.message);
  });
};
