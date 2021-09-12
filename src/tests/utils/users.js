const { createAchievement } = require('../factories/achievements');
const { USER_TYPES } = require('../../app/utils/constants');
const { createPet } = require('../factories/pets');
const { createCertification } = require('../factories/certifications');
const { createUser } = require('../factories/users');
const { createAddress } = require('../factories/address');
const { hashString } = require('../../app/utils/hashes');
const { buildUser } = require('../factories/users');

exports.createCompleteWalker = async () => {
  const { email, password } = await buildUser();
  const hashedPassword = await hashString(password);
  const address = await createAddress();
  const user = await createUser({
    email,
    password: hashedPassword,
    addressId: address.id,
    type: USER_TYPES.WALKER,
    wasOnboarded: true,
  });
  await createCertification({ walkerId: user.id });
  await createAchievement({ walkerId: user.id });
  return user;
};

exports.createCompleteOwner = async () => {
  const { email, password } = await buildUser();
  const hashedPassword = await hashString(password);
  const address = await createAddress();
  const user = await createUser({
    email,
    password: hashedPassword,
    addressId: address.id,
    type: USER_TYPES.OWNER,
    wasOnboarded: true,
  });
  await createPet({ ownerId: user.id });
  return user;
};
