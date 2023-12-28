const express = require('express');
const validateToken = require('../middleware/validateToken');

const router = express.Router();

router.get('/', (req, res) => {
    res.send("Works Member");
});

module.exports = router;