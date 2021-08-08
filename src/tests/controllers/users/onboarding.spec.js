const { USER_TYPES, DAYS_OF_WEEK } = require('../../../app/utils/constants');
const { hashString } = require('../../../app/utils/hashes');
const { getResponse, truncateDatabase } = require('../../utils/app');
const { createUser, buildUser } = require('../../factories/users');
const { createFakeOwnerOnboardingParams, createFakeWalkerOnboardingParams } = require('../../utils/onboarding');
const { User, Pet, Address, Range } = require('../../../app/models');

const expectedKeys = ['message'];
const endpontOnboardingOwner = '/users/onboarding/owner';
const endpontOnboardingWalker = '/users/onboarding/walker';

describe('PUT /users/onboarding/owner', () => {
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
    let successfulResponse;
    const fakeSuccessParams = createFakeOwnerOnboardingParams();
    beforeAll(async () => {
      ({ id } = await createUser({ email, password: hashedPassword, type: USER_TYPES.OWNER }));
      const accessToken = await doFakeLogin(email, password);
      successfulResponse = await getResponse({
        endpoint: `${endpontOnboardingOwner}/${id}`,
        headers: { Authorization: accessToken },
        method: 'put',
        body: fakeSuccessParams,
      });
      userCreated = await getOwnerUserDB(id);
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
    let notFoundResponse;
    beforeAll(async () => {
      const accessToken = await doFakeLogin(email, password);
      notFoundResponse = await getResponse({
        endpoint: `${endpontOnboardingOwner}/2`,
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
        endpoint: `${endpontOnboardingOwner}/${id}`,
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
        endpoint: `${endpontOnboardingOwner}/${id}`,
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
        endpoint: `${endpontOnboardingOwner}/${id}`,
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
        endpoint: `${endpontOnboardingOwner}/${id}`,
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
        endpoint: `${endpontOnboardingOwner}/${id}`,
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
      ({ id } = await createUser({ email, password: hashedPassword, type: USER_TYPES.WALKER }));
      accessToken = await doFakeLogin(email, password);
    });
    it('Should fail with correct message and internal_code', async () => {
      const invalidUserTypeResponse = await getResponse({
        endpoint: `${endpontOnboardingOwner}/${id}`,
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
        endpoint: `${endpontOnboardingOwner}/${id}`,
        headers: { Authorization: 'invalid_token' },
        method: 'put',
        body: createFakeOwnerOnboardingParams(),
      });

      expect(invalidTokenResponse.statusCode).toEqual(401);
      expect(invalidTokenResponse.body.internal_code).toBe('invalid_token');
      expect(invalidTokenResponse.body.message).toBe('jwt malformed');
    });
  });
});

describe('PUT /users/onboarding/walker', () => {
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
    let successfulResponse;
    const fakeSuccessParams = createFakeWalkerOnboardingParams();
    beforeAll(async () => {
      ({ id } = await createUser({ email, password: hashedPassword, type: USER_TYPES.WALKER }));
      const accessToken = await doFakeLogin(email, password);
      successfulResponse = await getResponse({
        endpoint: `${endpontOnboardingWalker}/${id}`,
        headers: { Authorization: accessToken },
        method: 'put',
        body: fakeSuccessParams,
      });
      userCreated = await getWalkerUserDB(id);
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
    it('Should insert the expected ranges', () => {
      expect(userCreated.ranges[0].dayOfWeek).toEqual(fakeSuccessParams.ranges[0].day_of_week);
      expect(userCreated.ranges[0].startAt).toContain(fakeSuccessParams.ranges[0].start_at);
      expect(userCreated.ranges[0].endAt).toContain(fakeSuccessParams.ranges[0].end_at);
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
    let notFoundResponse;
    beforeAll(async () => {
      const accessToken = await doFakeLogin(email, password);
      notFoundResponse = await getResponse({
        endpoint: `${endpontOnboardingWalker}/2`,
        headers: { Authorization: accessToken },
        method: 'put',
        body: createFakeWalkerOnboardingParams(),
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
    let fakeBody;
    beforeAll(async () => {
      accessToken = await doFakeLogin(email, password);
    });
    beforeEach(() => {
      fakeBody = createFakeWalkerOnboardingParams();
    });
    it('Invalid address', async () => {
      delete fakeBody.address.longitude;
      invalidParamsResponse = await getResponse({
        endpoint: `${endpontOnboardingWalker}/${id}`,
        headers: { Authorization: accessToken },
        method: 'put',
        body: fakeBody,
      });

      expect(invalidParamsResponse.statusCode).toEqual(400);
      expect(invalidParamsResponse.body.internal_code).toBe('invalid_params');
      expect(invalidParamsResponse.body.message).toContain(
        'longitude must be a string and be contained in body.address',
      );
    });

    it('Invalid price_per_hour', async () => {
      fakeBody.price_per_hour = 'invalid_price';
      invalidParamsResponse = await getResponse({
        endpoint: `${endpontOnboardingWalker}/${id}`,
        headers: { Authorization: accessToken },
        method: 'put',
        body: fakeBody,
      });

      expect(invalidParamsResponse.statusCode).toEqual(400);
      expect(invalidParamsResponse.body.internal_code).toBe('invalid_params');
      expect(invalidParamsResponse.body.message).toContain('price_per_hour must be a number and be contained in body');
    });

    it('Invalid phone', async () => {
      fakeBody.phone = 5;
      invalidParamsResponse = await getResponse({
        endpoint: `${endpontOnboardingWalker}/${id}`,
        headers: { Authorization: accessToken },
        method: 'put',
        body: fakeBody,
      });

      expect(invalidParamsResponse.statusCode).toEqual(400);
      expect(invalidParamsResponse.body.internal_code).toBe('invalid_params');
      expect(invalidParamsResponse.body.message).toContain('phone must be a string and be contained in body');
    });
    it('Failure due to empty ranges', async () => {
      fakeBody.ranges = [];
      invalidParamsResponse = await getResponse({
        endpoint: `${endpontOnboardingWalker}/${id}`,
        headers: { Authorization: accessToken },
        method: 'put',
        body: fakeBody,
      });

      expect(invalidParamsResponse.statusCode).toEqual(400);
      expect(invalidParamsResponse.body.internal_code).toBe('invalid_params');
      expect(invalidParamsResponse.body.message).toContain(
        'ranges must be an array with at least one element and be contained in body',
      );
    });

    it('Failure due to invalid dayOfWeek of a range', async () => {
      fakeBody.ranges[0].day_of_week = 'fake_invalid_day';
      invalidParamsResponse = await getResponse({
        endpoint: `${endpontOnboardingWalker}/${id}`,
        headers: { Authorization: accessToken },
        method: 'put',
        body: fakeBody,
      });

      expect(invalidParamsResponse.statusCode).toEqual(400);
      expect(invalidParamsResponse.body.internal_code).toBe('invalid_params');
      expect(invalidParamsResponse.body.message).toContain(
        `day_of_week must be one of ${Object.values(DAYS_OF_WEEK).join(',')} and be contained in body.ranges.*`,
      );
    });

    it('Failure due to invalid start_at property of a range', async () => {
      fakeBody.ranges[0].start_at = 'invalid_hour';
      invalidParamsResponse = await getResponse({
        endpoint: `${endpontOnboardingWalker}/${id}`,
        headers: { Authorization: accessToken },
        method: 'put',
        body: fakeBody,
      });

      expect(invalidParamsResponse.statusCode).toEqual(400);
      expect(invalidParamsResponse.body.internal_code).toBe('invalid_params');
      expect(invalidParamsResponse.body.message).toContain(
        `start_at must be a valid hour and be contained in body.ranges.*`,
      );
    });
  });

  describe('Failure due to owner already onboarded', () => {
    let accessToken;
    beforeAll(async () => {
      await truncateDatabase();
      ({ id } = await createUser({ email, password: hashedPassword, type: USER_TYPES.WALKER, wasOnboarded: true }));
      accessToken = await doFakeLogin(email, password);
    });
    it('Should fail with correct message and internal_code', async () => {
      const alreadyOnboardedResponse = await getResponse({
        endpoint: `${endpontOnboardingWalker}/${id}`,
        headers: { Authorization: accessToken },
        method: 'put',
        body: createFakeWalkerOnboardingParams(),
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
      ({ id } = await createUser({ email, password: hashedPassword, type: USER_TYPES.OWNER }));
      accessToken = await doFakeLogin(email, password);
    });
    it('Should fail with correct message and internal_code', async () => {
      const invalidUserTypeResponse = await getResponse({
        endpoint: `${endpontOnboardingWalker}/${id}`,
        headers: { Authorization: accessToken },
        method: 'put',
        body: createFakeWalkerOnboardingParams(),
      });

      expect(invalidUserTypeResponse.statusCode).toEqual(500);
      expect(invalidUserTypeResponse.body.internal_code).toBe('internal_server_error');
      expect(invalidUserTypeResponse.body.message).toContain(
        `There was an unexpected error, reason: User must be of type ${USER_TYPES.WALKER}`,
      );
    });
  });

  describe('Failure due to invalid token', () => {
    it('Should fail with correct message and internal_code', async () => {
      const invalidTokenResponse = await getResponse({
        endpoint: `${endpontOnboardingWalker}/${id}`,
        headers: { Authorization: 'invalid_token' },
        method: 'put',
        body: createFakeWalkerOnboardingParams(),
      });

      expect(invalidTokenResponse.statusCode).toEqual(401);
      expect(invalidTokenResponse.body.internal_code).toBe('invalid_token');
      expect(invalidTokenResponse.body.message).toBe('jwt malformed');
    });
  });
});

const getOwnerUserDB = id => {
  return User.findOne({
    where: { id },
    include: [
      { model: Pet, as: 'pets' },
      { model: Address, as: 'address' },
    ],
  });
};

const getWalkerUserDB = id => {
  return User.findOne({
    where: { id },
    include: [
      { model: Range, as: 'ranges' },
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
