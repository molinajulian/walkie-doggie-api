const { moment } = require('../utils/moment');
const {
  walkDate,
  rangeId,
  duration,
  petId,
  addressEndDescription,
  addressEndLatitude,
  addressEndLongitude,
  queryReservationDate,
  queryReservationStatus,
  addressStartDescription,
  addressStartLongitude,
  bodyReservationStatus,
  idParam,
  reservationIdParam,
  reservationIds,
  petWalkReservationId,
  bodyOwnerReservationStatus,
  latitudeAddress,
  longitudeAddress,
  latitude,
  longitude,
  petWalkIdQuery,
} = require('../errors/schema_messages');
const { isString } = require('lodash');
const { RESERVATION_STATUS } = require('../utils/constants');
const { idParamSchema } = require('./users');

exports.createReservationSchema = {
  walk_date: {
    in: ['body'],
    custom: {
      options: value => moment(value, 'YYYYMMDD', true).isValid(),
    },
    trim: true,
    errorMessage: walkDate,
  },
  range_id: {
    in: ['body'],
    isNumeric: true,
    trim: true,
    errorMessage: rangeId,
  },
  duration: {
    in: ['body'],
    isNumeric: true,
    trim: true,
    errorMessage: duration,
  },
  pet_id: {
    in: ['body'],
    isNumeric: true,
    trim: true,
    errorMessage: petId,
  },
  'address_start.description': {
    in: ['body'],
    isString: true,
    trim: true,
    errorMessage: addressStartDescription,
  },
  'address_start.latitude': {
    in: ['body'],
    isString: true,
    trim: true,
    errorMessage: addressStartLongitude,
  },
  'address_start.longitude': {
    in: ['body'],
    isString: true,
    trim: true,
    errorMessage: addressStartLongitude,
  },
  'address_end.description': {
    in: ['body'],
    isString: true,
    trim: true,
    errorMessage: addressEndDescription,
  },
  'address_end.latitude': {
    in: ['body'],
    isString: true,
    trim: true,
    errorMessage: addressEndLatitude,
  },
  'address_end.longitude': {
    in: ['body'],
    isString: true,
    trim: true,
    errorMessage: addressEndLongitude,
  },
  comments: {
    in: ['body'],
    isString: true,
    optional: true,
    isLength: { options: { min: 0, max: 255 } },
  },
};

exports.getReservationsSchema = {
  date: {
    in: ['query'],
    custom: {
      options: value => moment(value, 'YYYYMMDD', true).isValid(),
    },
    trim: true,
    errorMessage: queryReservationDate,
    optional: true,
  },
  status: {
    in: ['query'],
    custom: {
      options: value => value && isString(value) && Object.values(RESERVATION_STATUS).includes(value),
    },
    trim: true,
    errorMessage: queryReservationStatus,
    optional: true,
  },
  pet_walk_id: {
    in: ['query'],
    isNumeric: true,
    toNumeric: true,
    trim: true,
    errorMessage: petWalkIdQuery,
    optional: true,
  },
};

exports.changeStatusOfReservationByOwnerSchema = {
  ...idParamSchema,
  reservation_id: {
    in: ['params'],
    isNumeric: true,
    toInt: true,
    errorMessage: reservationIdParam,
  },
  status: {
    in: ['body'],
    custom: {
      options: value =>
        value &&
        value.length &&
        [RESERVATION_STATUS.ACCEPTED_BY_OWNER, RESERVATION_STATUS.REJECTED_BY_OWNER].includes(value.toUpperCase()),
    },
    trim: true,
    errorMessage: bodyOwnerReservationStatus,
  },
};

exports.changeStatusOfReservationByWalkerSchema = {
  ...idParamSchema,
  reservation_ids: {
    in: ['body'],
    IsArray: true,
    errorMessage: reservationIds,
  },
  'reservation_ids.*': {
    in: ['body'],
    isNumeric: true,
    toInt: true,
    errorMessage: petWalkReservationId,
  },
};

exports.bestPathOfReservationsSchema = {
  start_latitude: {
    in: ['body'],
    isString: true,
    trim: true,
    errorMessage: latitude,
  },
  start_longitude: {
    in: ['body'],
    isString: true,
    trim: true,
    errorMessage: longitude,
  },
  reservation_ids: {
    in: ['body'],
    IsArray: true,
    errorMessage: reservationIds,
  },
  'reservation_ids.*': {
    in: ['body'],
    isNumeric: true,
    toInt: true,
    errorMessage: petWalkReservationId,
  },
};
