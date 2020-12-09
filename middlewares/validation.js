const { celebrate, Joi } = require('celebrate');

const validationUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5),
  }),
});

const validationCard = celebrate({
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
      cardId: Joi.string().required().hex(),
    })
    .unknown(true),
});

const validationUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(50),
    about: Joi.string().required().min(5).max(50),
  }),
});

const validationToken = celebrate({
  headers: Joi.object()
    .keys({
      authorization: Joi.string().required(),
    })
    .unknown(true),
});

module.exports = {
  validationUser,
  validationCard,
  validationParams,
  validationUserInfo,

  validationToken,
};
