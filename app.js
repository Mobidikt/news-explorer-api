require('dotenv').config();
const express = require('express');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes/index.js');

const app = express();
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { createUser, login } = require('./controllers/controllersUsers.js');
const {
  validationLogin,
  validateRegister,
} = require('./middlewares/validation');
const NotFoundError = require('./middlewares/errors/NotFoundError.js');
const { NOT_FOUND, SERVER } = require('./libs/messages');

const PORT = 3000;

const mongoDbUrl = 'mongodb://localhost:27017/newsdb';
const mongoConnectOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

mongoose.connect(mongoDbUrl, mongoConnectOptions);

app.use(cors());

app.use(requestLogger);

app.post('/signin', validationLogin, bodyParser.json(), login);
app.post('/signup', validateRegister, bodyParser.json(), createUser);

app.use(routes);
app.use(() => {
  throw new NotFoundError(NOT_FOUND);
});
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  res.status(err.status || 500).send({ message: err.message || SERVER.ERROR });
  next();
});

app.listen(PORT);
