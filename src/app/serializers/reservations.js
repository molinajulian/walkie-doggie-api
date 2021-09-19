const { moment } = require('../utils/moment');
exports.reservationsListSerializer = reservations => {
  return reservations.map(
    ({
      reservationPet,
      reservationRange,
      reservationWalker,
      reservationOwner,
      addressStart,
      addressEnd,
      status,
      observations,
      reservationDate,
      duration,
    }) => ({
      range: {
        id: reservationRange.id,
        day_of_week: reservationRange.dayOfWeek,
        start_at: reservationRange.startAt,
        end_at: reservationRange.endAt,
      },
      pet: {
        id: reservationPet.id,
        name: reservationPet.name,
        breed: reservationPet.breed,
        birth_year: reservationPet.birthYear,
        gender: reservationPet.gender,
        weight: reservationPet.weight,
        photo_uri: reservationPet.photoUri,
        description: reservationPet.description,
      },
      walker: {
        id: reservationWalker.id,
        first_name: reservationWalker.firstName,
        last_name: reservationWalker.lastName,
        email: reservationWalker.email,
        phone: reservationWalker.phone,
      },
      owner: {
        id: reservationOwner.id,
        first_name: reservationOwner.firstName,
        last_name: reservationOwner.lastName,
        email: reservationOwner.email,
        phone: reservationOwner.phone,
      },
      addressStart: {
        id: addressStart.id,
        latitude: addressStart.latitude,
        longitude: addressStart.longitude,
        description: addressStart.description,
      },
      addressEnd: {
        id: addressEnd.id,
        latitude: addressEnd.latitude,
        longitude: addressEnd.longitude,
        description: addressEnd.description,
      },
      status,
      observations,
      reservationDate: moment(reservationDate).format('YYYYMMDD'),
      duration,
    }),
  );
};