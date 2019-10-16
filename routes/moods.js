const express = require('express');
const { check, validationResult } = require('express-validator');

const Moods = require('../controllers/moods');

const router = express.Router();

router.get('/choices', Moods.getChoices);

router.post('/', [
    check('user').not().isEmpty().withMessage('User is required'), //check for proper id
    check('reason').not().isEmpty().withMessage('Reason is required'),
    check('value').not().isEmpty().withMessage('Value is required'),
    check('value').isIn(["Happy", "Content", "Neutral", "Sad", "Angry"]).withMessage('Incorrect Input')
], Moods.saveMood);

module.exports = router;
