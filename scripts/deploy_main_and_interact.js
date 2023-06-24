const { ethers } = require("hardhat");

async function main() {
    const FriendFi_raw = await ethers.getContractFactory("FriendFi");
    const FriendFi = await FriendFi_raw.deploy();

    console.log("FriendFi deployed to:", FriendFi.address);

    const MockToken_raw = await ethers.getContractFactory("MockToken");
    const WETH = await MockToken_raw.deploy("Wrapped ETH", "WETH", 10000000000);
    const USDC = await MockToken_raw.deploy("USD Coin", "USDC", 10000000000);

    console.log("WETH deployed to:", WETH.address);
    console.log("USDC deployed to:", USDC.address);

    FriendFi.initialize_user();
    FriendFi.create_loan(
        30,
        86400,
        86400,
        WETH.address,
        1000
    );

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });