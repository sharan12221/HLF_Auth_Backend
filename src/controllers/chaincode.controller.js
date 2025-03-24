const { validationResult } = require('express-validator');
const fabricContract = require('../utils/fabric-contract');
const logger = require('../utils/logger');

exports.query = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { functionName, args } = req.body;
    const result = await fabricContract.queryChaincode(
      req.user.username,
      functionName,
      ...args
    );

    res.json({
      success: true,
      result
    });
  } catch (error) {
    logger.error('Chaincode query error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error querying chaincode'
    });
  }
};

exports.invoke = async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { functionName, args } = req.body;
    const result = await fabricContract.invokeChaincode(
      req.user.username,
      functionName,
      ...args
    );

    res.json({
      success: true,
      result
    });
  } catch (error) {
    logger.error('Chaincode invoke error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error invoking chaincode'
    });
  }
};