const { moment } = require('../utils/moment');
exports.createUserMapper = ({ body }) => ({
  type: body.type,
  firstName: body.first_name,
  lastName: body.last_name,
  email: body.email.toLowerCase(),
  password: body.password,
});

exports.onBoardingWalkerMapper = ({ body }) => ({
  phone: body.phone,
  pricePerHour: body.price_per_hour,
  profilePhotoUri: body.profile_photo_uri,
  ranges: body.ranges.map(range => {
    return {
      id: range.id,
      dayOfWeek: range.day_of_week,
      startAt: range.start_at,
      endAt: range.end_at,
    };
  }),
  address: body.address,
  coverLetter: body.cover_letter,
});

exports.onBoardingOwnerMapper = ({ body }) => ({
  address: body.address,
  phone: body.phone,
  profilePhotoUri: body.profile_photo_uri,
  pets: body.pets.map(pet => {
    return {
      name: pet.name,
      breed: pet.breed,
      birthYear: pet.birth_year,
      gender: pet.gender,
      weight: pet.weight,
      photoUri: pet.photo_uri,
      description: pet.description,
    };
  }),
});

exports.editOwnerMapper = exports.onBoardingOwnerMapper;

exports.editWalkerMapper = req => ({
  ...exports.onBoardingWalkerMapper(req),
  certifications: req.body.certifications.map(certification => ({
    description: certification.description,
    fileUri: certification.file_uri,
  })),
});

exports.createReservationMapper = ({ body, params }) => ({
  walkerId: params.id,
  walkDate: body.walk_date,
  rangeId: body.range_id,
  duration: body.duration,
  petId: body.pet_id,
  addressStart: {
    description: body.address_start.description,
    latitude: body.address_start.latitude,
    longitude: body.address_start.longitude,
  },
  addressEnd: {
    description: body.address_end.description,
    latitude: body.address_end.latitude,
    longitude: body.address_end.longitude,
  },
  comments: body.comments,
  reservationDate: body.walk_date,
});
