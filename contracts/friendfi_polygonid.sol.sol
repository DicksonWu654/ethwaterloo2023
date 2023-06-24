// Some code from: https://github.com/0xPolygonID/tutorial-examples/tree/main/on-chain-verification/contracts

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./friendfi_general.sol";

import "./polygon_id_utils/lib/GenesisUtils.sol";
import "./polygon_id_utils/interfaces/ICircuitValidator.sol";
import "./polygon_id_utils/verifiers/ZKPVerifier.sol";

contract FriendFiPolygonId is FriendFi, ZKPVerifier {
    mapping(address => bool) public verified_polygonid_users;

    mapping(uint256 => address) public idToAddress;
    mapping(address => uint256) public addressToId;

    function _beforeProofSubmit(
        uint64 /* requestId */,
        uint256[] memory inputs,
        ICircuitValidator validator
    ) internal view override {
        // check that the challenge input of the proof is equal to the msg.sender
        address addr = GenesisUtils.int256ToAddress(
            inputs[validator.getChallengeInputIndex()]
        );
        require(
            _msgSender() == addr,
            "address in the proof is not a sender address"
        );
    }

    function _afterProofSubmit(
        uint64 requestId,
        uint256[] memory inputs,
        ICircuitValidator validator
    ) internal override {
        require(
            requestId == 1 && addressToId[_msgSender()] == 0,
            "proof can not be submitted more than once"
        );

        uint256 id = inputs[validator.getChallengeInputIndex()];
        // whitelist address
        if (idToAddress[id] == address(0)) {
            verified_polygonid_users[_msgSender()] = true;
            initialize_user();
        }
    }

    function create_loan(
        uint256 scoreStaked,
        uint256 timeToExpiry,
        uint256 timeToPayBack,
        // uint256 interest,
        address asset_address,
        uint256 amountOwed
    ) public override {
        require(
            verified_polygonid_users[msg.sender] == true,
            "You must be a verified worldcoin user"
        );
        super.create_loan(
            scoreStaked,
            timeToExpiry,
            timeToPayBack,
            // interest,
            asset_address,
            amountOwed
        );
    }

    function lend(uint256 loanIndex) public override {
        require(
            verified_polygonid_users[msg.sender] == true,
            "You must be a verified worldcoin user"
        );
        super.lend(loanIndex);
    }

    function attest(uint256 loanIndex, uint256 scoreStaked) public override {
        require(
            verified_polygonid_users[msg.sender] == true,
            "You must be a verified worldcoin user"
        );
        super.attest(loanIndex, scoreStaked);
    }
}
