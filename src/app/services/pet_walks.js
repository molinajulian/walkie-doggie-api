const { Reservation, PetWalk, User, FirebaseToken } = require('../models');
const logger = require('../logger');
const { databaseError, badRequest } = require('../errors/builders');
const { RESERVATION_STATUS, PET_WALK_STATUS, JOB_TYPE } = require('../utils/constants');
const { createAddress } = require('./addresses');
const { moment } = require('../utils/moment');
const Queue = require('bull');
const { redis } = require('../../config');

exports.createPetWalk = async ({ params, options, user }) => {
  const reservations = await Reservation.findAll({
    include: [
      {
        model: User,
        as: 'reservationOwner',
        required: true,
        include: [{ model: FirebaseToken, as: 'firebaseTokens' }],
      },
    ],
    where: { id: params.reservationIds },
    ...options,
  }).catch(error => {
    logger.error('Error getting reservations, reason:', error);
    throw databaseError(error.message);
  });
  if (reservations.length !== params.reservationIds.length) {
    throw badRequest('The provided reservations are invalid');
  }
  // update reservation status
  await Reservation.update(
    { status: RESERVATION_STATUS.ACCEPTED_BY_WALKER },
    { where: { id: params.reservationIds }, ...options },
  ).catch(error => {
    logger.error('Error getting reservations, reason:', error);
    throw databaseError(error.message);
  });
  // create address of pet walk
  const petWalkAddress = await createAddress({ data: params.addressStart, options });
  // create pet walk
  const petWalk = await PetWalk.create(
    {
      addressStartId: petWalkAddress.id,
      walkerId: user.id,
      startDate: moment(params.startDate).format(),
      status: PET_WALK_STATUS.PENDING,
    },
    options,
  ).catch(error => {
    logger.error('Error getting reservations, reason:', error);
    throw databaseError(error.message);
  });
  const queue = await new Queue('work', redis.url);
  const petWalkCreatorDelayedTime = moment(petWalk.startDate).diff(moment(), 'seconds') * 1000;
  // queue the event to begin pet walk
  await queue.add(
    { event: JOB_TYPE.PET_WALK_CREATOR, petWalkId: petWalk.id },
    { delay: petWalkCreatorDelayedTime, removeOnComplete: true, removeOnFail: true },
  );
  const petWalkReservationCheckerDelayedTime =
    moment(petWalk.startDate)
      .subtract(30, 'minutes')
      .diff(moment(), 'seconds') * 1000;
  // queue the event to 30 minutes before the walk to check reservations
  await queue.add(
    { event: JOB_TYPE.RESERVATION_CHECKER, petWalkId: petWalk.id, reservationIds: params.reservationIds },
    { delay: petWalkReservationCheckerDelayedTime, removeOnComplete: true, removeOnFail: true },
  );
  return reservations;
};
