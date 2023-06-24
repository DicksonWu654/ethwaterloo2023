const { ethers } = require("hardhat");
require('dotenv').config()

const SISMO_APP_ID = process.env.SISMO_APP_ID


async function main() {
    const FriendFi_raw = await ethers.getContractFactory("FriendFiSismo");
    const FriendFi = await FriendFi_raw.deploy(SISMO_APP_ID);

    console.log("FriendFi Sismo deployed to:", FriendFi.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });