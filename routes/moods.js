const express = require('express');
const { check, validationResult } = require('express-validator');

const Moods = require('../controllers/moods');
const checkAuth = require('../lib/check_auth');
const grantAccess = require('../lib/grant_access');

const router = express.Router();

router.get('/choices', checkAuth, Moods.getChoices);

router.get('/my-logs', [
    check('filter').not().isEmpty().withMessage('Filter is required'), 
    check('page').isInt().withMessage('Page should be a number'),
    check('limit').isInt().withMessage('Limit should be a number'),
], checkAuth, Moods.myLogs);

router.get('/my-mood-count', [
    check('filter').not().isEmpty().withMessage('Filter is required') 
], checkAuth, Moods.myMoodCount);

router.get('/search', [
    check('filter').not().isEmpty().withMessage('Filter is required'), 
    check('page').isInt().withMessage('Page should be a number'),
    check('limit').isInt().withMessage('Limit should be a number'),
], checkAuth, grantAccess('readAny', 'mood'), Moods.getMoods);

router.get('/count', [
    check('filter').not().isEmpty().withMessage('Filter is required')
], checkAuth, Moods.getMoodCount);

router.post('/', [
    check('reason').not().isEmpty().withMessage('Reason is required'), 
    check('value').not().isEmpty().withMessage('Value is required'),
    check('value').isIn(["Happy", "Content", "Neutral", "Sad", "Angry"]).withMessage('Incorrect Input')
], checkAuth, Moods.saveMood);

module.exports = router;
