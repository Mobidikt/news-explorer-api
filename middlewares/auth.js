const jwt = require('jsonwebtoken');
const { CLIENT_ERROR } = require('../libs/messages');
const UnauthorizedError = require('./errors/UnauthorizedError');

const { NODE_ENV, JWT_TOKEN } = process.env;

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError(CLIENT_ERROR.AUTORIZATION));
  }
  const token = extractBearerToken(authorization);

  let payload;
  try {
    payload = await jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_TOKEN : 'dev-secret',
    );
    req.user = payload; // записываем пейлоуд в объект запроса
    return next();
  } catch (err) {
    return next(new UnauthorizedError(CLIENT_ERROR.AUTORIZATION));
  }
};
