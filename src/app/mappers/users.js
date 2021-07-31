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
