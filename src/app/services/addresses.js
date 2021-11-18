const { Address, Reservation } = require('../models');
const logger = require('../logger');
const { databaseError } = require('../errors/builders');

exports.createAddress = async ({ data, options }) => {
  return Address.create(data, options).catch(error => {
    logger.error('Error creating an address, reason: ', error);
    throw databaseError(error.message);
  });
};

exports.deleteAddressesOfUser = async ({ user }, { transaction }) => {
  return user
    .update({ addressId: null }, { transaction })
    .catch(error => {
      logger.error('Error updating a user, reason:', error);
      throw databaseError(error.message);
    })
    .then(() =>
      Address.destroy({ where: { id: user.addressId }, transaction }).catch(error => {
        logger.error('Error deleting addresses, reason:', error);
        throw databaseError(error.message);
      }),
    );
};

exports.editAddress = exports.findOrCreateReservationAddresses = async ({ addressStart, addressEnd, options }) => {
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

exports.editAddressOfUser = ({ data, options, loggedUser }) => {
  loggedUser.address.description = data.description;
  loggedUser.address.latitude = data.latitude;
  loggedUser.address.longitude = data.longitude;
  return loggedUser.address
    .save(options)
    .catch(error => {
      logger.error('Error editing an addresses, reason:', error);
      throw databaseError(error.message);
    })
    .then(() => loggedUser.address);
};
