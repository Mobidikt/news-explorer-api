const { Schema, model } = require('mongoose');
const validator = require('validator');

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      validate: {
        validator(v) {
          return validator.isEmail(v);
        },
        message: 'Неверный email',
      },
    },
    password: {
      type: String,
      require: true,
      select: false,
    },
  },
  { versionKey: false },
);

module.exports = model('user', userSchema);
