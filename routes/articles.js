const router = require('express').Router();
const bodyParser = require('body-parser');
const auth = require('../middlewares/auth');
const {
  getArticles,
  createArticle,
  deleteArticle,
} = require('../controllers/controllersArticles.js');
const {
  validationArticle,
  validationParams,
} = require('../middlewares/validation');

router.get(
  '/articles',
  // auth,
  getArticles,
);
router.post(
  '/articles',
  validationArticle,
  // auth,
  bodyParser.json(),
  createArticle,
);
router.delete('/articles/:articleId', validationParams, auth, deleteArticle);

module.exports = router;
