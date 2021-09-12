const { notFound, invalidToken, invalidParams, internalServerError } = require('../errors/builders');
const { getUserBy } = require('../services/users');
const { verifyAccessToken } = require('../services/sessions');
const { USER_TYPES } = require('../utils/constants');

const checkToken = async ({ token, tokenType, next, req }) => {
  try {
    const decodedToken = await verifyAccessToken(token).catch(err => {
      throw invalidToken(err.message);
    });
    if (decodedToken.token_use !== tokenType) {
      throw invalidParams('The provided token type is not correct');
    }
    const user = await getUserBy({ id: decodedToken.sub }, ['withFirebaseTokens']);
    if (!user) throw notFound('User not found');
    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.checkTokenAndSetUser = (req, _, next) =>
  checkToken({ req, next, token: req.headers.authorization, tokenType: 'access' });

exports.checkRefreshTokenAndSetUser = (req, _, next) =>
  checkToken({ req, next, token: req.body.refresh_token, tokenType: 'refresh' });

exports.checkUserOwnerOnBoarding = (req, _, next) =>
  getUserBy({ id: req.params.id })
    .then(user => {
      const expectedUserType = USER_TYPES.OWNER;
      if (user.type !== expectedUserType) {
        return next(internalServerError(`User must be of type ${expectedUserType}`));
      }
      if (user.wasOnboarded) {
        return next(internalServerError(`User was already onboarded`));
      }
      return next();
    })
    .catch(next);

exports.checkUserWalkerOnBoarding = (req, _, next) =>
  getUserBy({ id: req.params.id })
    .then(user => {
      const expectedUserType = USER_TYPES.WALKER;
      if (user.type !== expectedUserType) {
        return next(internalServerError(`User must be of type ${expectedUserType}`));
      }
      if (user.wasOnboarded) {
        return next(internalServerError(`User was already onboarded`));
      }
      return next();
    })
    .catch(next);
