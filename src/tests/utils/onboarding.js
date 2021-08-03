exports.createFakeOwnerOnboardingParams = () => {
  return {
    address: {
      description: 'Brandsen 3000',
      latitude: '35.141147',
      longitude: '-34.874682',
    },
    phone: '12345678',
    profile_photo_uri: 'profilephotototo',
    pets: [
      {
        name: 'Brandsen 1000',
        breed: 'asd',
        birth_year: 1997,
        gender: 'HEMBRA',
        weight: 70,
        photo_uri: '-34.874682',
        description: '-34.874682',
      },
      {
        name: 'ewqeq',
        breed: 'asd',
        birth_year: 1996,
        gender: 'MACHO',
        weight: 70,
        photo_uri: '-34.874682',
        description: '-34.874682',
      },
    ],
  };
};

exports.createFakeWalkerOnboardingParams = () => {
  return {
    price_per_hour: 300,
    cover_letter: 'Esto es una carta de presentación',
    phone: '1136593956',
    address: {
      description: 'Yatay 240, C1414, 1A',
      latitude: '-34.55555555',
      longitude: '-58.55555555',
    },
    ranges: [
      {
        day_of_week: 'LUNES',
        start_at: '11:00',
        end_at: '14:00',
      },
      {
        day_of_week: 'MARTES',
        start_at: '09:00',
        end_at: '12:00',
      },
      {
        day_of_week: 'MIERCOLES',
        start_at: '13:00',
        end_at: '16:00',
      },
      {
        day_of_week: 'JUEVES',
        start_at: '17:00',
        end_at: '20:00',
      },
      {
        day_of_week: 'VIERNES',
        start_at: '10:00',
        end_at: '14:30',
      },
    ],
    profile_photo_uri: 'www.esto.es.prueba.com',
  };
};
