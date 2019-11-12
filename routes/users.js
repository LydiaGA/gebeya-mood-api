const express = require('express');
const { check, validationResult } = require('express-validator');

const Users = require('../controllers/users');
const grantAccess = require('../lib/grant_access');
const checkAuth = require('../lib/check_auth');

const router = express.Router();

/**
 * @api {get} /users/teams  Get List of Teams
 * @apiName Get List of Teams
 * @apiGroup User
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

/**
 * @api {get} /users/profile  Get Profile of Current Logged in User
 * @apiName Get Profile of Current Logged in User
 * @apiGroup User
 *
 * @apiSuccess {String} _id 
 * @apiSuccess {String} role  
 * @apiSuccess {String} name 
 * @apiSuccess {String} email 
 * @apiSuccess {String} password
 * @apiSuccess {String} sex
 * @apiSuccess {String} type
 * @apiSuccess {Date} date_created 
 * @apiSuccess {Date} date_modified 
 *
 * @apiSuccessExample {json} Success-Response:
 * 	 HTTP/1.1 200 OK
 * 	 {
 *      "role": "basic",
 *      "_id": "5dc285cd24f187001192d63c",
 *      "name": "User 1",
 *      "email": "user1@example.com",
 *      "password": "$2b$10$DE/xioIWejDlq5tuoFR4quFi4PRJnf2wFPxL1i3Cw5csKCWG/NRLe",
 *      "sex": "Female",
 *      "type": "Student",
 *      "date_created": "2019-11-06T08:35:25.539Z",
 *      "date_modified": "2019-11-06T08:35:25.539Z",
 *      "__v": 0
 *   }
 *
 */
router.get('/profile', checkAuth, Users.profile);

/**
 * @api {put} /users/profile  Edit Profile of Current Logged in User
 * @apiName Edit Profile of Current Logged in User
 * @apiGroup User
 * 
 * @apiParam {String} name
 * @apiParam {String} email
 * @apiParam {String} password 
 * @apiParam {String} sex 
 * @apiParam {String} team 
 *
 * @apiParamExample {json} Request-Example:
 * 	 {
 *      "name" : "User 1 Edited"
 * 	 }
 * 
 * @apiSuccess {String} _id 
 * @apiSuccess {String} role  
 * @apiSuccess {String} name 
 * @apiSuccess {String} email 
 * @apiSuccess {String} password
 * @apiSuccess {String} sex
 * @apiSuccess {String} type
 * @apiSuccess {Date} date_created 
 * @apiSuccess {Date} date_modified 
 *
 * @apiSuccessExample {json} Success-Response:
 * 	 HTTP/1.1 200 OK
 * 	 {
 *      "role": "basic",
 *      "_id": "5dc285cd24f187001192d63c",
 *      "name": "User 1 Edited",
 *      "email": "user1@example.com",
 *      "password": "$2b$10$DE/xioIWejDlq5tuoFR4quFi4PRJnf2wFPxL1i3Cw5csKCWG/NRLe",
 *      "sex": "Female",
 *      "type": "Student",
 *      "date_created": "2019-11-06T08:35:25.539Z",
 *      "date_modified": "2019-11-06T08:35:25.539Z",
 *      "__v": 0
 *   }
 *
 */
router.put('/profile', checkAuth, Users.updateProfile);

/**
 * @api {get} /users/search  Get List of User with the Specified Filters
 * @apiName  Get List of User with the Specified Filters
 * @apiGroup User
 *
 * @apiParam {String} filter Includes Fields: team, sex
 * @apiParam {String} page 
 * @apiParam {String} limit
 * @apiParam {String} sort 
 *
 * @apiParamExample {query} Request-Example:
 *  filter = "{"team" : "Student"}"
 *  page = "1"
 *  limit = "10"
 *  sort = "date_created"   
 *
 * @apiSuccess {Object[]} List of Users
 * @apiSuccess {String} _id 
 * @apiSuccess {String} role  
 * @apiSuccess {String} name 
 * @apiSuccess {String} email 
 * @apiSuccess {String} password
 * @apiSuccess {String} sex
 * @apiSuccess {String} type
 * @apiSuccess {Date} date_created 
 * @apiSuccess {Date} date_modified 
 *
 * @apiSuccessExample {json} Success-Response:
 * 	 HTTP/1.1 200 OK
 * 	 [
 *      {
 *          "role": "basic",
 *          "_id": "5dc285cd24f187001192d63c",
 *          "name": "User 1",
 *          "email": "user1@example.com",
 *          "password": "$2b$10$DE/xioIWejDlq5tuoFR4quFi4PRJnf2wFPxL1i3Cw5csKCWG/NRLe",
 *          "sex": "Female",
 *          "type": "Student",
 *          "date_created": "2019-11-06T08:35:25.539Z",
 *          "date_modified": "2019-11-06T08:35:25.539Z",
 *          "__v": 0
 *      },
 * 
 *      {
 *          "role": "basic",
 *          "_id": "5dc285cd24f187001192d63c",
 *          "name": "Test User",
 *          "email": "user@test.com",
 *          "password": "$2b$10$RkCUzoZZ0ExCs2nbJryTp.b3kEQYIBSWwKMsQaCOgD/kLLK0MVr9W",
 *          "sex": "Female",
 *          "type": "Student",
 *          "date_created": "2019-11-06T08:35:25.539Z",
 *          "date_modified": "2019-11-06T08:35:25.539Z",
 *          "__v": 0
 *      },
 * 
 * ]
 *
 */
