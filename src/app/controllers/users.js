const { createUserSerializer, listWalkerSerializer } = require('../serializers/users');
const { createUser, updateUser, getUserBy, listWalkers } = require('../services/users');
const {
  createUserMapper,
  onBoardingWalkerMapper,
  onBoardingOwnerMapper,
  editOwnerMapper,
  editWalkerMapper,
  createReservationMapper,
  listWalkerMapper,
} = require('../mappers/users');
const {
  createAddress,
  deleteAddressesOfUser,
  findOrCreateReservationAddresses,
  editAddressOfUser,
} = require('../services/addresses');
const { bulkCreateRanges, deleteRangesOfUser, findBy: findRangeBy } = require('../services/ranges');
const { bulkCreatePets, deletePetsOfUser, findBy: findPetBy } = require('../services/pets');
const { sequelizeInstance: sequelize } = require('../models');
const logger = require('../logger');
const { getUserSerializer } = require('../serializers/users');
const { forbidden, notFound, invalidUserType } = require('../errors/builders');
const { deleteCertificationOfUser, bulkCreateCertifications } = require('../services/certifications');
const {
  createFirebaseToken,
  deleteFirebaseToken,
  sendReservationCreatedNotification,
} = require('../services/firebase_tokens');
const { USER_TYPES } = require('../utils/constants');
const { createReservation, getReservationsOfUser } = require('../services/reservations');
const { reservationsListSerializer } = require('../serializers/reservations');
const { reservationListMapper } = require('../mappers/reservations');

exports.createUser = (req, res, next) =>
  createUser(createUserMapper(req))
    .then(user => res.status(201).json(createUserSerializer(user)))
    .catch(next);

exports.onBoardingWalker = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const user = await getUserBy({ id });
    const { address: addressData, ranges, ...restData } = onBoardingWalkerMapper(req);
    const address = await createAddress({ data: { ...addressData }, options: { transaction } });
    const updatedUser = await updateUser({
      user,
      data: { addressId: address.get('id'), wasOnboarded: true, ...restData },
      options: { transaction },
    });
    await bulkCreateRanges({ ranges, walkerId: updatedUser.id, options: { transaction } });
    transaction.commit();
    res.status(200).json({ message: 'User onboarded successfully' });
  } catch (error) {
    logger.error(error);
    await transaction.rollback();
    return next(error);
  }
};

exports.onBoardingOwner = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const user = await getUserBy({ id });
    const { address: addressData, pets, ...restData } = onBoardingOwnerMapper(req);
    const address = await createAddress({ data: { ...addressData }, options: { transaction } });

    const updatedUser = await updateUser({
      user,
      data: { addressId: address.get('id'), wasOnboarded: true, ...restData },
      options: { transaction },
    });

    await bulkCreatePets({ pets, ownerId: updatedUser.id, options: { transaction } });

    await transaction.commit();
    return res.status(200).json({ message: 'User onboarded successfully' });
  } catch (error) {
    logger.error(error);
    await transaction.rollback();
    return next(error);
  }
};

exports.get = (req, res, next) =>
  getUserBy({ id: req.params.id, wasOnboarded: true })
    .then(user => res.status(200).json(getUserSerializer(user)))
    .catch(next);

exports.editOwner = async (req, res, next) => {
  let transaction = {};
  try {
    transaction = await sequelize.transaction();
    if (req.params.id !== req.user.id) {
      return next(forbidden('The provided user cannot access to this resource'));
    }
    const editOwnerData = editOwnerMapper(req);
    const address = await editAddressOfUser({
      data: { ...editOwnerData.address },
      options: { transaction },
      loggedUser: req.user,
    });
    const updatedUser = await updateUser({
      user: req.user,
      data: { addressId: address.get('id'), ...editOwnerData },
      options: { transaction },
    });
    updatedUser.address = address;
    updatedUser.pets = req.user.pets;
    await transaction.commit();
    return res.send(getUserSerializer(updatedUser));
  } catch (error) {
    logger.error(error);
    if (transaction) await transaction.rollback();
    return next(error);
  }
};

