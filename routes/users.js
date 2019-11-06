const express = require('express');
const { check, validationResult } = require('express-validator');

const Users = require('../controllers/users');
const grantAccess = require('../lib/grant_access');
const checkAuth = require('../lib/check_auth');

const router = express.Router();

router.get('/teams', Users.getTeams);

router.get('/profile', checkAuth, Users.profile);

router.put('/profile', checkAuth, Users.updateProfile);

router.get('/search', [
    check('filter').not().isEmpty().withMessage('Filter is required'), 
    check('page').isInt().withMessage('Page should be a number'),
    check('limit').isInt().withMessage('Limit should be a number'),
], checkAuth, grantAccess('readAny', 'user'), Users.search);

router.get('/:id', checkAuth, grantAccess('readAny', 'user'), Users.getUser);

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
