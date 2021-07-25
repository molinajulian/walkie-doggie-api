const { compareHash } = require('../utils/hashes');
const { getUserBy, updateLastLogin } = require('../services/users');
const { invalidCredentials } = require('../errors/builders');
const { generateTokens, verifyAndCreateToken } = require('../services/sessions');
const { login, refresh } = require('../serializers/sessions');

exports.login = (req, res, next) =>
  getUserBy({ email: req.body.email })
    .then(user =>
      compareHash(req.body.password, user.password).then(match => {
        if (!match) throw invalidCredentials();
        return generateTokens({ user, req }).then(({ accessToken, refreshToken }) =>
          updateLastLogin(user).then(() =>
            res.status(200).send(login({ accessToken, refreshToken })),
          ),
        );
      }),
    )
    .catch(next);

exports.refresh = (req, res, next) =>
  verifyAndCreateToken({ type: 'refresh', req })
    .then(newAccessToken =>
      res
        .status(200)
        .send(refresh({ accessToken: newAccessToken, refreshToken: req.body.refresh_token })),
    )
    .catch(next);
