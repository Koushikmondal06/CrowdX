import { ethers } from "ethers";

async function main() {
    const address = "0xd9145CCE52D386f254917e481eB44e9943F39138";
    console.log(`Checking address: ${address}`);

    // Use a public RPC provider directly to avoid needing a private key
    const provider = new ethers.JsonRpcProvider("https://ethereum-sepolia.publicnode.com");
    const code = await provider.getCode(address);

    if (code === "0x") {
        console.log("❌ No contract found at this address on this network.");
    } else {
        console.log("✅ Contract found!");
        console.log(`Code size: ${code.length} bytes`);

        // Try to call campaignsCount to see if it responds
        try {
            const factory = new ethers.Contract(address, [
                "function campaignsCount() external view returns (uint256)",
                "function getCampaigns() external view returns (address[])"
            ], provider);
            const count = await factory.campaignsCount();
            console.log(`Campaign count: ${count}`);

            const campaigns = await factory.getCampaigns();
            console.log("Campaigns:", campaigns);
        } catch (e) {
            console.log("❌ Error calling contract functions:", e);
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
