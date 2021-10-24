exports.reservationListMapper = req => ({
  reservationDate: req.query.date,
  reservationStatus: req.query.status,
  userId: req.params.id,
  loggedUser: req.user,
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
