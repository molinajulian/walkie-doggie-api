const { USER_TYPES } = require('../../../app/utils/constants');
const { hashString } = require('../../../app/utils/hashes');
const { getResponse, truncateDatabase } = require('../../utils/app');
const { createUser, buildUser } = require('../../factories/users');
const { createFakeOwnerOnboardingParams } = require('../../utils/onboarding');
const { User, Pet, Address } = require('../../../app/models');

const expectedKeys = ['message'];

describe('PUT /users/onboarding/owner', () => {
  let loginResponse = {};
  let successfulResponse = {};
  let notFoundResponse = {};
  let invalidParamsResponse = {};
  let userCreated = {};
  let id;
  // eslint-disable-next-line camelcase
  let access_token;
  beforeAll(async () => {
    await truncateDatabase();
    const { email, password } = await buildUser();
    const hashedPassword = await hashString(password);
    ({ id } = await createUser({ email, password: hashedPassword, type: USER_TYPES.OWNER }));
    loginResponse = await getResponse({
      endpoint: '/sessions/login',
      method: 'post',
      body: { email, password },
    });
    // eslint-disable-next-line camelcase
    ({ access_token } = loginResponse.body);
  });
  describe.only('Successful response', () => {
    beforeAll(async () => {
      successfulResponse = await getResponse({
        endpoint: `/users/onboarding/owner/${id}`,
        headers: { Authorization: access_token },
        method: 'put',
        body: createFakeOwnerOnboardingParams,
      });
      userCreated = await User.findOne({
        where: { id },
        include: [
          { model: Pet, as: 'pets' },
          { model: Address, as: 'address' },
        ],
      });
    });

    it('Should return status code 200', () => {
      expect(successfulResponse.statusCode).toEqual(200);
    });
    it('Should return the expected keys in body', () => {
      expect(Object.keys(successfulResponse.body)).toStrictEqual(expect.arrayContaining(expectedKeys));
    });
    it('Should insert the expected field values', () => {
      expect(userCreated.phone).toEqual(createFakeOwnerOnboardingParams.phone);
      expect(userCreated.profilePhotoUri).toEqual(createFakeOwnerOnboardingParams.profile_photo_uri);
    });
    it('Should insert the expected pets', () => {
      expect(userCreated.pets[0].name).toEqual(createFakeOwnerOnboardingParams.pets[0].name);
      expect(userCreated.pets[0].breed).toEqual(createFakeOwnerOnboardingParams.pets[0].breed);
      expect(userCreated.pets[0].birthYear).toEqual(createFakeOwnerOnboardingParams.pets[0].birth_year);
      expect(userCreated.pets[0].gender).toEqual(createFakeOwnerOnboardingParams.pets[0].gender);
      expect(userCreated.pets[0].weight).toEqual(createFakeOwnerOnboardingParams.pets[0].weight);
      expect(userCreated.pets[0].photoUri).toEqual(createFakeOwnerOnboardingParams.pets[0].photo_uri);
      expect(userCreated.pets[0].description).toEqual(createFakeOwnerOnboardingParams.pets[0].description);
    });
    it.only('Should insert the expected address', () => {
      expect(userCreated.address.description).toEqual(createFakeOwnerOnboardingParams.address.description);
      expect(userCreated.address.latitude).toEqual(createFakeOwnerOnboardingParams.address.latitude);
      expect(userCreated.address.longitude).toEqual(createFakeOwnerOnboardingParams.address.longitude);
    });
    it('Should insert the expected was_onboarded value', () => {
      expect(userCreated.wasOnboarded).toEqual(true);
    });
  });
  describe.skip('Not Found response', () => {
    beforeAll(async () => {
      notFoundResponse = await getResponse({
        endpoint: `/users/onboarding/owner/2`,
        headers: { Authorization: access_token },
        method: 'put',
        body: createFakeOwnerOnboardingParams,
      });
    });

    it('Should return status code 404', () => {
      expect(successfulResponse.statusCode).toEqual(404);
    });
    it('Should return internal_code invalid_params', () => {
      expect(invalidParamsResponse.body.internal_code).toBe('not_found');
    });
    it('Should return an error indicating the provided user id is not valid', () => {
      expect(invalidParamsResponse.body.message).toContain('User not found');
    });
  });
  describe.skip('Invalid Params response', () => {
    beforeAll(async () => {
      invalidParamsResponse = await getResponse({
        endpoint: `/users/onboarding/owner/${id}`,
        headers: { Authorization: access_token },
        method: 'put',
        body: { address: { latitude: '12.1479' } },
      });
      userCreated = await User.findOne({ where: { id } });
    });

    it('Should return status code 200', () => {
      expect(successfulResponse.statusCode).toEqual(200);
    });
    it('Should return the expected keys in body', () => {
      expect(Object.keys(successfulResponse.body)).toStrictEqual(expect.arrayContaining(expectedKeys));
    });
    it('Should insert the expected field values', () => {
      expect(userCreated.phone).toEqual(createFakeOwnerOnboardingParams.phone);
      expect(userCreated.profilePhotoUri).toEqual(createFakeOwnerOnboardingParams.profile_photo_uri);
    });
  });
});
