const express = require('express');
const Users = require('../controllers/users');

const router = express.Router();

router.post('/', Users.createUser);

router.post('/login', Users.loginUser);

module.exports = router;
