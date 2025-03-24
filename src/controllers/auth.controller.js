const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const config = require('../config');
const fabricCAUtil = require('../utils/fabric-ca');
const logger = require('../utils/logger');
const { Wallets } = require('fabric-network');
require('dotenv').config();

const ADMIN_USER = process.env.ADMIN_USER || "admin";

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res. status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { username, password } = req.body;
    await fabricCAUtil.registerUser(username, password);

    const token = jwt.sign(
      { username },
      config.app.jwtSecret,
      { expiresIn: config.app.jwtExpiration }
    );

    res.json({
      success: true,
      message: 'User registered successfully',
      token
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error registering user'
    });
  }
};

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { username, password } = req.body;
    const wallet = await Wallets.newFileSystemWallet(config.fabric.walletPath);
    const identity = await wallet.get(username);

    if (!identity) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed'
      });
    }

    const adminIdentity = await wallet.get(ADMIN_USER);
    if (!adminIdentity) {
      throw new Error('Admin must be enrolled before registering a new user');
    }

    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, ADMIN_USER);

    // Validate certificate
    await fabricCAUtil.validateCertificate(identity.credentials.certificate, adminUser);

    const token = jwt.sign(
      { username },
      config.app.jwtSecret,
      { expiresIn: config.app.jwtExpiration }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error during login'
    });
  }
};