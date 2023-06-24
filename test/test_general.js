const { ethers } = require("hardhat");

async function main() {
    // Get the accounts from Hardhat
    const [deployer, lender, borrower, attestor] = await ethers.getSigners();

    // Deploy the FriendFi contract
    const FriendFi = await ethers.getContractFactory("FriendFi");
    const friendFi = await FriendFi.deploy();

    // Wait for the contract to be mined
    await friendFi.deployed();

    // Mint initial scores for users
    await friendFi.scores(deployer.address, 100);
    await friendFi.scores(lender.address, 100);
    await friendFi.scores(borrower.address, 100);
    await friendFi.scores(attestor.address, 100);

    // Create a loan
    await friendFi.create_loan(
        50, // scoreStaked
        30, // daystoExpiry
        7, // daysToPayBack
        5, // interest
        "0x123...ABCD", // asset_address
        1000 // amountOwed
    );

    // Lend to the borrower
    await friendFi.connect(lender).lend(borrower.address, 0);

    // Attest the loan
    await friendFi.connect(attestor).attest(borrower.address, 0, 20);

    // Repay the loan
    await friendFi.connect(borrower).repay(0);

    // Settle the loan
    await friendFi
        .connect(lender)
        .settle(borrower.address, 0, 25, 20);

    // Retrieve the final scores
    const borrowerScore = await friendFi.scores(borrower.address);
    const attestorScore = await friendFi.scores(attestor.address);

    console.log("Final scores - Borrower:", borrowerScore.toString());
    console.log("Final scores - Attestor:", attestorScore.toString());
}

// Run the main function
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
