const { celebrate, Joi } = require('celebrate');

const validationLogin = celebrate({
  body: Joi.object()
    .options({ abortEarly: false })
    .keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(5),
    }),
});

const validateRegister = celebrate({
  body: Joi.object()
    .options({ abortEarly: false })
    .keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(5),
    }),
});
const validationArticle = celebrate({
  body: Joi.object()
    .options({ abortEarly: false })
    .keys({
      keyword: Joi.string().required(),
      title: Joi.string().required(),
      text: Joi.string().required(),
      date: Joi.string().required(),
      source: Joi.string().required(),
      link: Joi.string()
        .required()
        .min(5)
        .pattern(/(https?|ftp|file):\/\/(www\.)?([-a-z0-9]+\.)([0-9a-z].*)/),
      image: Joi.string()
        .required()
        .min(5)
        .pattern(/(https?|ftp|file):\/\/(www\.)?([-a-z0-9]+\.)([0-9a-z].*)/),
    }),
});

const validationParams = celebrate({
  params: Joi.object()
    .keys({
      articleId: Joi.string().required().hex(),
    })
    .unknown(true),
});

const validationToken = celebrate({
  headers: Joi.object()
    .keys({
      authorization: Joi.string().required(),
    })
    .unknown(true),
});

module.exports = {
  validateRegister,
  validationLogin,
  validationArticle,
  validationParams,
  validationToken,
};
