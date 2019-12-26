const express = require('express');
const router = express.Router();
const typeController = require('../controllers/typeController');
const checkAuth = require('../middleware/check-auth');


router.get('/:id', typeController.get_by_id);
router.post('/', checkAuth, typeController.post);
router.patch('/:id', typeController.patch);
router.delete('/:id', typeController.delete);

module.exports = router;