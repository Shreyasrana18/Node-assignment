const express = require('express');
const validateToken = require('../middleware/validateToken');
const { addMember, deleteMember } = require('../controllers/memberController');

const router = express.Router();

router.post('/',validateToken, addMember);
router.delete('/:id',validateToken, deleteMember);

module.exports = router;