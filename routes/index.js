const router = require('express').Router();

const articlesRouter = require('./articles.js');
const usersRouter = require('./users.js');

router.use(usersRouter, articlesRouter);

module.exports = router;
