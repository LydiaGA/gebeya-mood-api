const express = require('express');
const Reasons = require('../controllers/reasons');
const { check, validationResult } = require('express-validator');

const router = express.Router();


router.get('/:type', Reasons.getReasons);

router.post('/', [
    check('title').not().isEmpty().withMessage('Title is required'),
    check('type').not().isEmpty().withMessage('Type is required'),
], Reasons.saveReason);

module.exports = router;