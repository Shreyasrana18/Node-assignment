const express = require('express');
const validateToken = require('../middleware/validateToken');
const { createCommunity } = require('../controllers/communityController');

const router = express.Router();

router.post('/',validateToken, createCommunity);

module.exports = router;