const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = require('express').Router();

router.patch('/:userId', authMiddleware(['user', 'admin']), userController.updateUser);

module.exports = router;