exports.petSerializer = pet => ({
  id: pet.id,
  name: pet.name,
  breed: pet.breed,
  birth_year: pet.birthYear,
  gender: pet.gender,
  weight: pet.weight,
  photo_uri: pet.photoUri,
  description: pet.description,
});
