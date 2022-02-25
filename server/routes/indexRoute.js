
const express = require('express');
const router = express.Router();
const indexController = require('../controller/indexController');

const auth = require('../middlewares/auth')


router.get('/',auth.format ,indexController.get);
router.post('/', indexController.post);

module.exports = router;