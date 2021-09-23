exports.editPetMapper = req => ({
  name: req.body.name,
  breed: req.body.breed,
  birthYear: req.body.birth_year,
  gender: req.body.gender,
  weight: req.body.weight,
  photoUri: req.body.photo_uri,
  description: req.body.description,
});
