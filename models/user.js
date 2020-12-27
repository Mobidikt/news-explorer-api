const { Schema, model } = require('mongoose');
const validator = require('validator');
const { CLIENT_ERROR } = require('../libs/messages');

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
        message: CLIENT_ERROR.EMAIL,
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
