const { uuid } = require('uuidv4');
const { promisifyAll } = require('bluebird');
const { signAsync, verifyAsync } = promisifyAll(require('jsonwebtoken'));
const { inspect } = require('util');
const { moment } = require('../utils/moment');
const { expirationTimeAccessToken, expirationTimeRefreshToken, secret } = require('../../config').session;
const logger = require('../logger');
const { internalServerError } = require('../errors/builders');

const getIss = req => `${req.protocol}://${req.get('host')}`;

exports.verifyAccessToken = token => verifyAsync(token, secret);

exports.generateAccessToken = (user, req) =>
  signAsync(
    {
      token_use: 'access',
      user_type: user.type,
      nbf: moment().unix(),
      exp: moment()
        .clone()
        .add(parseInt(expirationTimeAccessToken), 'minutes')
        .unix(),
    },
    secret,
    {
      issuer: getIss(req),
      jwtid: uuid(),
      subject: `${user.id}`,
    },
  );

exports.generateTokens = async ({ req, user }) => {
  try {
    logger.info(`Attempting to generate tokens for the user with id: ${user.id}`);
    const iss = getIss(req);
    logger.info('Iss was generated successfully');
    const accessToken = await this.generateAccessToken(user, req);
    const refreshToken = await signAsync(
      {
        token_use: 'refresh',
        nbf: moment().unix(),
        exp: moment()
          .clone()
          .add(parseInt(expirationTimeRefreshToken), 'minutes')
          .unix(),
      },
      secret,
      {
        issuer: iss,
        jwtid: uuid(),
        subject: `${user.id}`,
      },
    );
    return { accessToken, refreshToken };
  } catch (err) {
    /* istanbul ignore next */
    logger.error(inspect(err));
    /* istanbul ignore next */
    throw internalServerError(`There was an error generating the tokens: ${err.message}`);
  }
};

exports.verifyAndCreateToken = async ({ req }) => {
  try {
    await verifyAsync(req.body.refresh_token, secret);
    logger.info('Token verified successful');
    logger.info('Attempting to generate new access token');
    const accessToken = await this.generateAccessToken(req.user, req);
    return accessToken;
  } catch (err) {
    /* istanbul ignore next */
    logger.error(inspect(err));
    /* istanbul ignore next */
    throw internalServerError(`There was an error generating the token: ${err.message}`);
  }
};
