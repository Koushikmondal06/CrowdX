export const FactoryABI = [
    "function createCampaign(string _title, string _description, uint256 _goal, uint256 _duration) external",
    "function getCampaigns() external view returns (address[])",
    "function campaignsCount() external view returns (uint256)",
    "event CampaignCreated(address indexed campaignAddress, address indexed owner, string title, uint256 goal, uint256 deadline)"
];

export const CampaignABI = [
    "function contribute() external payable",
    "function finalizeCampaign() external",
    "function withdrawFunds() external",
    "function claimRefund() external",
    "function getSummary() external view returns (address, uint256, uint256, uint256, uint8)",
    "function title() external view returns (string)",
    "function description() external view returns (string)",
    "function goal() external view returns (uint256)",
    "function deadline() external view returns (uint256)",
    "function totalRaised() external view returns (uint256)",
    "function state() external view returns (uint8)",
    "function owner() external view returns (address)",
    "event ContributionMade(address indexed contributor, uint256 amount)",
    "event CampaignFinalized(uint8 finalState)"
];

// Address provided by user
export const FACTORY_ADDRESS = "0x4970f542336B22F5Ee7FC5943f531664322A8eaB"; 
