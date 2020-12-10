const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const BadRequestError = require('../middlewares/errors/BadRequestError');
const UnauthorizedError = require('../middlewares/errors/UnauthorizedError');
const NotFoundError = require('../middlewares/errors/NotFoundError');
const ConflictError = require('../middlewares/errors/ConflictError');

const { NODE_ENV, JWT_TOKEN } = process.env;

const getUser = async (req, res, next) => {
  try {
    const id = req.user._id;
    const user = await User.findById(id);
    if (!user) {
      return next(new NotFoundError('Нет пользователя с таким id'));
    }
    return res.status(200).send({ name: user.name, email: user.email });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Переданы некорректные данные'));
    }
    return next();
  }
};

const createUser = async (req, res, next) => {
  let hashedPassword;
  const { email, password } = req.body;
  if (!email || !password || !password.trim()) {
    return next(new BadRequestError('Переданы некорректные данные'));
  }
  const user = await User.findOne({ email });
  if (user) {
    return next(new ConflictError('Уже есть пользователь с таким email'));
  }
  try {
    hashedPassword = await bcrypt.hash(req.body.password, 10);
  } catch (err) {
    return next();
  }
  try {
    const { name } = req.body;
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
      return next(new BadRequestError('Переданы некорректные данные'));
    }
    return next();
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new BadRequestError('Неверные данные'));
  }
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new UnauthorizedError('Нет пользователя с таким email'));
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return next(new UnauthorizedError('Неправильный пароль'));
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
    return next(new UnauthorizedError('Некоректные данные'));
  }
};

module.exports = {
  getUser,
  createUser,
  login,
};
