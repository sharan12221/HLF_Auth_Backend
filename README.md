# HLF_Auth_Backend
This is sample backend for hlf with jwt.

create .env 
```
ADMIN_USER=admin
ADMIN_USER_PASSWORD=adminpw 

# app
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key
JWT_EXPIRATION=24h

# fabric
FABRIC_CA_URL=https://localhost:7054
FABRIC_PEER_URL=grpc://localhost:7051
FABRIC_MSP_ID=Org1MSP
FABRIC_CHANNEL_NAME=mychannel
FABRIC_CHAINCODE_NAME=basic
FABRIC_CONNECTION_PROFILE_PATH=/home/azureuser/auth/HLF_Auth_Backend/src/config/connection-org1.json

# security
# rateLimit
windowMs=15 * 60 * 1000
max=100```

after user login pass the user token through authorization Token

