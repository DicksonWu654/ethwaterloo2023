// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FriendFi {
    // TODo figure out how to do the array thing / arbitrary amount of attestors

    struct Loan {
        uint256 expirationDate;
        uint256 daysToPayBack;
        uint256 loan_termination_date;
        uint256 interest;
        bool settled;
        bool started;
        address asset_address;
        uint256 amountOwed;
        address lender;
        uint256 scoreStakedOg;
        address attestor_address;
        uint256 scoreStakedAttestor;
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
    ) public virtual {
        require(scores[msg.sender] >= scoreStaked, "Insufficient score");

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

    function lend(address borrower, uint256 loanIndex) public virtual {
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
    ) public virtual {
        require(scores[msg.sender] >= scoreStaked, "Insufficient score");
        require(loanIndex < loans[borrower].length, "Invalid loan index");
        require(!loans[borrower][loanIndex].settled, "Loan already settled");
        require(!loans[borrower][loanIndex].started, "Loan already started");

        loans[borrower][loanIndex].attestor_address = msg.sender;
        loans[borrower][loanIndex].scoreStakedAttestor = scoreStaked;
    }

    function repay(uint256 loanIndex) public {
        require(loanIndex < loans[msg.sender].length, "Invalid loan index");
        require(!loans[msg.sender][loanIndex].settled, "Loan already settled");
        require(loans[msg.sender][loanIndex].started, "Loan not started");

        IERC20 token = IERC20(loans[msg.sender][loanIndex].asset_address);
        token.transferFrom(
            msg.sender,
            loans[msg.sender][loanIndex].lender,
            // make sure payback has interest
            (((loans[msg.sender][loanIndex].amountOwed *
                (100 + loans[msg.sender][loanIndex].interest)) / 100) *
                loans[msg.sender][loanIndex].daysToPayBack) / 365
        );

        loans[msg.sender][loanIndex].settled = true;

        // TODO implement an algorithm for increase the score
        scores[msg.sender] += 1;
        scores[loans[msg.sender][loanIndex].lender] += 1;
    }

    function settle(
        address borrower,
        uint256 loanIndex,
        uint256 scoreToBurnOG,
        uint256 scoreToBurnAttestor
    ) public {
        require(msg.sender == loans[borrower][loanIndex].lender, "Not lender");
        require(
            loans[borrower][loanIndex].scoreStakedOg >= scoreToBurnOG,
            "Insufficient score OG"
        );
        require(
            loans[borrower][loanIndex].scoreStakedAttestor >=
                scoreToBurnAttestor
        );
        require(loanIndex < loans[borrower].length, "Invalid loan index");
        require(!loans[borrower][loanIndex].settled, "Loan already settled");
        require(loans[borrower][loanIndex].started, "Loan not started");
        require(
            loans[borrower][loanIndex].loan_termination_date < block.timestamp,
            "Loan not yet due"
        );

        loans[borrower][loanIndex].settled = true;

        // subtraction, but if we're subtracting more than they have make it 0:

        if (scores[borrower] < scoreToBurnOG) {
            scores[borrower] = 0;
        } else {
            scores[borrower] -= scoreToBurnOG;
        }

        if (
            scores[loans[borrower][loanIndex].attestor_address] <
            scoreToBurnAttestor
        ) {
            scores[loans[borrower][loanIndex].attestor_address] = 0;
        } else {
            scores[
                loans[borrower][loanIndex].attestor_address
            ] -= scoreToBurnAttestor;
        }
    }
}
