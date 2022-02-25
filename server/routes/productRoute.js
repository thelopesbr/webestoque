const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');



router.get('/', productController.get);
router.get('/:id',productController.getById);
router.post('/', productController.post);
router.post('/:id', productController.put);
router.get('/remove/:id', productController.delete);
router.get('/lower/:id', productController.lower);
router.get('/add/:id', productController.add);

module.exports = router;