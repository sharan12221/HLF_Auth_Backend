const express = require('express');
const { body } = require('express-validator');
const chaincodeController = require('../controllers/chaincode.controller');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const validateChaincode = [
  body('functionName').notEmpty().trim(),
  body('args').isArray()
];

router.post('/query', authMiddleware, validateChaincode, chaincodeController.query);
router.post('/invoke', authMiddleware, validateChaincode, chaincodeController.invoke);

module.exports = router;