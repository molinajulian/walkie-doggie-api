const { moment } = require('../utils/moment');
const {
  petWalkStartDate,
  reservationIds,
  petWalkReservationId,
  addressStartDescription,
  addressStartLongitude,
  addressStartLatitude,
} = require('../errors/schema_messages');
const { idParamSchema } = require('./users');

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
