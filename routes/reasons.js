const express = require('express');
const Reasons = require('../controllers/reasons');

const router = express.Router();


router.get('/:type', Reasons.getReasons);

router.post('/', Reasons.saveReason);

module.exports = router;