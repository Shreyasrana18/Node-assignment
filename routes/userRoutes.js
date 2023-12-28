const express = require('express');
const validateToken = require('../middleware/validateToken');
const { signup } = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signup);

module.exports = router;