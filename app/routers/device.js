const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');


router.get('/byId/:id', deviceController.get_by_id)
router.get('/byTypeId/:id', deviceController.get_by_typeId)
router.post('/', deviceController.post)
router.patch('/:id', deviceController.patch)
router.delete('/:id', deviceController.delete)

module.exports = router;