const jwt = require('jsonwebtoken');
const config = require('../config');
const logger = require('../utils/logger');
const fabricCAUtil = require('../utils/fabric-ca');
const { Wallets } = require('fabric-network');
require('dotenv').config();

const ADMIN_USER = process.env.ADMIN_USER || "admin";

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers['x-access-token'] || req.headers['authorization'];

    if (!token) {
      return res.status(403).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    const decoded = jwt.verify(
      token.replace('Bearer ', ''), 
      config.app.jwtSecret
    );

    // Get user's certificate from wallet and validate it
    const wallet = await Wallets.newFileSystemWallet(config.fabric.walletPath);
    const identity = await wallet.get(decoded.username);

    const adminIdentity = await wallet.get(ADMIN_USER);

    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, ADMIN_USER);

    if (!identity) {
      return res.status(401).json({
        success: false,
        message: 'User identity not found'
      });
    }

    // Validate certificate
    await fabricCAUtil.validateCertificate(identity.credentials.certificate, adminUser);

    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: error.message || 'Invalid or expired token'
    });
  }
};

module.exports = verifyToken;