exports.editWalker = async (req, res, next) => {
  let transaction = {};
  try {
    transaction = await sequelize.transaction();
    if (req.params.id !== req.user.id) {
      return next(forbidden('The provided user cannot access to this resource'));
    }
    const editWalkerData = editWalkerMapper(req);
    await deleteCertificationOfUser({ user: req.user }, { transaction });
    await deleteRangesOfUser({ user: req.user }, { transaction });
    const address = await editAddressOfUser({
      data: { ...editWalkerData.address },
      options: { transaction },
      loggedUser: req.user,
    });
    const updatedUser = await updateUser({
      user: req.user,
      data: { addressId: address.get('id'), ...editWalkerData },
      options: { transaction },
    });
    const ranges = await bulkCreateRanges({
      ranges: editWalkerData.ranges,
      walkerId: updatedUser.id,
      options: { transaction },
    });
    if (editWalkerData.certifications && editWalkerData.certifications.length) {
      const certifications = await bulkCreateCertifications(
        { user: req.user, certifications: editWalkerData.certifications },
        { transaction },
      );
      updatedUser.certifications = certifications;
    }
    updatedUser.address = address;
    updatedUser.ranges = ranges;
    await transaction.commit();
    return res.send(getUserSerializer(updatedUser));
  } catch (error) {
    logger.error(error);
    if (transaction) await transaction.rollback();
    return next(error);
  }
};

exports.createFirebaseToken = (req, res, next) =>
  getUserBy({ id: req.params.id })
    .then(user => createFirebaseToken({ user, firebaseToken: req.body.firebase_token }))
    .then(() => res.status(201).end())
    .catch(next);

exports.deleteFirebaseToken = (req, res, next) =>
  getUserBy({ id: req.params.id })
    .then(user => deleteFirebaseToken({ user, firebaseToken: req.params.firebase_token }))
    .then(() => res.status(200).end())
    .catch(next);

exports.listWalkers = (req, res, next) =>
  listWalkers(listWalkerMapper(req))
    .then(users => res.send(listWalkerSerializer(users)))
    .catch(next);

exports.createReservation = async (req, res, next) => {
  let transaction = {};
  try {
    transaction = await sequelize.transaction();
    const reservationData = createReservationMapper(req);
    const transactionOptions = { transaction };
    const walker = await getUserBy({ id: reservationData.walkerId }, ['withFirebaseTokens']);
    if (walker.type === USER_TYPES.OWNER || req.user.type === USER_TYPES.WALKER)
      throw invalidUserType('The provided user must be walker and the logged user must be owner');
    const range = await findRangeBy({ where: { id: reservationData.rangeId }, options: transactionOptions });
    if (!range) throw notFound('The provided range is invalid');
    const pet = await findPetBy({ where: { id: reservationData.petId }, options: transactionOptions });
    if (!pet) throw notFound('The provided pet is invalid');
    const { addressStart, addressEnd } = await findOrCreateReservationAddresses({
      addressStart: reservationData.addressStart,
      addressEnd: reservationData.addressEnd,
      options: transactionOptions,
    });
    const reservation = await createReservation({
      reservationData: {
        addressStart,
        addressEnd,
        range,
        walker,
        comments: reservationData.comments,
        reservationDate: reservationData.reservationDate,
        duration: reservationData.duration,
        pet,
        owner: req.user,
      },
      options: transactionOptions,
    });
    await sendReservationCreatedNotification({ reservation, walker, owner: req.user, range });
    await transaction.commit();
    return res.status(201).end();
  } catch (e) {
    if (transaction) await transaction.rollback();
    return next(e);
  }
};

exports.getMyReservations = (req, res, next) => {
  const data = reservationListMapper(req);
  return getReservationsOfUser(data)
    .then(reservations => res.send(reservationsListSerializer(reservations)))
    .catch(next);
};
