require("@nomicfoundation/hardhat-toolbox");
// require("@nomicfoundation/hardhat-verify");
require('dotenv').config()

const POLYGON_ZK_EVM_TESTNET_URL = process.env.POLYGON_ZK_EVM_TESTNET_URL //quicknode
const POLYGON_MUMBIA_URL = process.env.POLYGON_MUMBIA_URL //quicknode
const LINEA_URL = process.env.LINEA_URL //chainlist
const GNOSIS_CHIADO_URL = process.env.GNOSIS_CHIADO_URL //chainlist
const XDC_APOTHEM_URL = process.env.XDC_APOTHEM_URL //chainlist

const POLYGON_ZK_EVM_ETHERSCAN_API_KEY = process.env.POLYGON_ZK_EVM_ETHERSCAN_API_KEY
const POLYGON_MUMBIA_ETHERSCAN_API_KEY = process.env.POLYGON_MUMBIA_ETHERSCAN_API_KEY
const LINEA_ETHERSCAN_API_KEY = process.env.LINEA_ETHERSCAN_API_KEY
const GNOSIS_CHIADO_ETHERSCAN_API_KEY = process.env.GNOSIS_CHIADO_ETHERSCAN_API_KEY
const XDC_APOTHEM_ETHERSCAN_API_KEY = process.env.XDC_APOTHEM_ETHERSCAN_API_KEY

const PRIVATE_KEY = process.env.PRIVATE_KEY
const XDC_PRIVATE_KEY = process.env.XDC_PRIVATE_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        // runs: 2 ** 32 - 1,
      },
    },
  },
  networks: {
    polygon_zk_evm_testnet: {
      url: `${POLYGON_ZK_EVM_TESTNET_URL}`,
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 1442,
    },
    polygon_mumbai: { // had a lot of problems with mumbia
      url: `${POLYGON_MUMBIA_URL}`,
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 80001,
      // gasPrice: 10000000000,
      gasMultiplier: 100,
      // gas: 2000000,
    },
    linea: {
      url: `${LINEA_URL}`,
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 59140,
    },
    gnosis_chiado: {
      url: `${GNOSIS_CHIADO_URL}`,
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 10200,
      gasPrice: 100,
    },
    xdc_apothem: {
      url: `${XDC_APOTHEM_URL}`,
      accounts: [`0x${XDC_PRIVATE_KEY}`],
      chainId: 51,
    }
  },
  etherscan: {
    apiKey: {
      polygon_zk_evm_testnet: `${POLYGON_ZK_EVM_ETHERSCAN_API_KEY}`,
      polygon_mumbai: `${POLYGON_MUMBIA_ETHERSCAN_API_KEY}`,
      linea: `${LINEA_ETHERSCAN_API_KEY}`,
      gnosis_chiado: `${GNOSIS_CHIADO_ETHERSCAN_API_KEY}`,
      xdc_apothem: `${XDC_APOTHEM_ETHERSCAN_API_KEY}`,
    },
    customChains: [
      {
        network: "polygon_zk_evm_testnet",
        chainId: 1442,
        urls: {
          apiURL: "https://api-testnet-zkevm.polygonscan.com/api",
          browserURL: "https://testnet-zkevm.polygonscan.com"
        }
      },
      {
        network: "polygon_mumbai",
        chainId: 80001,
        urls: {
          apiURL: "https://api-testnet.polygonscan.com/api",
          browserURL: "https://mumbai.polygonscan.com/"
        }
      },
      {
        network: "linea",
        chainId: 59140,
        urls: {
          apiURL: "https://api-testnet.lineascan.build/api",
        }
      },
      {
        network: "gnosis_chiado",
        chainId: 10200,
        urls: {
          apiURL: "https://blockscout.com/gnosis/chiado/api",
        }
      },
      {
        network: "xdc_apothem",
        chainId: 51,
        urls: {
          apiURL: "https://xdc.blocksscan.io/api",
        }
      }
    ]
  }

};