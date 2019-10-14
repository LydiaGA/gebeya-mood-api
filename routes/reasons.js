const express = require('express');
const Reasons = require('../controllers/reasons');

const router = express.Router();

router.get('/:type', Reasons.getReasons);

module.exports = router;