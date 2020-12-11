const jwt = require('jsonwebtoken');
const { CLIENT_ERROR } = require('../libs/messages');

const handleAuthError = (res) => {
  res.status(401).send({ message: CLIENT_ERROR.AUTORIZATION });
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }
  const token = extractBearerToken(authorization);

  let payload;
  try {
    payload = await jwt.verify(token, process.env.JWT_TOKEN);
  } catch (err) {
    return handleAuthError(res);
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  return next(); // пропускаем запрос дальше
};
