const { Gateway, Wallets } = require('fabric-network');
const config = require('../config');
const logger = require('./logger');
const fs = require("fs")

class FabricContract {
  constructor() {
    this.channelName = config.fabric.channelName;
    this.chaincodeName = config.fabric.chaincodeName;
    this.walletPath = config.fabric.walletPath;
  }

  async getContract(username) {
    try {
      const wallet = await Wallets.newFileSystemWallet(this.walletPath);
      const identity = await wallet.get(username);

      if (!identity) {
        throw new Error(`User ${username} not found in wallet`);
      }
      
      let ccp = JSON.parse(fs.readFileSync(config.fabric.connectionProfilePath, 'utf8'));

      const gateway = new Gateway();
      await gateway.connect(ccp, {
        wallet,
        identity: username,
        discovery: { enabled: true, asLocalhost: true }
      });

      const network = await gateway.getNetwork(this.channelName);
      return network.getContract(this.chaincodeName);
    } catch (error) {
      logger.error('Error getting contract:', error);
      throw error;
    }
  }

  async queryChaincode(username, functionName, ...args) {
    try {
      const contract = await this.getContract(username);
      const result = await contract.evaluateTransaction(functionName, ...args);
      return JSON.parse(result.toString());
    } catch (error) {
      logger.error('Error querying chaincode:', error);
      throw error;
    }
  }

  async invokeChaincode(username, functionName, ...args) {
    try {
      const contract = await this.getContract(username);
      const result = await contract.submitTransaction(functionName, ...args);
      return JSON.parse(result.toString());
    } catch (error) {
      logger.error('Error invoking chaincode:', error);
      throw error;
    }
  }
}

module.exports = new FabricContract();