router.get('/search', [
    check('filter').not().isEmpty().withMessage('Filter is required'), 
    check('page').isInt().withMessage('Page should be a number'),
    check('limit').isInt().withMessage('Limit should be a number'),
], checkAuth, grantAccess('readAny', 'user'), Users.search);

/**
 * @api {get} /users/:id  Get a User
 * @apiName Get a User
 * @apiGroup User
 * 
 * @apiParam {String} id 
 * 
 * @apiSuccess {String} _id 
 * @apiSuccess {String} role  
 * @apiSuccess {String} name 
 * @apiSuccess {String} email 
 * @apiSuccess {String} password
 * @apiSuccess {String} sex
 * @apiSuccess {String} type
 * @apiSuccess {Date} date_created 
 * @apiSuccess {Date} date_modified 
 *
 * @apiSuccessExample {json} Success-Response:
 * 	 HTTP/1.1 200 OK
 * 	 {
 *      "role": "basic",
 *      "_id": "5dc285cd24f187001192d63c",
 *      "name": "User 1",
 *      "email": "user1@example.com",
 *      "password": "$2b$10$DE/xioIWejDlq5tuoFR4quFi4PRJnf2wFPxL1i3Cw5csKCWG/NRLe",
 *      "sex": "Female",
 *      "type": "Student",
 *      "date_created": "2019-11-06T08:35:25.539Z",
 *      "date_modified": "2019-11-06T08:35:25.539Z",
 *      "__v": 0
 *   }
 *
 */
router.get('/:id', checkAuth, grantAccess('readAny', 'user'), Users.getUser);

/**
 * @api {post} /users  Create User
 * @apiName CreateUser
 * @apiGroup User
 * 
 * @apiParam {String} name
 * @apiParam {String} email
 * @apiParam {String} password 
 * @apiParam {String} sex 
 * @apiParam {String} team 
 *
 * @apiParamExample {json} Request-Example:
 * 	 {
 *      "name" : "User 1"
 * 		"email": "user1@example.com",
 * 		"password": "1234",
 *      "sex": "Female",
 *      "team": "Student",
 * 	 }
 *
 * @apiSuccess {String} _id 
 * @apiSuccess {String} role  
 * @apiSuccess {String} name 
 * @apiSuccess {String} email 
 * @apiSuccess {String} password
 * @apiSuccess {String} sex
 * @apiSuccess {String} type
 * @apiSuccess {Date} date_created 
 * @apiSuccess {Date} date_modified 
 *
 * @apiSuccessExample {json} Success-Response:
 * 	 HTTP/1.1 201 Created
 * 	 {
 *      "role": "basic",
 *      "_id": "5dc285cd24f187001192d63c",
 *      "name": "User 1",
 *      "email": "user1@example.com",
 *      "password": "$2b$10$DE/xioIWejDlq5tuoFR4quFi4PRJnf2wFPxL1i3Cw5csKCWG/NRLe",
 *      "sex": "Female",
 *      "type": "Student",
 *      "date_created": "2019-11-06T08:35:25.539Z",
 *      "date_modified": "2019-11-06T08:35:25.539Z",
 *      "__v": 0
 *   }
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

/**
 * @api {post} /users/login  Login User
 * @apiName Login User
 * @apiGroup User
 * 
 * @apiParam {String} email
 * @apiParam {String} password 
 *
 * @apiParamExample {json} Request-Example:
 * 	 {
 * 		"email": "user1@example.com",
 * 		"password": "1234"
 * 	 }
 * @apiSuccess {String} message 
 * @apiSuccess {String} _id 
 * @apiSuccess {String} role  
 * @apiSuccess {String} name 
 * @apiSuccess {String} email 
 * @apiSuccess {String} password
 * @apiSuccess {String} sex
 * @apiSuccess {String} type
 * @apiSuccess {Date} date_created 
 * @apiSuccess {Date} date_modified 
 * @apiSuccess {String} token 
 *
 * @apiSuccessExample {json} Success-Response:
 * 	 HTTP/1.1 200 OK
 * 	 {
    "message": "Auth Successful",
    "user": {
        "role": "basic",
        "_id": "5dbaa4a753b612001705f448",
        "name": "User 1",
        "email": "user1@example.com",
        "password": "$2b$10$8EBcSqyRbfHtXE2YGK7HSeT11jiJWYo4IuOTmvBY6y05ivBPJzYRO",
        "sex": "Female",
        "type": "Student",
        "date_created": "2019-10-31T09:08:55.178Z",
        "date_modified": "2019-10-31T09:08:55.178Z",
        "__v": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGdlYmV5YW1vb2QuY29tIiwidXNlcklkIjoiNWRiYWE0YTc1M2I2MTIwMDE3MDVmNDQ4Iiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTczMDI4ODc5LCJleHAiOjE1NzMxMTUyNzl9.G33PC8aHDGnPFF_xzdbtDtHvyaJV6gctdwcpmtl1J74"
}
 *
 */
router.post('/login', [
    check('email').not().isEmpty().withMessage('Email is required'),
    check('password').not().isEmpty().withMessage('Password is required')
], Users.loginUser);

module.exports = router;
