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
        require(
            verified_worldcoin_users[msg.sender] == true,
            "You must be a verified worldcoin user"
        );
        super.create_loan(
            scoreStaked,
            daystoExpiry,
            daysToPayBack,
            interest,
            asset_address,
            amountOwed
        );
    }

    function lend(address borrower, uint256 loanIndex) public override {
        require(
            verified_worldcoin_users[msg.sender] == true,
            "You must be a verified worldcoin user"
        );
        super.lend(borrower, loanIndex);
    }

    function attest(
        address borrower,
        uint256 loanIndex,
        uint256 scoreStaked
    ) public override {
        require(
            verified_worldcoin_users[msg.sender] == true,
            "You must be a verified worldcoin user"
        );
        super.attest(borrower, loanIndex, scoreStaked);
    }
}
