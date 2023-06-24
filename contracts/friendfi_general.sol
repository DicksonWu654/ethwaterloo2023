// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FriendFi {
    // TODo figure out how to do the array thing / arbitrary amount of attestors

    struct Loan {
        address borrower;
        uint256 expirationDate;
        uint256 timeToPayBack;
        uint256 loan_termination_date;
        // uint256 interest;
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
    // mapping(address => Loan[]) public loans;
    Loan[] public loans;

    function initialize_user() public {
        scores[msg.sender] = 50;
    }

    function create_loan(
        uint256 scoreStaked,
        uint256 timeToExpiry,
        uint256 timeToPayBack,
        // uint256 interest,
        address asset_address,
        uint256 amountOwed
    ) public virtual {
        require(scores[msg.sender] >= scoreStaked, "Insufficient score");

        Loan memory newLoan = Loan({
            borrower: msg.sender,
            expirationDate: block.timestamp + timeToExpiry,
            timeToPayBack: timeToPayBack,
            loan_termination_date: 0,
            // interest: interest,
            settled: false,
            started: false,
            asset_address: asset_address,
            amountOwed: amountOwed,
            lender: 0x0000000000000000000000000000000000000000,
            scoreStakedOg: scoreStaked,
            attestor_address: 0x0000000000000000000000000000000000000000,
            scoreStakedAttestor: 0
        });

        loans.push(newLoan);
    }

    function lend(uint256 loanIndex) public virtual {
        require(loanIndex < loans.length, "Invalid loan index");
        require(!loans[loanIndex].settled, "Loan already settled");
        require(!loans[loanIndex].started, "Loan already started");

        IERC20 token = IERC20(loans[loanIndex].asset_address);

        token.transferFrom(
            msg.sender,
            loans[loanIndex].borrower,
            loans[loanIndex].amountOwed
        );

        loans[loanIndex].lender = msg.sender;
        loans[loanIndex].started = true;
        loans[loanIndex].loan_termination_date =
            block.timestamp +
            loans[loanIndex].timeToPayBack;
    }

    function attest(uint256 loanIndex, uint256 scoreStaked) public virtual {
        require(scores[msg.sender] >= scoreStaked, "Insufficient score");
        require(loanIndex < loans.length, "Invalid loan index");
        require(!loans[loanIndex].settled, "Loan already settled");
        require(!loans[loanIndex].started, "Loan already started");

        loans[loanIndex].attestor_address = msg.sender;
        loans[loanIndex].scoreStakedAttestor = scoreStaked;
    }

    function repay(uint256 loanIndex) public {
        require(loanIndex < loans.length, "Invalid loan index");
        require(msg.sender == loans[loanIndex].borrower, "Not borrower");
        require(!loans[loanIndex].settled, "Loan already settled");
        require(loans[loanIndex].started, "Loan not started");

        IERC20 token = IERC20(loans[loanIndex].asset_address);
        token.transferFrom(
            msg.sender,
            loans[loanIndex].lender,
            loans[loanIndex].amountOwed
            // // make sure payback has interest
            // (((loans[msg.sender][loanIndex].amountOwed *
            //     (100 + loans[msg.sender][loanIndex].interest)) / 100) *
            //     loans[msg.sender][loanIndex].timeToPayBack) /
            //     (365 * 24 * 60 * 60)
        );

        loans[loanIndex].settled = true;

        // TODO implement an algorithm for increase the score
        scores[msg.sender] += 1;
        scores[loans[loanIndex].lender] += 1;
    }

    function settle(
        uint256 loanIndex,
        uint256 scoreToBurnOG,
        uint256 scoreToBurnAttestor
    ) public {
        require(loanIndex < loans.length, "Invalid loan index");
        require(msg.sender == loans[loanIndex].lender, "Not lender");
        require(
            loans[loanIndex].scoreStakedOg >= scoreToBurnOG,
            "Insufficient score OG"
        );
        require(
            loans[loanIndex].scoreStakedAttestor >= scoreToBurnAttestor,
            "Insufficient score Attestor"
        );
        require(!loans[loanIndex].settled, "Loan already settled");
        require(loans[loanIndex].started, "Loan not started");
        require(
            loans[loanIndex].loan_termination_date < block.timestamp,
            "Loan not yet due"
        );

        loans[loanIndex].settled = true;

        // subtraction, but if we're subtracting more than they have make it 0:

        if (scores[loans[loanIndex].borrower] <= scoreToBurnOG) {
            scores[loans[loanIndex].borrower] = 0;
        } else {
            scores[loans[loanIndex].borrower] -= scoreToBurnOG;
        }

        if (scores[loans[loanIndex].attestor_address] <= scoreToBurnAttestor) {
            scores[loans[loanIndex].attestor_address] = 0;
        } else {
            scores[loans[loanIndex].attestor_address] -= scoreToBurnAttestor;
        }
    }
}
