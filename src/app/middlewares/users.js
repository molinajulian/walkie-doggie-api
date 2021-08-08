const { notFound, invalidToken, invalidParams, internalServerError } = require('../errors/builders');
const { getUserBy } = require('../services/users');
const { verifyAccessToken } = require('../services/sessions');
const { USER_TYPES } = require('../utils/constants');

exports.checkTokenAndSetUser = (req, _, next) =>
  verifyAccessToken(req.headers.authorization)
    .catch(err => next(invalidToken(err.message)))
    .then(decodedToken => {
      if (decodedToken && decodedToken.token_use !== 'access') {
        throw invalidParams('The provided token is not an access token');
      }
      return getUserBy({ id: decodedToken.sub }).then(user => {
        if (!user) throw notFound('User not found');
        req.user = user.dataValues;
        return next();
      });
    })
    .catch(next);

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
