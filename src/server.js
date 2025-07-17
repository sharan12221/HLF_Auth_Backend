const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
// const rateLimit = require('express-rate-limit');
const config = require('./config');
const logger = require('./utils/logger');
const fabricCAUtil = require('./utils/fabric-ca');

const authRoutes = require('./routes/auth.routes');
const chaincodeRoutes = require('./routes/chaincode.routes');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
// app.use(rateLimit(config.security.rateLimit));

// Logging middleware
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chaincode', chaincodeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

const PORT = config.app.port;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  
  // Enroll admin on server start
  fabricCAUtil.enrollAdmin().catch(err => {
    logger.error('Failed to enroll admin:', err);
    process.exit(1);
  });
});

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Manorma CDSS API.................................',
  });
});
