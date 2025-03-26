cp /home/azureuser/supplyChain/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json ./src/config
cp /home/azureuser/supplyChain/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.yaml ./src/config

sleep 2

node src/server.js
