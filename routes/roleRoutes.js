const express = require('express');
const validateToken = require('../middleware/validateToken');
const { createRole, getAllRoles } = require('../controllers/roleController');

const router = express.Router();

router.post('/role', createRole).get('/role',getAllRoles);


module.exports = router;