const express = require('express');
const { check, validationResult } = require('express-validator');

const Users = require('../controllers/users');

const router = express.Router();

router.get('/types', Users.getUserTypes);

router.get('/search', Users.search);

router.post('/', [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('email').not().isEmpty().withMessage('Email is required'),
    check('password').not().isEmpty().withMessage('Password is required'),
    check('type').isIn(["Happy", "Content", "Neutral", "Sad", "Angry"]).withMessage('Incorrect Input'),
    check('sex').isIn(["Female", "Male"]).withMessage('Incorrect Input')
], Users.createUser);

router.post('/login', [
    check('email').not().isEmpty().withMessage('Email is required'),
    check('password').not().isEmpty().withMessage('Password is required')
], Users.loginUser);

module.exports = router;
