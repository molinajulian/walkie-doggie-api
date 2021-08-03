const { USER_TYPES } = require('../../../app/utils/constants');
const { hashString } = require('../../../app/utils/hashes');
const { getResponse, truncateDatabase } = require('../../utils/app');
const { createUser, buildUser } = require('../../factories/users');
const { createFakeOwnerOnboardingParams } = require('../../utils/onboarding');
const { User, Pet, Address } = require('../../../app/models');

const expectedKeys = ['message'];

describe('PUT /users/onboarding/owner', () => {
  let successfulResponse = {};
  let notFoundResponse = {};
  let userCreated = {};
  let id;
  // eslint-disable-next-line camelcase
  let email, password, hashedPassword;
  beforeAll(async () => {
    await truncateDatabase();
    ({ email, password } = await buildUser());
    hashedPassword = await hashString(password);
  });
  describe('Successful response', () => {
    const fakeSuccessParams = createFakeOwnerOnboardingParams();
    beforeAll(async () => {
      ({ id } = await createUser({ email, password: hashedPassword, type: USER_TYPES.OWNER }));
      const accessToken = await doFakeLogin(email, password);
      successfulResponse = await getResponse({
        endpoint: `/users/onboarding/owner/${id}`,
        headers: { Authorization: accessToken },
        method: 'put',
        body: fakeSuccessParams,
      });
      userCreated = await getUserDB(id);
    });

    it('Should return status code 200', () => {
      expect(successfulResponse.statusCode).toEqual(200);
    });
    it('Should return the expected keys in body', () => {
      expect(Object.keys(successfulResponse.body)).toStrictEqual(expect.arrayContaining(expectedKeys));
    });
    it('Should insert the expected field values', () => {
      expect(userCreated.phone).toEqual(fakeSuccessParams.phone);
      expect(userCreated.profilePhotoUri).toEqual(fakeSuccessParams.profile_photo_uri);
    });
    it('Should insert the expected pets', () => {
      expect(userCreated.pets[0].name).toEqual(fakeSuccessParams.pets[0].name);
      expect(userCreated.pets[0].breed).toEqual(fakeSuccessParams.pets[0].breed);
      expect(userCreated.pets[0].birthYear).toEqual(fakeSuccessParams.pets[0].birth_year);
      expect(userCreated.pets[0].gender).toEqual(fakeSuccessParams.pets[0].gender);
      expect(userCreated.pets[0].weight).toEqual(fakeSuccessParams.pets[0].weight);
      expect(userCreated.pets[0].photoUri).toEqual(fakeSuccessParams.pets[0].photo_uri);
      expect(userCreated.pets[0].description).toEqual(fakeSuccessParams.pets[0].description);
    });
    it('Should insert the expected address', () => {
      expect(userCreated.address.description).toEqual(fakeSuccessParams.address.description);
      expect(userCreated.address.latitude).toEqual(fakeSuccessParams.address.latitude);
      expect(userCreated.address.longitude).toEqual(fakeSuccessParams.address.longitude);
    });
    it('Should insert the expected was_onboarded value', () => {
      expect(userCreated.wasOnboarded).toEqual(true);
    });
  });
  describe('Not Found response', () => {
    beforeAll(async () => {
      const accessToken = await doFakeLogin(email, password);
      notFoundResponse = await getResponse({
        endpoint: `/users/onboarding/owner/2`,
        headers: { Authorization: accessToken },
        method: 'put',
        body: createFakeOwnerOnboardingParams(),
      });
    });

    it('Should return status code 404', () => {
      expect(notFoundResponse.statusCode).toEqual(404);
    });
    it('Should return internal_code invalid_params', () => {
      expect(notFoundResponse.body.internal_code).toBe('not_found');
    });
    it('Should return an error indicating the provided user id is not valid', () => {
      expect(notFoundResponse.body.message).toContain('User not found');
    });
  });
  describe('Failed for invalid requests', () => {
    let accessToken;
    let invalidParamsResponse;
    beforeAll(async () => {
      accessToken = await doFakeLogin(email, password);
    });
    it('Invalid address', async () => {
      const fakeBody = createFakeOwnerOnboardingParams();
      delete fakeBody.address.latitude;
      invalidParamsResponse = await getResponse({
        endpoint: `/users/onboarding/owner/${id}`,
        headers: { Authorization: accessToken },
        method: 'put',
        body: fakeBody,
      });

      expect(invalidParamsResponse.statusCode).toEqual(400);
      expect(invalidParamsResponse.body.internal_code).toBe('invalid_params');
      expect(invalidParamsResponse.body.message).toContain(
        'latitude must be a string and be contained in body.address',
      );
    });

    it('Invalid phone', async () => {
      const fakeBody = createFakeOwnerOnboardingParams();
      fakeBody.phone = 5;
      invalidParamsResponse = await getResponse({
        endpoint: `/users/onboarding/owner/${id}`,
        headers: { Authorization: accessToken },
        method: 'put',
        body: fakeBody,
      });

      expect(invalidParamsResponse.statusCode).toEqual(400);
      expect(invalidParamsResponse.body.internal_code).toBe('invalid_params');
      expect(invalidParamsResponse.body.message).toContain('phone must be a string and be contained in body');
    });
    it('Failure due to empty pets', async () => {
      const fakeBody = createFakeOwnerOnboardingParams();
      fakeBody.pets = [];
      invalidParamsResponse = await getResponse({
        endpoint: `/users/onboarding/owner/${id}`,
        headers: { Authorization: accessToken },
        method: 'put',
        body: fakeBody,
      });

      expect(invalidParamsResponse.statusCode).toEqual(400);
      expect(invalidParamsResponse.body.internal_code).toBe('invalid_params');
      expect(invalidParamsResponse.body.message).toContain(
        'pets must be an array with at least one element and be contained in body',
      );
    });

    it('Failure due invalid birthYear of a pet', async () => {
      const fakeBody = createFakeOwnerOnboardingParams();
      fakeBody.pets[0].birth_year = 'invalid_birthYear';
      invalidParamsResponse = await getResponse({
        endpoint: `/users/onboarding/owner/${id}`,
        headers: { Authorization: accessToken },
        method: 'put',
        body: fakeBody,
      });

      expect(invalidParamsResponse.statusCode).toEqual(400);
      expect(invalidParamsResponse.body.internal_code).toBe('invalid_params');
      expect(invalidParamsResponse.body.message).toContain('birth_year must be a number and be contained in body');
    });
  });

  describe('Failure due to owner already onboarded', () => {
    let accessToken;
    beforeAll(async () => {
      await truncateDatabase();
      ({ id } = await createUser({ email, password: hashedPassword, type: USER_TYPES.OWNER, wasOnboarded: true }));
      accessToken = await doFakeLogin(email, password);
    });
    it('Should fail with correct message and internal_code', async () => {
      const alreadyOnboardedResponse = await getResponse({
        endpoint: `/users/onboarding/owner/${id}`,
        headers: { Authorization: accessToken },
        method: 'put',
        body: createFakeOwnerOnboardingParams(),
      });

      expect(alreadyOnboardedResponse.statusCode).toEqual(500);
      expect(alreadyOnboardedResponse.body.internal_code).toBe('internal_server_error');
      expect(alreadyOnboardedResponse.body.message).toContain(
        'There was an unexpected error, reason: User was already onboarded',
      );
    });
  });

  describe('Failure due to invalid user type', () => {
    let accessToken;
    beforeAll(async () => {
      await truncateDatabase();
      ({ id } = await createUser({ email, password: hashedPassword, type: USER_TYPES.WALKER, wasOnboarded: true }));
      accessToken = await doFakeLogin(email, password);
    });
    it('Should fail with correct message and internal_code', async () => {
      const invalidUserTypeResponse = await getResponse({
        endpoint: `/users/onboarding/owner/${id}`,
        headers: { Authorization: accessToken },
        method: 'put',
        body: createFakeOwnerOnboardingParams(),
      });

      expect(invalidUserTypeResponse.statusCode).toEqual(500);
      expect(invalidUserTypeResponse.body.internal_code).toBe('internal_server_error');
      expect(invalidUserTypeResponse.body.message).toContain(
        `There was an unexpected error, reason: User must be of type ${USER_TYPES.OWNER}`,
      );
    });
  });

  describe('Failure due to invalid token', () => {
    it('Should fail with correct message and internal_code', async () => {
      const invalidTokenResponse = await getResponse({
        endpoint: `/users/onboarding/owner/${id}`,
        headers: { Authorization: 'invalid_token' },
        method: 'put',
        body: createFakeOwnerOnboardingParams(),
      });

      expect(invalidTokenResponse.statusCode).toEqual(400);
      expect(invalidTokenResponse.body.internal_code).toBe('invalid_token');
      expect(invalidTokenResponse.body.message).toBe('jwt malformed');
    });
  });
});

const getUserDB = id => {
  return User.findOne({
    where: { id },
    include: [
      { model: Pet, as: 'pets' },
      { model: Address, as: 'address' },
    ],
  });
};

const doFakeLogin = async (email, password) => {
  const loginResponse = await getResponse({
    endpoint: '/sessions/login',
    method: 'post',
    body: { email, password },
  });
  return loginResponse.body.access_token;
};
