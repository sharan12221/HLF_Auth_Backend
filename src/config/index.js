const path = require('path');
require('dotenv').config();

const config = {
  app: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpiration: process.env.JWT_EXPIRATION || '24h'
  },
  fabric: {
    caUrl: process.env.FABRIC_CA_URL || 'https://localhost:7054',
    peerUrl: process.env.FABRIC_PEER_URL || 'grpc://localhost:7051',
    mspId: process.env.FABRIC_MSP_ID || 'Org1MSP',
    channelName: process.env.FABRIC_CHANNEL_NAME || 'mychannel',
    chaincodeName: process.env.FABRIC_CHAINCODE_NAME || 'basic',
    walletPath: path.join(__dirname, '..', '..', 'wallet'),
    connectionProfilePath: process.env.FABRIC_CONNECTION_PROFILE_PATH || "/home/azureuser/auth/HLF_Auth_Backend/src/config/connection-org1.json"
  },
  security: {
    rateLimit: {
      windowMs: process.env.windowMs || 15 * 60 * 1000, // 15 minutes
      max: process.env.max || 100 // limit each IP to 100 requests per windowMs
    }
  }
};

module.exports = config;
