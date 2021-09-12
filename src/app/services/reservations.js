const logger = require('../logger');
const { Reservation } = require('../models');
const { databaseError } = require('../errors/builders');
const { RESERVATION_STATUS } = require('../utils/constants');
const { moment } = require('../utils/moment');

exports.createReservation = ({ reservationData, options }) => {
  logger.info('Attempting to create a reservation');
  console.log(reservationData.duration);
  return Reservation.create(
    {
      petId: reservationData.pet.id,
      walkerId: reservationData.walker.id,
      rangeId: reservationData.range.id,
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
