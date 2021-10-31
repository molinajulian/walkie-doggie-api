const { moment } = require('../utils/moment');

exports.reservationsListSerializer = reservations => {
  return reservations.map(
    ({
      reservationPet,
      startHour,
      endHour,
      reservationWalker,
      reservationOwner,
      addressStart,
      addressEnd,
      status,
      observations,
      reservationDate,
      duration,
      id,
      reservationPetWalk,
    }) => ({
      id,
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
      address_start: {
        id: addressStart.id,
        latitude: addressStart.latitude,
        longitude: addressStart.longitude,
        description: addressStart.description,
      },
      address_end: {
        id: addressEnd.id,
        latitude: addressEnd.latitude,
        longitude: addressEnd.longitude,
        description: addressEnd.description,
      },
      status,
      observations,
      reservation_date: moment(reservationDate).format('YYYYMMDD'),
      duration,
      start_at: startHour,
      end_at: endHour,
      pet_walk: reservationPetWalk
        ? {
            address_start: {
              id: reservationPetWalk.addressStart.id,
              latitude: reservationPetWalk.addressStart.latitude,
              longitude: reservationPetWalk.addressStart.longitude,
              description: reservationPetWalk.addressStart.description,
            },
            walker: {
              id: reservationPetWalk.petWalker.id,
              first_name: reservationPetWalk.petWalker.firstName,
              last_name: reservationPetWalk.petWalker.lastName,
              email: reservationPetWalk.petWalker.email,
              phone: reservationPetWalk.petWalker.phone,
            },
            status: reservationPetWalk.status,
            start_date: reservationPetWalk.startDate,
          }
        : {},
    }),
  );
};
