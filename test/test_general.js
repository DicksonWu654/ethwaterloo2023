const { expect } = require("chai");

describe("FriendFi", function () {
    let FriendFi;
    let friendFi;
    let MockToken;
    let mockToken;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        FriendFi = await ethers.getContractFactory("FriendFi");
        MockToken = await ethers.getContractFactory("MockToken");
        [owner, addr1, addr2, addr3] = await ethers.getSigners();

        mockToken = await MockToken.deploy("Mock Token", "MTK", 100000);
        await mockToken.deployed();

        friendFi = await FriendFi.deploy();
        await friendFi.deployed();
    });

    it("should create a loan", async function () {
        await friendFi.connect(addr1).initialize_user();
        await friendFi.connect(addr1).create_loan(
            50,
            86400,
            86400,
            mockToken.address,
            100
        );

        const loans = await friendFi.loans(0);
        expect(loans.borrower).to.equal(addr1.address);
        expect(loans.expirationDate).to.be.above(0);
        expect(loans.timeToPayBack).to.equal(86400);
        expect(loans.loan_termination_date).to.equal(0);
        expect(loans.settled).to.equal(false);
        expect(loans.started).to.equal(false);
        expect(loans.asset_address).to.equal(mockToken.address);
        expect(loans.amountOwed).to.equal(100);
        expect(loans.lender).to.equal("0x0000000000000000000000000000000000000000");
        expect(loans.scoreStakedOg).to.equal(50);
        expect(loans.attestor_address).to.equal("0x0000000000000000000000000000000000000000");
        expect(loans.scoreStakedAttestor).to.equal(0);
    });

    it("should lend a loan", async function () {
        await friendFi.connect(addr1).initialize_user();
        await friendFi.connect(addr1).create_loan(
            50,
            86400,
            86400,
            mockToken.address,
            100
        );

        await mockToken.transfer(addr2.address, 1000);
        await mockToken.connect(addr2).approve(friendFi.address, 1000);

        await friendFi.connect(addr2).lend(0);

        const loans = await friendFi.loans(0);
        expect(loans.lender).to.equal(addr2.address);
        expect(loans.started).to.equal(true);
        expect(loans.loan_termination_date).to.be.above(0);
        expect(await mockToken.balanceOf(addr1.address)).to.equal(100);
    });

    it("should attest a loan", async function () {
        await friendFi.connect(addr1).initialize_user();
        await friendFi.connect(addr1).create_loan(
            50,
            86400,
            86400,
            mockToken.address,
            100
        );

        await friendFi.connect(addr2).initialize_user();

        await friendFi.connect(addr2).attest(0, 50);

        const loans = await friendFi.loans(0);
        expect(loans.attestor_address).to.equal(addr2.address);
        expect(loans.scoreStakedAttestor).to.equal(50);
    });

    it("should repay a loan", async function () {
        await friendFi.connect(addr1).initialize_user();
        await friendFi.connect(addr1).create_loan(
            50,
            86400,
            86400,
            mockToken.address,
            100
        );

        await mockToken.transfer(addr2.address, 1000);
        await mockToken.connect(addr2).approve(friendFi.address, 1000);
        await friendFi.connect(addr2).lend(0);

        await mockToken.connect(addr1).approve(friendFi.address, 1000);
        await friendFi.connect(addr1).repay(0);

        const loans = await friendFi.loans(0);
        expect(loans.settled).to.equal(true);

        const addr1Balance = await mockToken.balanceOf(addr1.address);
        const addr2Balance = await mockToken.balanceOf(addr2.address);
        expect(addr1Balance).to.equal(0);
        expect(addr2Balance).to.equal(1000);
    });

    it("should settle a loan", async function () {
        await friendFi.connect(addr1).initialize_user();
        await friendFi.connect(addr1).create_loan(
            50,
            0,
            86400,
            mockToken.address,
            100
        );

        await friendFi.connect(addr1).initialize_user();
        await friendFi.connect(addr1).create_loan(
            50,
            0,
            86400,
            mockToken.address,
            100
        );

        await friendFi.connect(addr2).initialize_user();
        await friendFi.connect(addr2).attest(1, 50);

        await mockToken.transfer(addr3.address, 100);
        await mockToken.connect(addr3).approve(friendFi.address, 100);
        await friendFi.connect(addr3).lend(1);

        // wait 1 day
        await ethers.provider.send("evm_increaseTime", [86401]);

        await friendFi.connect(addr3).settle(1, 50, 30);

        const loan = await friendFi.loans(1);

        expect(loan.settled).to.equal(true);

        // get the trust score of addr1
        const trustScore = await friendFi.scores(addr1.address);
        expect(trustScore).to.equal(0);
        // get the trust score of addr2
        const trustScore2 = await friendFi.scores(addr2.address);
        expect(trustScore2).to.equal(20);

        // get balance of addr1
        const addr1Balance = await mockToken.balanceOf(addr1.address);
        expect(addr1Balance).to.equal(100);
    });
});
