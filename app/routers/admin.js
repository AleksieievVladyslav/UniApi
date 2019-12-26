const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const checkAuth = require('../middleware/check-auth');

router.get('/:id', checkAuth, adminController.get_by_id)
router.post('/signup', adminController.signup);
router.post('/signin', adminController.signin);
router.patch('/:id', checkAuth, adminController.patch);
router.delete('/:id', checkAuth, adminController.delete);

module.exports = router;