const express = require('express');
const { check, validationResult } = require('express-validator');

const Reasons = require('../controllers/reasons');
const checkAuth = require('../lib/check_auth');
const grantAccess = require('../lib/grant_access');

const router = express.Router();


router.get('/:type', checkAuth, Reasons.getReasons);

router.post('/', [
    check('title').not().isEmpty().withMessage('Title is required'),
    check('type').not().isEmpty().withMessage('Type is required'),
], checkAuth, grantAccess('createAny', 'reason'), Reasons.saveReason);

module.exports = router;