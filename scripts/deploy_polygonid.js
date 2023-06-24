const { ethers } = require("hardhat");

async function main() {
    const FriendFi_raw = await ethers.getContractFactory("FriendFiPolygonId");
    const FriendFi = await FriendFi_raw.deploy();

    console.log("FriendFi PolygonId deployed to:", FriendFi.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });