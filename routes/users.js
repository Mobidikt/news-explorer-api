const router = require('express').Router();
const bodyParser = require('body-parser');
const { getUser } = require('../controllers/controllersUsers.js');
const auth = require('../middlewares/auth.js');
const {
  validationParams,
  validationUserInfo,
} = require('../middlewares/validation');

router.get(
  '/users/me',
  // auth,
  getUser,
);

module.exports = router;
