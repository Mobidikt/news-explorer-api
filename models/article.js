const { Schema, model } = require('mongoose');
const { CLIENT_ERROR } = require('../libs/messages');

const cardSchema = new Schema(
  {
    keyword: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
      match: [
        /(https?|ftp|file):\/\/(www\.)?([-a-z0-9]+\.)([0-9a-z].*)/,
        CLIENT_ERROR.URL_LINK,
      ],
    },
    image: {
      type: String,
      required: true,
      match: [
        /(https?|ftp|file):\/\/(www\.)?([-a-z0-9]+\.)([0-9a-z].*)/,
        CLIENT_ERROR.URL_IMAGE,
      ],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { versionKey: false },
);

module.exports = model('card', cardSchema);
