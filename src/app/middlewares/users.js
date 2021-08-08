const { notFound, invalidToken, invalidParams, internalServerError } = require('../errors/builders');
const { getUserBy } = require('../services/users');
const { verifyAccessToken } = require('../services/sessions');
const { USER_TYPES } = require('../utils/constants');

const checkToken = ({ token, tokenType, next, req }) =>
  verifyAccessToken(token)
    .catch(err => next(invalidToken(err.message)))
    .then(decodedToken => {
      if (decodedToken.token_use !== tokenType) {
        throw invalidParams('The provided token type is not correct');
      }
      return getUserBy({ id: decodedToken.sub }).then(user => {
        if (!user) throw notFound('User not found');
        req.user = user.dataValues;
        return next();
      });
    })
    .catch(next);

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
