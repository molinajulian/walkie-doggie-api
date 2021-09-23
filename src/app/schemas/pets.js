const {
  namePet,
  breedPet,
  birthYearPet,
  genderPet,
  weightPet,
  photoUriPet,
  descriptionPet,
  idParam,
  petIdParam,
} = require('../errors/schema_messages');
const { PET_GENDERS } = require('../utils/constants');

exports.editPetSchema = {
  ...exports.createPetSchema,
  petId: {
    in: ['params'],
    isNumeric: true,
    toInt: true,
    errorMessage: petIdParam,
  },
};

exports.createPetSchema = {
  id: {
    in: ['params'],
    isNumeric: true,
    toInt: true,
    errorMessage: idParam,
  },
  name: {
    isString: true,
    trim: true,
    errorMessage: namePet,
  },
  breed: {
    isString: true,
    trim: true,
    errorMessage: breedPet,
  },
  birth_year: {
    in: ['body'],
    isNumeric: true,
    errorMessage: birthYearPet,
  },
  gender: {
    trim: true,
    custom: {
      options: value => Object.values(PET_GENDERS).includes(value),
    },
    errorMessage: genderPet,
  },
  weight: {
    in: ['body'],
    isNumeric: true,
    errorMessage: weightPet,
  },
  photo_uri: {
    isString: true,
    trim: true,
    errorMessage: photoUriPet,
  },
  description: {
    isString: true,
    trim: true,
    errorMessage: descriptionPet,
  },
};
