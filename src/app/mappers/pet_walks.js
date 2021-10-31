exports.createPetWalkMapper = req => ({
  walkerId: req.params.id,
  startDate: req.body.start_date,
  reservationIds: req.body.reservation_ids,
  addressStart: {
    latitude: req.body.address_start.latitude,
    longitude: req.body.address_start.longitude,
    description: req.body.address_start.description,
  },
});

exports.getPetWalksMapper = req => ({
  userId: req.params.id,
  status: req.query.status,
});

exports.getPetWalkMapper = req => ({
  userId: req.params.id,
  petWalkId: req.params.pet_walk_id,
});
