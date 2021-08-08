const { notFound, invalidToken, invalidParams } = require('../errors/builders');
const { getUserBy } = require('../services/users');
const { verifyAccessToken } = require('../services/sessions');

exports.checkTokenAndSetUser = (req, _, next) =>
  verifyAccessToken(req.headers.authorization)
    .catch(err => next(invalidToken(err.message)))
    .then(decodedToken => {
      console.log(decodedToken);
      if (decodedToken.token_use !== 'access') {
        throw invalidParams('The provided token is not an access token');
      }
      return getUserBy({ id: decodedToken.sub }).then(user => {
        if (!user) throw notFound('User not found');
        req.user = user.dataValues;
        return next();
      });
    })
    .catch(next);
