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
      pet_walks_amount: user.petWalksAmount,
      score: user.reviewsAmount > 0 ? Math.round((user.score / user.reviewsAmount) * 10) / 10 : null,
      allows_tracking: user.allowsTracking,
      reviewsAmount: user.reviewsAmount,
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
    score: user.reviewsAmount > 0 ? Math.round((user.score / user.reviewsAmount) * 10) / 10 : null,
    type: user.type,
    pet_walks_amount: user.petWalksAmount,
    phone: user.phone,
    profile_photo_uri: user.profilePhotoUri,
    reviews_amount: user.reviewsAmount,
  })),
});

exports.reviewsOfWalker = ({ reviews, walker }) => ({
  reviews_amount: walker.reviewsAmount,
  score: walker.reviewsAmount > 0 ? Math.round((walker.score / walker.reviewsAmount) * 10) / 10 : null,
  reviews: reviews.map(review => ({
    id: review.id,
    score: review.score,
    description: review.description,
    reviewer: exports.createUserSerializer(review.reviewer),
    created_at: review.createdAt,
    updated_at: review.updatedAt,
  })),
});
