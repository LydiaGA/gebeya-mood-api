const express = require('express');
const { check, validationResult } = require('express-validator');

const Moods = require('../controllers/moods');
const checkAuth = require('../lib/check_auth');
const grantAccess = require('../lib/grant_access');

const router = express.Router();

/**
 * @api {get} /moods/choices  Get List of Mood Choices
 * @apiName Get List of Mood Choices
 * @apiGroup Mood
 *
 * @apiSuccess {String[]} choices List of Choices
 *
 * @apiSuccessExample {json} Success-Response:
 * 	 HTTP/1.1 200 OK
 * 	 {
 * 		"Happy",
 *      "Content",
 *      "Neutral",
 *      "Sad",
 *      "Angry"
 * 	 }
 *
 */
router.get('/choices', checkAuth, Moods.getChoices);


/**
 * @api {get} /moods/my-logs  Get List of Moods with the Specified Filters for the Current Logged in User
 * @apiName  Get List of Moods with the Specified Filters for the Current Logged in User
 * @apiGroup Mood
 *
 * @apiParam {String} filter Includes Fields: reason id, date(date, period of time)
 * @apiParam {String} page 
 * @apiParam {String} limit
 * @apiParam {String} sort 
 *
 * @apiParamExample {query} Request-Example:
 *  filter = "{"date" : {"date" : "November 06, 2019", "timeUnit" : "month"}}"
 *  page = "1"
 *  limit = "10"
 *  sort = "date_created"   
 *
 * @apiSuccess {Object[]} List of Moods
 * @apiSuccess {String} user_id 
 * @apiSuccess {String} user_name  
 * @apiSuccess {String} mood 
 * @apiSuccess {String} team 
 * @apiSuccess {String} reason 
 * @apiSuccess {String} date_created 
 * @apiSuccess {String} date_modified 
 *
 * @apiSuccessExample {json} Success-Response:
 * 	 HTTP/1.1 200 OK
 * 	 [
    {
        "user_id": "5db5a09f5d4e830017d0a229",
        "user_name": "User 1 Edited",
        "mood": "Happy",
        "team": "Student",
        "reason": "Good Weather",
        "date_created": "2019-10-27T14:27:23.726Z",
        "date_modified": "2019-10-27T14:27:23.726Z"
    },
    {
        "user_id": "5db5a09f5d4e830017d0a229",
        "user_name": "User 1 Edited",
        "mood": "Content",
        "team": "Student",
        "reason": "Project Going Well",
        "date_created": "2019-10-31T10:31:00.983Z",
        "date_modified": "2019-10-31T10:31:00.983Z"
    }
]
 *
 */
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

router.get('/graph', [
    check('filter').not().isEmpty().withMessage('Filter is required')
], checkAuth, Moods.getGraph);

router.post('/', [
    check('reason').not().isEmpty().withMessage('Reason is required'), 
    check('value').not().isEmpty().withMessage('Value is required'),
    check('value').isIn(["Happy", "Content", "Neutral", "Sad", "Angry"]).withMessage('Incorrect Input')
], checkAuth, Moods.saveMood);

module.exports = router;
