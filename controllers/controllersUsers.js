const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const BadRequestError = require('../middlewares/errors/BadRequestError');
const UnauthorizedError = require('../middlewares/errors/UnauthorizedError');
const NotFoundError = require('../middlewares/errors/NotFoundError');
const ConflictError = require('../middlewares/errors/ConflictError');
const { CLIENT_ERROR } = require('../libs/messages');

const { NODE_ENV, JWT_TOKEN } = process.env;

const getUser = async (req, res, next) => {
  try {
    const id = req.user._id;
    const user = await User.findById(id);
    if (!user) {
      return next(new NotFoundError(CLIENT_ERROR.USER));
    }
    return res.status(200).send({ name: user.name, email: user.email });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError(CLIENT_ERROR.DATA));
    }
    return next(err);
  }
};

const createUser = async (req, res, next) => {
  let hashedPassword;
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new BadRequestError(CLIENT_ERROR.FIELDS));
  }
  if (!password.trim()) {
    return next(new BadRequestError(CLIENT_ERROR.PASSWORD_VALID));
  }
  const user = await User.findOne({ email });
  if (user) {
    return next(new ConflictError(CLIENT_ERROR.EXIST_EMAIl));
  }
  try {
    hashedPassword = await bcrypt.hash(req.body.password, 10);
  } catch (err) {
    return next(err);
  }
  try {
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    return res.status(200).send({
      name: newUser.name,
      email: newUser.email,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(
        new BadRequestError({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        }),
      );
    }
    return next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new BadRequestError(CLIENT_ERROR.FIELDS));
  }
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new UnauthorizedError(CLIENT_ERROR.NOT_EXIST_EMAIL));
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return next(new UnauthorizedError(CLIENT_ERROR.PASSWORD));
    }
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_TOKEN : 'dev-secret',
      {
        expiresIn: '7d',
      },
    );
    return res.status(200).send({ token });
  } catch (err) {
    return next(new UnauthorizedError(CLIENT_ERROR.DATA));
  }
};

module.exports = {
  getUser,
  createUser,
  login,
};
