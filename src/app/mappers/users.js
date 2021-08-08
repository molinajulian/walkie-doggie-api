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
