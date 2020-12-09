const router = require('express').Router();
const bodyParser = require('body-parser');
const {
  validationCard,
  validationParams,
} = require('../middlewares/validation');

router.get('/cards', auth, getCards);
router.post('/cards', validationCard, auth, bodyParser.json(), createCard);
router.delete('/cards/:cardId', validationParams, auth, deleteCard);
router.put('/cards/likes/:cardId', validationParams, auth, likeCard);
router.delete('/cards/likes/:cardId', validationParams, auth, dislikeCard);
