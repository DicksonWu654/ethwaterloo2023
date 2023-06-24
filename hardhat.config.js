require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()

const POLYGON_ZK_EVM_TESTNET_URL = process.env.POLYGON_ZK_EVM_TESTNET_URL //quicknode
const POLYGON_MUMBIA_URL = process.env.POLYGON_MUMBIA_URL //quicknode
const LINEA_URL = process.env.LINEA_URL //chainlist
const GNOSIS_CHIADO_URL = process.env.GNOSIS_CHIADO_URL //chainlist
const XDC_APOTHEM_URL = process.env.XDC_APOTHEM_URL //chainlist

const PRIVATE_KEY = process.env.PRIVATE_KEY
const XDC_PRIVATE_KEY = process.env.XDC_PRIVATE_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 2 ** 32 - 1,
      },
    },
  },
  networks: {
    polygon_zk_evm_testnet: {
      url: `${POLYGON_ZK_EVM_TESTNET_URL}`,
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 1442,
    },
    polygon_mumbai: {
      url: `${POLYGON_MUMBIA_URL}`,
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 80001,
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
    },
    xdc_apothem: {
      url: `${XDC_APOTHEM_URL}`,
      accounts: [`0x${XDC_PRIVATE_KEY}`],
      chainId: 51,
    }
  }
};