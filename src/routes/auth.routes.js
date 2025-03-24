const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');

const router = express.Router();

const validateRegistration = [
  body('username').isLength({ min: 3 }).trim().escape(),
  body('password').isLength({ min: 6 })
];

router.post('/register', validateRegistration, authController.register);
router.post('/login', validateRegistration, authController.login);

module.exports = router;