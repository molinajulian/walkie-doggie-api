const { USER_TYPES } = require('../utils/constants');
exports.createUserSerializer = user => ({
  id: user.id,
  first_name: user.firstName,
  last_name: user.lastName,
  email: user.email,
  type: user.type,
  phone: user.phone,
  last_login: user.lastLogin,
});

exports.getUserSerializer = user => {
  const type = user.type;
  const userData = this.createUserSerializer(user);
  const baseData = {
    ...userData,
    phone: user.phone,
    profile_photo_uri: user.profilePhotoUri,
    address: {
      id: user.address.id,
      latitude: user.address.latitude,
      longitude: user.address.longitude,
      description: user.address.description,
    },
  };
  if (type === USER_TYPES.WALKER) {
    const certifications = user.certifications.map(certification => ({
      id: certification.id,
      description: certification.description,
      file_uri: certification.fileUri,
    }));
    const achievements = user.achievements.map(achievement => ({
      id: achievement.id,
      description: achievement.description,
    }));
    const ranges = user.ranges.map(range => ({
      id: range.id,
      day_of_week: range.dayOfWeek,
      start_at: range.startAt,
      end_at: range.endAt,
    }));
    return {
      ...baseData,
      certifications,
      achievements,
      ranges,
      price_per_hour: user.pricePerHour,
      cover_letter: user.coverLetter,
    };
  }
  const pets = user.pets.map(pet => ({
    id: pet.id,
    name: pet.name,
    breed: pet.breed,
    birth_year: pet.birthYear,
    gender: pet.gender,
    weight: pet.weight,
    photo_uri: pet.photoUri,
    description: pet.description,
  }));
  return { ...baseData, pets };
};

exports.listWalkerSerializer = ({ count, rows }) => ({
  count,
  walkers: rows.map(user => ({
    id: user.id,
    first_name: user.firstName,
    last_name: user.lastName,
    email: user.email,
    score: user.score,
    type: user.type,
    pet_walks_amount: user.petWalksAmount,
  })),
});
