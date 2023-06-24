const { ethers } = require("hardhat");

async function main() {
    const FriendFi_raw = await ethers.getContractFactory("FriendFiWorldCoin");
    const FriendFi = await FriendFi_raw.deploy("0x719683F13Eeea7D84fCBa5d7d17Bf82e03E3d260"); // mumbai.id.worldcoin.eth

    console.log("FriendFi Worldcoin deployed to:", FriendFi.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });