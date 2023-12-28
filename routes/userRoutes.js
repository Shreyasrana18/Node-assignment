const express = require('express');
const validateToken = require('../middleware/validateToken');
const { signup, login, me } = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', login);
router.get('/me', validateToken, me);

module.exports = router;