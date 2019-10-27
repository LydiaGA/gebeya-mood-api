const express = require('express');
const { check, validationResult } = require('express-validator');

const Moods = require('../controllers/moods');
const checkAuth = require('../lib/check_auth');

const router = express.Router();

router.get('/choices', checkAuth, Moods.getChoices);

router.get('/:id', checkAuth, Moods.getMood);

router.get('/search', [
    check('filter').not().isEmpty().withMessage('Filter is required'), 
    check('page').isInt().withMessage('Page should be a number'),
    check('limit').isInt().withMessage('Limit should be a number'),
    check('sort').not().isEmpty().withMessage('Sort is required')
], checkAuth, Moods.getMoods);

router.get('/count', [
    check('filter').not().isEmpty().withMessage('Filter is required') //add validation for value being required
], checkAuth, Moods.getMoodCount);

router.post('/', [
    check('user').not().isEmpty().withMessage('User is required'), //check for proper id
    check('reason').not().isEmpty().withMessage('Reason is required'),
    check('value').not().isEmpty().withMessage('Value is required'),
    check('value').isIn(["Happy", "Content", "Neutral", "Sad", "Angry"]).withMessage('Incorrect Input')
], checkAuth, Moods.saveMood);

module.exports = router;
