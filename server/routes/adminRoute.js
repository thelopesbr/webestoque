const express = require('express');
const router = express.Router();

const adminController = require('../controller/adminController');



router.get('/', adminController.get);
router.get('/company', adminController.getCompany);
router.get('/company/:id', adminController.getById);
router.post('/company', adminController.post);

router.post('/company/:id', adminController.put);

router.get('/company/remove/:id', adminController.delete);



module.exports = router;