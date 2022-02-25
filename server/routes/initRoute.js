
const express = require('express');
const router = express.Router();
const initController = require('../controller/initController')

const auth = require('../middlewares/auth');

router.get('/', initController.get);

router.get('/start', auth.start, initController.start);

module.exports = router;