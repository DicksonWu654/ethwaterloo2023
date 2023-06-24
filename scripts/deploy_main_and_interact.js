const { ethers } = require("hardhat");

async function main() {
    const FriendFi_raw = await ethers.getContractFactory("FriendFi");
    const FriendFi = await FriendFi_raw.deploy();
    await FriendFi.deployed();

    console.log("FriendFi deployed to:", FriendFi.address);

    const MockToken_raw = await ethers.getContractFactory("MockToken");
    const WETH = await MockToken_raw.deploy("Wrapped ETH", "WETH", 10000000000);
    await WETH.deployed();
    const USDC = await MockToken_raw.deploy("USD Coin", "USDC", 10000000000);
    await USDC.deployed();

    console.log("WETH deployed to:", WETH.address);
    console.log("USDC deployed to:", USDC.address);

    const initialize_tx_hash = await FriendFi.initialize_user();
    await initialize_tx_hash.wait();
    console.log("User initialized at txhash:", initialize_tx_hash.hash);

    const loan_tx_hash = await FriendFi.create_loan(
        30,
        86400,
        86400,
        WETH.address,
        1000
    );
    console.log("Loan created at txhash:", loan_tx_hash.hash);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });