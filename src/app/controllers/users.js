const { createUserSerializer, listWalkerSerializer } = require('../serializers/users');
const { createUser, updateUser, getUserBy, listWalkers } = require('../services/users');
const {
  createUserMapper,
  onBoardingWalkerMapper,
  onBoardingOwnerMapper,
  editOwnerMapper,
  editWalkerMapper,
} = require('../mappers/users');
const { createAddress, deleteAddressesOfUser } = require('../services/addresses');
const { bulkCreateRanges, deleteRangesOfUser } = require('../services/ranges');
const { bulkCreatePets, deletePetsOfUser } = require('../services/pets');
const { sequelizeInstance: sequelize } = require('../models');
const logger = require('../logger');
const { getUserSerializer } = require('../serializers/users');
const { forbidden } = require('../errors/builders');
const { deleteCertificationOfUser, bulkCreateCertifications } = require('../services/certifications');
const { createFirebaseToken, deleteFirebaseToken } = require('../services/firebase_tokens');

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
  getUserBy({ id: req.params.id })
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
    await deleteAddressesOfUser({ user: req.user }, { transaction });
    await deletePetsOfUser({ user: req.user }, { transaction });
    const address = await createAddress({ data: { ...editOwnerData.address }, options: { transaction } });
    const updatedUser = await updateUser({
      user: req.user,
      data: { addressId: address.get('id'), ...editOwnerData },
      options: { transaction },
    });
    const pets = await bulkCreatePets({ pets: editOwnerData.pets, ownerId: updatedUser.id, options: { transaction } });
    updatedUser.address = address;
    updatedUser.pets = pets;
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
    await deleteAddressesOfUser({ user: req.user }, { transaction });
    await deleteCertificationOfUser({ user: req.user }, { transaction });
    await deleteRangesOfUser({ user: req.user }, { transaction });
    const address = await createAddress({ data: { ...editWalkerData.address }, options: { transaction } });
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
  listWalkers()
    .then(users => res.send(listWalkerSerializer(users)))
    .catch(next);
