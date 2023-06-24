// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./friendfi_general.sol";
import "./IWorldID.sol";

contract FriendFiWorldCoin is FriendFi {
    mapping(address => bool) public verified_worldcoin_users;
    IWorldID public worldID;

    constructor(address _worldID) {
        worldID = IWorldID(_worldID);
    }

    function whitelist_yourself(
        uint256 root,
        uint256 groupId,
        uint256 signalHash,
        uint256 nullifierHash,
        uint256 externalNullifierHash,
        uint256[8] calldata proof
    ) public {
        worldID.verifyProof(
            root,
            groupId,
            signalHash,
            nullifierHash,
            externalNullifierHash,
            proof
        );
        verified_worldcoin_users[msg.sender] = true;
    }

    function create_loan(
        uint256 scoreStaked,
        uint256 daystoExpiry,
        uint256 daysToPayBack,
        uint256 interest,
        address asset_address,
        uint256 amountOwed
    ) public override {
        require(scores[msg.sender] >= scoreStaked, "Insufficient score");
        require(
            verified_worldcoin_users[msg.sender],
            "You must be a verified worldcoin user"
        );

        Loan memory newLoan = Loan({
            expirationDate: block.timestamp + daystoExpiry * 1 days,
            daysToPayBack: daysToPayBack,
            loan_termination_date: 0,
            interest: interest,
            settled: false,
            started: false,
            asset_address: asset_address,
            amountOwed: amountOwed,
            lender: 0x0000000000000000000000000000000000000000,
            scoreStakedOg: scoreStaked,
            attestor_address: 0x0000000000000000000000000000000000000000,
            scoreStakedAttestor: 0
        });

        loans[msg.sender].push(newLoan);
    }

    function lend(address borrower, uint256 loanIndex) public override {
        require(
            verified_worldcoin_users[msg.sender],
            "You must be a verified worldcoin user"
        );
        require(loanIndex < loans[borrower].length, "Invalid loan index");
        require(!loans[borrower][loanIndex].settled, "Loan already settled");
        require(!loans[borrower][loanIndex].started, "Loan already started");

        IERC20 token = IERC20(loans[borrower][loanIndex].asset_address);
        token.transferFrom(
            msg.sender,
            borrower,
            loans[borrower][loanIndex].amountOwed
        );

        loans[borrower][loanIndex].lender = msg.sender;
        loans[borrower][loanIndex].started = true;
        loans[borrower][loanIndex].loan_termination_date =
            block.timestamp +
            loans[borrower][loanIndex].daysToPayBack *
            1 days;
    }

    function attest(
        address borrower,
        uint256 loanIndex,
        uint256 scoreStaked
    ) public override {
        require(
            verified_worldcoin_users[msg.sender],
            "You must be a verified worldcoin user"
        );
        require(scores[msg.sender] >= scoreStaked, "Insufficient score");
        require(loanIndex < loans[borrower].length, "Invalid loan index");
        require(!loans[borrower][loanIndex].settled, "Loan already settled");
        require(!loans[borrower][loanIndex].started, "Loan already started");

        loans[borrower][loanIndex].attestor_address = msg.sender;
        loans[borrower][loanIndex].scoreStakedAttestor = scoreStaked;
    }
}
