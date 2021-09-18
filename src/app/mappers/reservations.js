exports.reservationListMapper = req => ({
  reservationDate: req.query.date,
  reservationStatus: req.query.status,
  userId: req.params.id,
  loggedUser: req.user,
});
