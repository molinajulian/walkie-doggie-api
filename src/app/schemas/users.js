const { authorization } = require('./utils');
const {
  firstName,
  lastName,
  password,
  email,
  userType,
  phone,
  pricePerHour,
  coverLetter,
  profilePhotoUri,
  descriptionAddress,
  longitudeAddress,
  latitudeAddress,
  ranges,
  dayOfWeek,
  startAt,
  endAt,
  pets,
  namePet,
  breedPet,
  birthYearPet,
  genderPet,
  weightPet,
  photoUriPet,
  descriptionPet,
  idParam,
} = require('../errors/schema_messages');
const { USER_TYPES, DAYS_OF_WEEK, PET_GENDERS } = require('../utils/constants');
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
exports.idParamSchema = {
  id: {
    in: ['params'],
    isInt: true,
    toInt: true,
    errorMessage: idParam,
  },
};
exports.getUserSchema = {
  ...authorization,
  ...exports.idParamSchema,
};

exports.onBoardingWalkerSchema = {
  ...exports.idParamSchema,
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
    optional: { options: { nullable: true } },
    errorMessage: coverLetter,
  },
  profile_photo_uri: {
    in: ['body'],
    isString: true,
    trim: true,
    errorMessage: profilePhotoUri,
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

exports.onBoardingOwnerSchema = {
  ...exports.idParamSchema,
  phone: {
    in: ['body'],
    isString: true,
    trim: true,
    isLength: { options: { min: 1 } },
    errorMessage: phone,
  },
  profile_photo_uri: {
    in: ['body'],
    isString: true,
    trim: true,
    errorMessage: profilePhotoUri,
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
  pets: {
    in: ['body'],
    isArray: true,
    isLength: { options: { min: 1 } },
    errorMessage: pets,
  },
  'pets.*.name': {
    isString: true,
    trim: true,
    errorMessage: namePet,
  },
  'pets.*.breed': {
    isString: true,
    trim: true,
    errorMessage: breedPet,
  },
  'pets.*.birth_year': {
    in: ['body'],
    isNumeric: true,
    errorMessage: birthYearPet,
  },
  'pets.*.gender': {
    trim: true,
    custom: {
      options: value => Object.values(PET_GENDERS).includes(value),
    },
    errorMessage: genderPet,
  },
  'pets.*.weight': {
    in: ['body'],
    isNumeric: true,
    errorMessage: weightPet,
  },
  'pets.*.photo_uri': {
    isString: true,
    trim: true,
    errorMessage: photoUriPet,
  },
  'pets.*.description': {
    isString: true,
    trim: true,
    errorMessage: descriptionPet,
  },
};
