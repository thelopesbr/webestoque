const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');


router.get('/', userController.get);
router.get('/:id',userController.getById);

router.post('/', userController.post);
router.post('/:id', userController.put);

router.get('/remove/:id', userController.delete);


module.exports = router;