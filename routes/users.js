const router = require('express').Router();
const { getUser } = require('../controllers/controllersUsers.js');
const auth = require('../middlewares/auth.js');

router.get('/users/me', auth, getUser);

module.exports = router;
