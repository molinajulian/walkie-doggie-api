const { createUserSerializer } = require('../serializers/users');
const { createUser, updateUser } = require('../services/users');
const {
  createUserMapper,
  onBoardingWalkerMapper,
  onBoardingOwnerMapper,
} = require('../mappers/users');
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
    const address = await createAddress({ data: { ...addressData }, options: { transaction } });
    logger.info('Address created');
    const updatedUser = await updateUser({
      id,
      data: { addressId: address.get('id'), ...restData },
      options: { transaction },
    });
    logger.info('User entity updated');
    await bulkCreateRanges({ ranges, walkerId: updatedUser.id, options: { transaction } });
    logger.info('Ranges created succesfully');
    transaction.commit();
    res.status(200).json(updatedUser);
  } catch (error) {
    logger.error('Error onboarding WALKER:', error);
    transaction.rollback();
    res.status(500).json(error);
  }
};

exports.onBoardingOwner = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { address: addressData, pets, ...restData } = onBoardingOwnerMapper(req);
    const address = await createAddress({ data: { ...addressData }, options: { transaction } });

    const updatedUser = await updateUser({
      id,
      data: { addressId: address.get('id'), ...restData },
      options: { transaction },
    });

    await bulkCreatePets({ pets, ownerId: updatedUser.id, options: { transaction } });

    transaction.commit();
    res.status(200).json('User updated successfully');
  } catch (error) {
    logger.error('Error onboarding WALKER:' + error);
    transaction.rollback();
    res.status(500).json(error);
  }
};
