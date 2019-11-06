const express = require('express');
const { check, validationResult } = require('express-validator');

const TeamMoods = require('../controllers/team_moods');
const checkAuth = require('../lib/check_auth');
const grantAccess = require('../lib/grant_access');

const router = express.Router();

router.get('/search', [
    check('filter').not().isEmpty().withMessage('Filter is required'), 
    check('page').isInt().withMessage('Page should be a number'),
    check('limit').isInt().withMessage('Limit should be a number'),
    check('sort').not().isEmpty().withMessage('Sort is required')
], checkAuth, TeamMoods.getTeamMoods);

router.post('/', [
    check('name').not().isEmpty().withMessage('Reason is required'), 
    check('total').not().isEmpty().withMessage('Value is required'),
    check('mood').isIn(["Happy", "Content", "Neutral", "Sad", "Angry"]).withMessage('Incorrect Input')
], checkAuth, TeamMoods.saveMood);

router.put('/:id', checkAuth, TeamMoods.updateTeamMood);

module.exports = router;
