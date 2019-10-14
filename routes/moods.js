const express = require('express');
const Moods = require('../controllers/moods');

const router = express.Router();

router.get('/choices', Moods.getChoices);

router.post('/', Moods.saveMood);

module.exports = router;
