const { moment } = require('../utils/moment');
const {
  petWalkStartDate,
  reservationIds,
  petWalkReservationId,
  addressStartDescription,
  addressStartLongitude,
  addressStartLatitude,
  queryReservationStatus,
  petWalkIdParam,
  queryPetWalkStatus,
  petWalkInstructionIdParam,
  reservationCode,
  descriptionReview,
  score,
} = require('../errors/schema_messages');
const { idParamSchema } = require('./users');
const { isString } = require('lodash');
const { RESERVATION_STATUS, PET_WALK_STATUS } = require('../utils/constants');

exports.createPetWalkSchema = {
  ...idParamSchema,
  start_date: {
    in: ['body'],
    custom: {
      options: value => moment(value).isValid(),
    },
    trim: true,
    errorMessage: petWalkStartDate,
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
    errorMessage: addressStartLatitude,
  },
  'address_start.longitude': {
    in: ['body'],
    isString: true,
    trim: true,
    errorMessage: addressStartLongitude,
  },
};

exports.getPetWalksSchema = {
  ...idParamSchema,
  status: {
    in: ['query'],
    custom: {
      options: value => value && isString(value) && Object.values(PET_WALK_STATUS).includes(value),
    },
    trim: true,
    errorMessage: queryPetWalkStatus,
    optional: true,
  },
};

exports.petWalkSchema = {
  ...idParamSchema,
  pet_walk_id: {
    in: ['params'],
    isNumeric: true,
    toInt: true,
    errorMessage: petWalkIdParam,
  },
};

exports.doPetWalkInstructionSchema = {
  pet_walk_id: {
    in: ['params'],
    isNumeric: true,
    toInt: true,
    errorMessage: petWalkIdParam,
  },
  pet_walk_instruction_id: {
    in: ['params'],
    isNumeric: true,
    toInt: true,
    errorMessage: petWalkInstructionIdParam,
  },
  code: {
    in: ['query'],
    isNumeric: true,
    toInt: true,
    errorMessage: reservationCode,
  },
};

exports.createReviewSchema = {
  score: {
    in: ['body'],
    isNumeric: true,
    toInt: true,
    errorMessage: score,
  },
  description: {
    in: ['body'],
    isString: true,
    trim: true,
    errorMessage: descriptionReview,
  },
};
