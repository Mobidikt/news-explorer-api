const rateLimit = require('express-rate-limit');
const { CLIENT_ERROR } = require('../libs/messages');

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 минут
  max: 100, // 100 запросов с одного IP
  message: { message: CLIENT_ERROR.MANY_REQUESTS },
});

module.exports = {
  limiter,
};
