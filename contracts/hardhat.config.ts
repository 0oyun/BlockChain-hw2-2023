import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";


const config: HardhatUserConfig = {
  solidity: "0.8.20",
  defaultNetwork: "ganache",
  networks: {
    
    ganache: {
      // rpc url, change it according to your ganache configuration
      url: 'http://127.0.0.1:7545',
      // the private key of signers, change it according to your ganache user
      accounts: [
        '0x3b4d6fd9fddaa20fe861200cce93b3bd3d2fda5c536bea68edc7e07930214f68'
      ]
    },
  },
};

export default config;
