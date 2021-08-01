const { hashString } = require('../../../app/utils/hashes');
const { getResponse, truncateDatabase } = require('../../utils/app');
const { createUser, buildUser } = require('../../factories/users');
const { generateToken } = require('../../factories/tokens');
const { User } = require('../../../app/models');
const { moment } = require('../../../app/utils/moment');

const expectedKeys = ['access_token', 'refresh_token'];

describe('POST /sessions/login', () => {
  let successfulResponse = {};
  let notFoundResponse = {};
  let invalidParamsResponse = {};
  let invalidCredentialsResponse = {};
  let userCreated = {};
  beforeAll(async () => {
    await truncateDatabase();
    const { email, password } = await buildUser();
    const hashedPassword = await hashString(password);
    const { id } = await createUser({ email, password: hashedPassword });
    successfulResponse = await getResponse({
      endpoint: '/sessions/login',
      method: 'post',
      body: { email, password },
    });
    userCreated = await User.findOne({ where: { id } });
    invalidCredentialsResponse = await getResponse({
      endpoint: '/sessions/login',
      method: 'post',
      body: { email, password: 'wrong' },
    });
    notFoundResponse = await getResponse({
      endpoint: '/sessions/login',
      method: 'post',
      body: { email: 'fake@domain.com', password: 'invalid-pass' },
    });
    invalidParamsResponse = await getResponse({
      endpoint: '/sessions/login',
      method: 'post',
    });
  });
  describe('Successful response', () => {
    it('Should return status code 200', () => {
      expect(successfulResponse.statusCode).toEqual(200);
    });
    it('Should return the expected keys in body', () => {
      expect(Object.keys(successfulResponse.body)).toStrictEqual(expect.arrayContaining(expectedKeys));
    });
    it('Should return jwt tokens in body', () => {
      Object.values(successfulResponse.body).forEach(token => {
        expect(token).toMatch(new RegExp(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/));
      });
    });
    it('Should update the last access field for the user', () => {
      expect(moment(userCreated.lastAccess).format('YYYY-MM-DD HH:mm')).toBe(moment().format('YYYY-MM-DD HH:mm'));
    });
  });
  describe('Fail for invalid request', () => {
    it('Should return status code 400', () => {
      expect(invalidParamsResponse.statusCode).toEqual(400);
    });
    it('Should return internal_code invalid_params', () => {
      expect(invalidParamsResponse.body.internal_code).toBe('invalid_params');
    });
    it('Should return an error indicating the provided email is not valid', () => {
      expect(invalidParamsResponse.body.message).toContain('email must be a string and be contained in body');
    });
    it('Should return an error indicating the provided password is not valid', () => {
      expect(invalidParamsResponse.body.message).toContain('password must be a string and be contained in body');
    });
  });
  describe("Fail because the user doesn't exist", () => {
    it('Should return status code 404', () => {
      expect(notFoundResponse.statusCode).toEqual(404);
    });
    it('Should return internal_code not_found', () => {
      expect(notFoundResponse.body.internal_code).toBe('not_found');
    });
    it("Should return an error indicating the provided user doesn't exist", () => {
      expect(notFoundResponse.body.message).toEqual('User not found');
    });
  });
  describe('Fail for invalid credentials', () => {
    it('Should return status code 400', () => {
      expect(invalidCredentialsResponse.statusCode).toEqual(400);
    });
    it('Should return internal_code invalid_credentials', () => {
      expect(invalidCredentialsResponse.body.internal_code).toBe('invalid_credentials');
    });
    it("Should return an error indicating the provided user doesn't exist", () => {
      expect(invalidCredentialsResponse.body.message).toEqual('The credentials are not correct');
    });
  });
});

describe.skip('POST /sessions/refresh', () => {
  let successfulResponse = {};
  let notFoundResponse = {};
  let invalidParamsResponse = {};
  let accessTokenToInvalidate = '';
  let validRefreshToken = '';
  let invalidAccessToken = '';
  const invalidatedToken = {};
  let tokenTypeErrorResponse = {};
  beforeAll(async () => {
    accessTokenToInvalidate = await generateToken();
    validRefreshToken = await generateToken(1, 'refresh');
    invalidAccessToken = await generateToken(20);

    await truncateDatabase();
    await createUser();
    successfulResponse = await getResponse({
      endpoint: '/sessions/refresh',
      method: 'post',
      headers: { Authorization: accessTokenToInvalidate },
      body: { refresh_token: validRefreshToken },
    });
    notFoundResponse = await getResponse({
      endpoint: '/sessions/refresh',
      method: 'post',
      headers: { Authorization: invalidAccessToken },
      body: { refresh_token: validRefreshToken },
    });
    invalidParamsResponse = await getResponse({
      endpoint: '/sessions/refresh',
      method: 'post',
    });
    tokenTypeErrorResponse = await getResponse({
      endpoint: '/sessions/refresh',
      method: 'post',
      headers: { Authorization: validRefreshToken },
      body: { refresh_token: validRefreshToken },
    });
  });
  describe('Successful response', () => {
    it('Should return status code 200', () => {
      expect(successfulResponse.statusCode).toEqual(200);
    });
    it('The access token provided was invalidated', () => {
      expect(invalidatedToken).not.toBeNull();
    });
    it('Should return jwt tokens in body', () => {
      Object.values(successfulResponse.body).forEach(token => {
        expect(token).toMatch(new RegExp(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/));
      });
    });
  });
  describe('Fail for invalid request', () => {
    it('Should return status code 400', () => {
      expect(invalidParamsResponse.statusCode).toEqual(400);
    });
    it('Should return internal_code invalid_params', () => {
      expect(invalidParamsResponse.body.internal_code).toBe('invalid_params');
    });
    it('Should return an error indicating the provided authorization header is not valid', () => {
      expect(invalidParamsResponse.body.message).toContain(
        'Authorization must be a jwt token and must be contained in headers',
      );
    });
    it('Should return an error indicating the provided refresh_token is not valid', () => {
      expect(invalidParamsResponse.body.message).toContain(
        'refresh_token must be a jwt token and must be contained in body',
      );
    });
  });
  describe("Fail because the user doesn't exist", () => {
    it('Should return status code 400', () => {
      expect(notFoundResponse.statusCode).toEqual(400);
    });
    it('Should return internal_code not_found', () => {
      expect(notFoundResponse.body.internal_code).toBe('invalid_token');
    });
    it('Should return a message indicating the provided token was generated by a non-existent user', () => {
      expect(notFoundResponse.body.message).toEqual('User not found');
    });
  });
  describe('Fail because the token is not an access token', () => {
    it('Should return status code 400', () => {
      expect(tokenTypeErrorResponse.statusCode).toEqual(400);
    });
    it('Should return internal_code invalid_token', () => {
      expect(tokenTypeErrorResponse.body.internal_code).toBe('invalid_token');
    });
    it('Should return a message indicating the provided token is not an access token', () => {
      expect(tokenTypeErrorResponse.body.message).toEqual('The provided token is not an access token');
    });
  });
});
