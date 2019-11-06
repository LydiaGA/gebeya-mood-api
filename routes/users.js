const express = require('express');
const { check, validationResult } = require('express-validator');

const Users = require('../controllers/users');
const grantAccess = require('../lib/grant_access');
const checkAuth = require('../lib/check_auth');

const router = express.Router();

/**
 * @api {get} /users/teams  Get List of Teams
 * @apiName Get List of Teams
 *
 *
 * @apiSuccess {String[]} _id  teams List of Teams
 *
 * @apiSuccessExample {json} Success-Response:
 * 	 HTTP/1.1 200 OK
 * 	 {
 * 		"Student",
 *      "Staff",
 *      "Talent",
 *      "Contractor"
 * 	 }
 *
 */
router.get('/teams', Users.getTeams);

router.get('/profile', checkAuth, Users.profile);

router.put('/profile', checkAuth, Users.updateProfile);

router.get('/search', [
    check('filter').not().isEmpty().withMessage('Filter is required'), 
    check('page').isInt().withMessage('Page should be a number'),
    check('limit').isInt().withMessage('Limit should be a number'),
], checkAuth, grantAccess('readAny', 'user'), Users.search);

router.get('/:id', checkAuth, grantAccess('readAny', 'user'), Users.getUser);

/**
 * @api {post} /users  Create User
 * @apiName CreateUser
 *
 * @apiParam {String} name
 * @apiParam {String} email
 * @apiParam {String} password 
 *
 * @apiParamExample {json} Request-Example:
 * 	 {
 *    "name" : "User 1"
 * 		"phone_number": "00001",
 * 		"password": "1234",
 * 	 }
 *
 * @apiSuccess {String} _id  
 * @apiSuccess {String} name 
 * @apiSuccess {String} phone_number 
 * @apiSuccess {String} password
 * @apiSuccess {Date} date_created 
 * @apiSuccess {Date} date_modified 
 *
 * @apiSuccessExample {json} Success-Response:
 * 	 HTTP/1.1 201 Created
 * 	 {
 * 		 "_id": '5dbff75a17a0f60e402361b4',
 *    "name": "User 1"
 * 		"phone_number": "00001",
 *  	"password": "$2b$10$g9585.6JHFzK/oymuH90pujQ5jdDspGPQUpwlBX4/uIk8j4eLZ42q",
 * 		"date_created": 2019-11-04T10:03:06.108Z,
 * 		"date_modified": 2019-11-04T10:03:06.108Z,
 * 	 }
 *
 */
router.post('/', [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('email').not().isEmpty().withMessage('Email is required'),
    check('password').not().isEmpty().withMessage('Password is required'),
    check('team').isIn(["Student", "Staff", "Talent", "Contractor"]).withMessage('Incorrect Input'),
    check('sex').isIn(["Female", "Male"]).withMessage('Incorrect Input'),
    check('role').isEmpty().withMessage('Role is read-only'),
], Users.createUser);

router.post('/login', [
    check('email').not().isEmpty().withMessage('Email is required'),
    check('password').not().isEmpty().withMessage('Password is required')
], Users.loginUser);

module.exports = router;
