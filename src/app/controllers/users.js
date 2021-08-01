const { createUserSerializer } = require('../serializers/users');
const { createUser, updateUser, getUserBy } = require('../services/users');
const { createUserMapper, onBoardingWalkerMapper, onBoardingOwnerMapper } = require('../mappers/users');
const { createAddress } = require('../services/addresses');
const { bulkCreateRanges } = require('../services/ranges');
const { bulkCreatePets } = require('../services/pets');
const { sequelizeInstance: sequelize } = require('../models');
const logger = require('../logger');

exports.createUser = (req, res, next) =>
  createUser(createUserMapper(req))
    .then(user => res.status(201).json(createUserSerializer(user)))
    .catch(next);

exports.onBoardingWalker = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { address: addressData, ranges, ...restData } = onBoardingWalkerMapper(req);
    const user = await getUserBy({ id });
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
    transaction.rollback();
    next(error);
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

    transaction.commit();
    res.status(200).json({ message: 'User onboarded successfully' });
  } catch (error) {
    logger.error(error);
    transaction.rollback();
    next(error);
  }
};
