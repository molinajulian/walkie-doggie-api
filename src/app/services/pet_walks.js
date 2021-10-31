const Bluebird = require('bluebird');
const {
  Reservation,
  PetWalk,
  User,
  FirebaseToken,
  Pet,
  Address,
  PetWalkInstruction,
  sequelizeInstance: sequelize,
} = require('../models');
const logger = require('../logger');
const { databaseError, badRequest } = require('../errors/builders');
const { RESERVATION_STATUS, PET_WALK_STATUS, JOB_TYPE, PET_WALK_INSTRUCTION } = require('../utils/constants');
const { createAddress } = require('./addresses');
const { moment } = require('../utils/moment');
const Queue = require('bull');
const {
  redis,
  server: { reservationCheckerMinutes },
} = require('../../config');
const {
  sendOwnerBeganPetWalkNotification,
  sendWalkerBeganPetWalkNotification,
  sendPetWalkCancelledNotification,
} = require('./firebase_tokens');

exports.createPetWalk = async ({ params, options, user }) => {
  const reservations = await Reservation.findAll({
    include: [
      {
        model: User,
        as: 'reservationOwner',
        required: true,
        include: [{ model: FirebaseToken, as: 'firebaseTokens' }],
      },
      {
        model: Address,
        as: 'addressStart',
        required: true,
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
  // update reservation status
  await Bluebird.Promise.each(reservations, async (reservation, index) => {
    await reservation
      .update({ status: RESERVATION_STATUS.ACCEPTED_BY_WALKER, petWalkId: petWalk.id, position: index + 1 }, options)
      .catch(error => {
        logger.error('Error getting reservations, reason:', error);
        throw databaseError(error.message);
      });
  });
  await Reservation.update(
    { status: RESERVATION_STATUS.ACCEPTED_BY_WALKER, petWalkId: petWalk.id },
    { where: { id: params.reservationIds }, ...options },
  ).catch(error => {
    logger.error('Error getting reservations, reason:', error);
    throw databaseError(error.message);
  });
  const queue = await new Queue('work', redis.url);
  const petWalkCreatorDelayedTime = moment(petWalk.startDate).diff(moment(), 'seconds') * 1000;
  // queue the event to begin pet walk
  await queue.add(
    { event: JOB_TYPE.PET_WALK_CREATOR, petWalkId: petWalk.id, reservationIds: params.reservationIds },
    { delay: petWalkCreatorDelayedTime, removeOnComplete: true, removeOnFail: true },
  );
  const petWalkReservationCheckerDelayedTime =
    moment(petWalk.startDate)
      .subtract(reservationCheckerMinutes, 'minutes')
      .diff(moment(), 'seconds') * 1000;
  // queue the event to check some minutes before the walk to check reservations
  await queue.add(
    { event: JOB_TYPE.RESERVATION_CHECKER, reservationIds: params.reservationIds },
    { delay: petWalkReservationCheckerDelayedTime, removeOnComplete: true, removeOnFail: true },
  );
  return reservations;
};

exports.beginPetWalk = async ({ petWalkId, reservationIds }) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const petWalk = await PetWalk.findOne({
      where: { id: petWalkId },
      transaction,
      include: [
        { model: User, as: 'petWalker', required: true, include: [{ model: FirebaseToken, as: 'firebaseTokens' }] },
      ],
    });
    if (petWalk) {
      const owners = [];
      const reservations = await Reservation.findAll({
        where: { id: reservationIds, status: RESERVATION_STATUS.ACCEPTED_BY_OWNER },
        include: [
          {
            model: User,
            as: 'reservationOwner',
            required: true,
            include: [{ model: FirebaseToken, as: 'firebaseTokens' }],
          },
          { model: Pet, as: 'reservationPet', required: true },
          {
            model: Address,
            as: 'addressStart',
            required: true,
          },
          {
            model: Address,
            as: 'addressEnd',
            required: true,
          },
        ],
        transaction,
        order: [['position', 'asc']],
      });
      if (reservations.length) {
        const amountOfInstructions = reservations.length * 2;
        await Bluebird.Promise.each(reservations, async (reservation, index) => {
          owners.push(reservation.reservationOwner);
          const firstInstructionPosition = index + 1;
          const lastInstructionPosition = amountOfInstructions - index;
          await PetWalkInstruction.create(
            {
              instruction: PET_WALK_INSTRUCTION.PICK_UP,
              petWalkId,
              petId: reservation.reservationPet.id,
              addressLatitude: reservation.addressStart.latitude,
              addressLongitude: reservation.addressStart.longitude,
              addressDescription: reservation.addressStart.description,
              position: firstInstructionPosition,
            },
            { transaction },
          );
          await PetWalkInstruction.create(
            {
              instruction: PET_WALK_INSTRUCTION.LEAVE,
              petWalkId,
              petId: reservation.reservationPet.id,
              addressLatitude: reservation.addressEnd.latitude,
              addressLongitude: reservation.addressEnd.longitude,
              addressDescription: reservation.addressEnd.description,
              position: lastInstructionPosition,
            },
            { transaction },
          );
        });
        await petWalk.update({ status: PET_WALK_STATUS.IN_PROGRESS }, { transaction });
        await sendOwnerBeganPetWalkNotification({ petWalk, owners });
        await sendWalkerBeganPetWalkNotification({ petWalk });
      } else {
        await sendPetWalkCancelledNotification({ petWalk });
        await petWalk.update({ status: PET_WALK_STATUS.FINISHED }, { transaction });
      }
      await transaction.commit();
    }
  } catch (e) {
    logger.error(e);
    await transaction.rollback();
  }
};
