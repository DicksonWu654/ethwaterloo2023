// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FriendFi {
    // struct StakeScoreStruct {
    //     address staker;
    //     uint256 scoreStaked;
    // }

    // gonna make a list of StakeScoreStructs for attestations
    struct Loan {
        // StakeScoreStruct[] stake_scores;
        uint256 expirationDate;
        uint256 daysToPayBack;
        uint256 loan_termination_date;
        uint256 interest;
        bool settled;
        bool started;
        address asset_address;
        uint256 amountOwed;
        address lender;
    }

    // make this a soulbound erc20 (if that exists lol)
    mapping(address => uint256) public scores;
    mapping(address => Loan[]) public loans;

    function create_loan(
        uint256 scoreStaked,
        uint256 daystoExpiry,
        uint256 daysToPayBack,
        uint256 interest,
        address asset_address,
        uint256 amountOwed
    ) public {
        require(scores[msg.sender] >= scoreStaked, "Insufficient score");

        // StakeScoreStruct memory stakeScore = StakeScoreStruct({
        //     staker: msg.sender,
        //     scoreStaked: scoreStaked
        // });

        Loan memory newLoan;
        newLoan.expirationDate = block.timestamp + daystoExpiry * 1 days;
        newLoan.daysToPayBack = daysToPayBack;
        newLoan.loan_termination_date = 0;
        newLoan.interest = interest;
        newLoan.settled = false;
        newLoan.started = false;
        newLoan.asset_address = asset_address;
        newLoan.amountOwed = amountOwed;
        newLoan.lender = address(0);

        // newLoan.stake_scores[0] = stakeScore;

        loans[msg.sender].push(newLoan);
    }

    function lend(address borrower, uint256 loanIndex) public {
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
    ) public {
        require(scores[msg.sender] >= scoreStaked, "Insufficient score");
        require(loanIndex < loans[borrower].length, "Invalid loan index");
        require(!loans[borrower][loanIndex].settled, "Loan already settled");
        require(!loans[borrower][loanIndex].started, "Loan already started");

        // StakeScoreStruct memory stakeScore = StakeScoreStruct({
        //     staker: msg.sender,
        //     scoreStaked: scoreStaked
        // });

        // loans[borrower][loanIndex].stake_scores.push(stakeScore);
    }

    function repay(uint256 loanIndex) public {
        require(loanIndex < loans[msg.sender].length, "Invalid loan index");
        require(!loans[msg.sender][loanIndex].settled, "Loan already settled");
        require(loans[msg.sender][loanIndex].started, "Loan not started");

        IERC20 token = IERC20(loans[msg.sender][loanIndex].asset_address);
        token.transferFrom(
            msg.sender,
            loans[msg.sender][loanIndex].lender,
            loans[msg.sender][loanIndex].amountOwed
        );

        loans[msg.sender][loanIndex].settled = true;

        // TODO implement an algorithm for increase the score
        scores[msg.sender] += 1;
        scores[loans[msg.sender][loanIndex].lender] += 1;
    }

    function settle(
        address lender,
        uint256 loanIndex,
        uint256 scoreToBurn
    ) public {
        require(scores[lender] >= scoreToBurn, "Insufficient score");
        require(loanIndex < loans[lender].length, "Invalid loan index");
        require(!loans[lender][loanIndex].settled, "Loan already settled");
        require(loans[lender][loanIndex].started, "Loan not started");
        require(
            loans[lender][loanIndex].loan_termination_date < block.timestamp,
            "Loan not yet due"
        );

        loans[lender][loanIndex].settled = true;
        scores[lender] -= scoreToBurn;
    }
}
