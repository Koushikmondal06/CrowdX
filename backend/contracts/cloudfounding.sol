// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CrowdfundingCampaign {
    enum CampaignState {
        Active,
        Successful,
        Failed
    }

    address public owner;
    string public title;
    string public description;
    uint256 public goal;
    uint256 public deadline;
    uint256 public totalRaised;
    CampaignState public state;

    mapping(address => uint256) public contributions;

    event ContributionMade(address indexed contributor, uint256 amount);
    event CampaignFinalized(CampaignState finalState);
    event FundsWithdrawn(address indexed owner, uint256 amount);
    event RefundIssued(address indexed contributor, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not campaign owner");
        _;
    }

    modifier inState(CampaignState _state) {
        require(state == _state, "Invalid campaign state");
        _;
    }

    constructor(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _goal,
        uint256 _duration
    ) {
        require(_goal > 0, "Goal must be greater than zero");
        require(_duration > 0, "Duration must be greater than zero");

        owner = _owner;
        title = _title;
        description = _description;
        goal = _goal;
        deadline = block.timestamp + _duration;
        state = CampaignState.Active;
    }

    function contribute() external payable inState(CampaignState.Active) {
        require(block.timestamp < deadline, "Campaign ended");
        require(msg.value > 0, "Contribution must be > 0");

        contributions[msg.sender] += msg.value;
        totalRaised += msg.value;

        emit ContributionMade(msg.sender, msg.value);
    }

    function finalizeCampaign() public inState(CampaignState.Active) {
        require(
            block.timestamp >= deadline || totalRaised >= goal,
            "Campaign still active and goal not reached"
        );

        if (totalRaised >= goal) {
            state = CampaignState.Successful;
        } else {
            state = CampaignState.Failed;
        }

        emit CampaignFinalized(state);
    }

    function withdrawFunds()
        external
        onlyOwner
        inState(CampaignState.Successful)
    {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds available");

        (bool success, ) = owner.call{value: balance}("");
        require(success, "Transfer failed");

        emit FundsWithdrawn(owner, balance);
    }

    function claimRefund() external inState(CampaignState.Failed) {
        uint256 contributed = contributions[msg.sender];
        require(contributed > 0, "No contribution");

        contributions[msg.sender] = 0;

        (bool success, ) = msg.sender.call{value: contributed}("");
        require(success, "Refund failed");

        emit RefundIssued(msg.sender, contributed);
    }

    function getSummary()
        external
        view
        returns (
            address _owner,
            uint256 _goal,
            uint256 _deadline,
            uint256 _totalRaised,
            CampaignState _state
        )
    {
        return (owner, goal, deadline, totalRaised, state);
    }
}
