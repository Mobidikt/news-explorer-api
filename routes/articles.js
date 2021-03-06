const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getArticles,
  createArticle,
  deleteArticle,
} = require('../controllers/controllersArticles.js');
const {
  validationArticle,
  validationParams,
} = require('../middlewares/validation.js');

router.get('/articles', auth, getArticles);
router.post('/articles', validationArticle, auth, createArticle);
router.delete('/articles/:articleId', validationParams, auth, deleteArticle);

module.exports = router;
