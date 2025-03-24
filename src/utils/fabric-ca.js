const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const config = require('../config');
const logger = require('./logger');
require('dotenv').config();

const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_USER_PASSWORD = process.env.ADMIN_USER_PASSWORD || "adminpw";

class FabricCAUtil {
  constructor() {
    this.caURL = config.fabric.caUrl;
    this.ca = new FabricCAServices(this.caURL);
    this.walletPath = config.fabric.walletPath;
  }

  async checkCertificateRevocation(certificate) {
    try {
      const crl = await this.ca.generateCRL();
      // Check if the certificate's serial number is in the CRL
      const isRevoked = crl.getRevokedCertificates().some(
        revokedCert => revokedCert.getUserCertificate().equals(certificate.getSerialNumber())
      );
      return isRevoked;
    } catch (error) {
      logger.error('Error checking certificate revocation:', error);
      throw error;
    }
  }

  async validateCertificate(certificate, adminUser) {
    const request = {
      // revokedAfter: new Date('2020-01-01T00:00:00Z').toISOString(),
      // revokedBefore: new Date().toISOString()
    };

    const crl = await this.ca.generateCRL(request, adminUser);
    console.log('Certificate Revocation List:', crl);

    console.log("crl.includes(certificate: ", crl.includes(certificate))
    return crl.includes(certificate);
  }

  async enrollAdmin() {
    try {
      const wallet = await Wallets.newFileSystemWallet(this.walletPath);
      
      const identity = await wallet.get(ADMIN_USER);
      if (identity) {
        logger.info('Admin already exists in the wallet');
        return;
      }

      const enrollment = await this.ca.enroll({ 
        enrollmentID: ADMIN_USER, 
        enrollmentSecret: ADMIN_USER_PASSWORD 
      });

      await this.validateCertificate(enrollment.certificate);

      const x509Identity = {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
        },
        mspId: config.fabric.mspId,
        type: 'X.509',
      };

      await wallet.put(ADMIN_USER, x509Identity);
      logger.info(`Successfully enrolled ${ADMIN_USER} user`);
    } catch (error) {
      logger.error(`Failed to enroll ${ADMIN_USER} user:`, error);
      throw error;
    }
  }

  async registerUser(username, password) {
    try {
      const wallet = await Wallets.newFileSystemWallet(this.walletPath);
      
      const userIdentity = await wallet.get(username);
      if (userIdentity) {
        throw new Error(`User ${username} already exists`);
      }

      const adminIdentity = await wallet.get(ADMIN_USER);
      if (!adminIdentity) {
        throw new Error('Admin must be enrolled before registering a new user');
      }

      const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
      const adminUser = await provider.getUserContext(adminIdentity, ADMIN_USER);

      await this.ca.register({
        affiliation: 'org1.department1',
        enrollmentID: username,
        enrollmentSecret: password,
        role: 'client',
        attrs: [
          { name: 'role', value: 'user', ecert: true }
        ]
      }, adminUser);

      const enrollment = await this.ca.enroll({
        enrollmentID: username,
        enrollmentSecret: password
      });

      await this.validateCertificate(enrollment.certificate, adminUser);

      const x509Identity = {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
        },
        mspId: config.fabric.mspId,
        type: 'X.509',
      };

      await wallet.put(username, x509Identity);
      return true;
    } catch (error) {
      logger.error('Error registering user:', error);
      throw error;
    }
  }
}

module.exports = new FabricCAUtil();