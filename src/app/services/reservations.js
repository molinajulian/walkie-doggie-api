const logger = require('../logger');
const { Reservation, Pet, Range, Address, User } = require('../models');
const { databaseError, forbidden, badRequest } = require('../errors/builders');
const { RESERVATION_STATUS, USER_TYPES } = require('../utils/constants');
const { moment } = require('../utils/moment');
const { Op } = require('sequelize');

exports.createReservation = ({ reservationData, options }) => {
  logger.info('Attempting to create a reservation');
  return Reservation.create(
    {
      petId: reservationData.pet.id,
      walkerId: reservationData.walker.id,
      ownerId: reservationData.owner.id,
      startHour: reservationData.range.startAt,
      endHour: reservationData.range.endAt,
      addressStartId: reservationData.addressStart.id,
      addressEndId: reservationData.addressEnd.id,
      reservationDate: moment(reservationData.reservationDate, 'YYYYMMDD'),
      duration: reservationData.duration,
      observations: reservationData.comments,
      status: RESERVATION_STATUS.PENDING,
    },
    options,
  ).catch(error => {
    logger.error('Error creating multiple ranges, reason:', error);
    throw databaseError(error.message);
  });
};

exports.getReservationsOfUser = ({ userId, loggedUser, reservationDate, reservationStatus }) => {
  if (parseInt(userId) !== loggedUser.id) throw forbidden('The provided user cannot access to this resource');
  const where = loggedUser.type === USER_TYPES.WALKER ? { walkerId: loggedUser.id } : { ownerId: loggedUser.id };
  if (reservationDate) where.reservationDate = reservationDate;
  if (reservationStatus) where.status = reservationStatus;
  return Reservation.findAll({
    where,
    include: [
      { model: Pet, as: 'reservationPet', paranoid: false },
      { model: User, as: 'reservationWalker' },
      { model: User, as: 'reservationOwner' },
      { model: Address, as: 'addressStart', paranoid: false },
      { model: Address, as: 'addressEnd', paranoid: false },
    ],
    order: [['reservationDate', 'asc']],
  }).catch(error => {
    logger.error('Error getting reservations, reason:', error);
    throw databaseError(error.message);
  });
};

exports.getOwnerReservation = ({ reservationId, loggedUser, userId, options }) => {
  if (parseInt(userId) !== loggedUser.id) throw forbidden('The provided user cannot access to this resource');
  return Reservation.findOne({
    where: { ownerId: loggedUser.id, id: reservationId, status: RESERVATION_STATUS.ACCEPTED_BY_WALKER },
    include: [
      { model: Pet, as: 'reservationPet', paranoid: false },
      { model: User, as: 'reservationWalker' },
      { model: User, as: 'reservationOwner' },
      { model: Address, as: 'addressStart', paranoid: false },
      { model: Address, as: 'addressEnd', paranoid: false },
    ],
    ...options,
  }).catch(error => {
    logger.error('Error getting reservations, reason:', error);
    throw databaseError(error.message);
  });
};

exports.updateReservationStatus = ({ reservation, status, options }) =>
  reservation.update({ status }, options).catch(error => {
    logger.error('Error updating a reservation, reason:', error);
    throw databaseError(error.message);
  });

exports.updateReservationStatusByWalker = async ({ reservationIds, userId, options, loggedUser }) => {
  if (parseInt(userId) !== loggedUser.id) throw forbidden('The provided user cannot access to this resource');
  const amountOfReservations = await Reservation.count({
    where: {
      id: reservationIds,
      walkerId: loggedUser.id,
      status: RESERVATION_STATUS.PENDING,
    },
    ...options,
  }).catch(error => {
    logger.error('Error counting the reservations, reason:', error);
    throw databaseError(error.message);
  });
  if (parseInt(amountOfReservations) !== parseInt(reservationIds.length)) {
    throw badRequest('The provided reservation ids are invalid');
  }
  await Reservation.update(
    { status: RESERVATION_STATUS.REJECTED_BY_WALKER },
    { where: { id: reservationIds }, ...options },
  ).catch(error => {
    logger.error('Error updating a reservation, reason:', error);
    throw databaseError(error.message);
  });
};

exports.cancelPendingReservationsOfPetWalk = async ({ reservationIds }) => {
  await Reservation.update(
    { status: RESERVATION_STATUS.REJECTED_BY_SYSTEM },
    {
      where: { id: reservationIds, status: RESERVATION_STATUS.ACCEPTED_BY_WALKER },
    },
  ).catch(error => {
    logger.error('Error updating a reservation, reason:', error);
    throw databaseError(error.message);
  });
};

exports.getReservationsBy = conditions => {
  return Reservation.findAll({
    where: conditions,
    include: [{ model: Address, as: 'addressStart', required: true }],
  }).catch(error => {
    logger.error('Error getting reservations, reason:', error);
    throw databaseError(error.message);
  });
};
