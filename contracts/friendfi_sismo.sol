// Some code from: https://github.com/sismo-core/sismo-connect-boilerplate-onchain/blob/main/src/Airdrop.sol & https://mumbai.polygonscan.com/address/0x1465ebb35e84a307a59e9c38d9ec3e773683b706#code

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./friendfi_general.sol";
import "@sismo-core/sismo-connect-solidity/contracts/libs/SismoLib.sol";

contract FriendFiSismo is FriendFi, SismoConnect {
    mapping(address => bool) public verified_sismo_users;
    using SismoConnectHelper for SismoConnectVerifiedResult;

    constructor(bytes16 appId) SismoConnect(appId) {}

    function whitelist_yourself(bytes memory response) public {
        SismoConnectVerifiedResult memory result = verify({
            responseBytes: response,
            auth: buildAuth({authType: AuthType.VAULT})
        });

        verified_sismo_users[msg.sender] = true;
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
            verified_sismo_users[msg.sender] == true,
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
            verified_sismo_users[msg.sender] == true,
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
            verified_sismo_users[msg.sender] == true,
            "You must be a verified worldcoin user"
        );
        super.attest(borrower, loanIndex, scoreStaked);
    }
}
