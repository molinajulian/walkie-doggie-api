exports.reservationListMapper = req => ({
  reservationDate: req.query.date,
  reservationStatus: req.query.status,
  userId: req.params.id,
  loggedUser: req.user,
  petWalkId: req.query.pet_walk_id,
});

exports.changeStatusOfReservationOwnerMapper = req => ({
  reservationId: req.params.reservation_id,
  userId: req.user.id,
  status: req.body.status,
});

exports.changeStatusOfReservationWalkerMapper = req => ({
  reservationIds: req.body.reservation_ids,
  userId: req.user.id,
});

exports.getBestPathOfReservationsMapper = req => ({
  startLatitude: req.body.start_latitude,
  startLongitude: req.body.start_longitude,
  reservationIds: req.body.reservation_ids,
});
