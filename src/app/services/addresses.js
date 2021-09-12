const { Address } = require('../models');
const logger = require('../logger');
const { databaseError } = require('../errors/builders');

exports.createAddress = async ({ data, options }) => {
  return Address.create(data, options).catch(error => {
    logger.error('Error creating an address, reason:', error);
    throw databaseError(error.message);
  });
};

exports.deleteAddressesOfUser = ({ user }, { transaction }) => {
  return user
    .update({ addressId: null }, { transaction })
    .catch(error => {
      logger.error('Error updating a user, reason:', error);
      throw databaseError(error.message);
    })
    .then(userUpdated =>
      Address.destroy({ where: { id: userUpdated.addressId }, transaction }).catch(error => {
        logger.error('Error deleting addresses, reason:', error);
        throw databaseError(error.message);
      }),
    );
};

exports.findOrCreateReservationAddresses = async ({ addressStart, addressEnd, options }) => {
  const [addressStartDb] = await Address.findOrCreate({
    where: {
      latitude: addressStart.latitude,
      longitude: addressStart.longitude,
      description: addressStart.description,
    },
    defaults: {
      latitude: addressStart.latitude,
      longitude: addressStart.longitude,
      description: addressStart.description,
    },
    ...options,
  });
  const [addressEndDb] = await Address.findOrCreate({
    where: {
      latitude: addressEnd.latitude,
      longitude: addressEnd.longitude,
      description: addressEnd.description,
    },
    defaults: {
      latitude: addressEnd.latitude,
      longitude: addressEnd.longitude,
      description: addressEnd.description,
    },
    ...options,
  });
  return { addressStart: addressStartDb, addressEnd: addressEndDb };
};
