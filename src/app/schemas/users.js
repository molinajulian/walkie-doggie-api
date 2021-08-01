const {
  firstName,
  lastName,
  password,
  email,
  userType,
  phone,
  pricePerHour,
  coverLetter,
  descriptionAddress,
  longitudeAddress,
  latitudeAddress,
  ranges,
  dayOfWeek,
  startAt,
  endAt,
} = require('../errors/schema_messages');
const { USER_TYPES, DAYS_OF_WEEK } = require('../utils/constants');
const { REGEX_HOUR } = require('../utils/regex');

exports.createUserSchema = {
  first_name: {
    in: ['body'],
    isString: true,
    trim: true,
    isLength: { options: { min: 1 } },
    errorMessage: firstName,
  },
  email: {
    in: ['body'],
    isString: true,
    trim: true,
    isEmail: true,
    isLength: { options: { min: 1 } },
    errorMessage: email,
  },
  password: {
    in: ['body'],
    isString: true,
    errorMessage: password,
    isLength: { options: { min: 1 } },
  },
  last_name: {
    in: ['body'],
    isString: true,
    trim: true,
    errorMessage: lastName,
    isLength: { options: { min: 1 } },
  },
  type: {
    in: ['body'],
    trim: true,
    custom: {
      options: value => Object.values(USER_TYPES).includes(value),
    },
    errorMessage: userType,
  },
};

exports.onBoardingWalkerSchema = {
  phone: {
    in: ['body'],
    isString: true,
    trim: true,
    isLength: { options: { min: 1 } },
    errorMessage: phone,
  },
  price_per_hour: {
    in: ['body'],
    isNumeric: true,
    errorMessage: pricePerHour,
  },
  cover_letter: {
    in: ['body'],
    isString: true,
    trim: true,
    errorMessage: coverLetter,
  },
  'address.description': {
    isString: true,
    trim: true,
    errorMessage: descriptionAddress,
  },
  'address.latitude': {
    isString: true,
    trim: true,
    errorMessage: latitudeAddress,
  },
  'address.longitude': {
    isString: true,
    trim: true,
    errorMessage: longitudeAddress,
  },
  ranges: {
    in: ['body'],
    isArray: true,
    isLength: { options: { min: 1 } },
    errorMessage: ranges,
  },
  'ranges.*.day_of_week': {
    trim: true,
    custom: {
      options: value => Object.values(DAYS_OF_WEEK).includes(value),
    },
    errorMessage: dayOfWeek,
  },
  'ranges.*.start_at': {
    trim: true,
    matches: {
      options: REGEX_HOUR,
      errorMessage: startAt,
    },
  },
  'ranges.*.end_at': {
    trim: true,
    matches: {
      options: REGEX_HOUR,
      errorMessage: endAt,
    },
  },
};
