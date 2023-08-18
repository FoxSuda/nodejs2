const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/signup', userController.registration);
router.post('/signin', userController.login);
router.get('/logout', authMiddleware, userController.logout);
router.get('/info', authMiddleware, userController.info);
router.get('/latency', authMiddleware, userController.latency);
router.get('/auth', authMiddleware, userController.check);

module.exports = router;