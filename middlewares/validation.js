const { celebrate, Joi } = require('celebrate');

const validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5),
  }),
});

const validateRegister = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5),
  }),
});
const validationArticle = celebrate({
  body: Joi.object().keys({
    link: Joi.string()
      .required()
      .min(5)
      .pattern(/^(http|https):\/\/[^ "]+$/),
    image: Joi.string()
      .required()
      .min(5)
      .pattern(/^(http|https):\/\/[^ "]+$/),
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
