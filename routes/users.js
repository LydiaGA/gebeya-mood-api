const express = require('express');
const { check, validationResult } = require('express-validator');

const Users = require('../controllers/users');

const router = express.Router();

router.post('/', [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('email').not().isEmpty().withMessage('Email is required'),
    check('password').not().isEmpty().withMessage('Password is required')
], Users.createUser);

router.post('/login', [
    check('email').not().isEmpty().withMessage('Email is required'),
    check('password').not().isEmpty().withMessage('Password is required')
], Users.loginUser);

module.exports = router;
