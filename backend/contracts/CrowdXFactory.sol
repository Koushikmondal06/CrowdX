// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CrowdX.sol";

contract CrowdXFactory {
    address[] public campaigns;

    event CampaignCreated(
        address indexed campaignAddress,
        address indexed owner,
        string title,
        uint256 goal,
        uint256 deadline
    );

    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _goal,
        uint256 _duration
    ) external {
        CrowdX campaign = new CrowdX(
            msg.sender,
            _title,
            _description,
            _goal,
            _duration
        );

        campaigns.push(address(campaign));

        emit CampaignCreated(
            address(campaign),
            msg.sender,
            _title,
            _goal,
            block.timestamp + _duration
        );
    }

    function getCampaigns() external view returns (address[] memory) {
        return campaigns;
    }

    function campaignsCount() external view returns (uint256) {
        return campaigns.length;
    }
}
