var express = require('express');
var loginController = require('../controllers/login.controller');
var router = express.Router();

router.post('/login', loginController.login);
router.post('/logout', loginController.logout);
router.get('/token/validate', loginController.validateToken);
router.post('/token/refresh',loginController.refreshToken );

module.exports = router;