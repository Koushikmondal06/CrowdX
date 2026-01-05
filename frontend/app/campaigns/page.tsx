"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "@/components/web3/Web3Provider";
import { FactoryABI, CampaignABI, FACTORY_ADDRESS } from "@/lib/web3/abi";
import CampaignCard from "@/components/campaign/CampaignCard";
import { Card } from "@/components/ui/Card";
import { Loader2 } from "lucide-react";

export default function CampaignsPage() {
    const { provider } = useWeb3();
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampaigns = async () => {
            if (!provider) return;

            try {
                const factory = new ethers.Contract(FACTORY_ADDRESS, FactoryABI, provider);

                // Check if contract is deployed
                const code = await provider.getCode(FACTORY_ADDRESS);
                if (code === "0x") {
                    console.warn("Contract not deployed at", FACTORY_ADDRESS);
                    setLoading(false);
                    return;
                }

                const campaignAddresses = await factory.getCampaigns();

                const campaignData = (await Promise.all(
                    campaignAddresses.map(async (address: string) => {
                        try {
                            const campaign = new ethers.Contract(address, CampaignABI, provider);
                            // Fetch all data in parallel or via getSummary if available
                            // Optimized to use getSummary from contract
                            const summary = await campaign.getSummary();
                            // summary: owner, goal, deadline, totalRaised, state

                            // We also need title and description which might not be in summary depending on contract optimization
                            // Based on my previous file view, getSummary returns (owner, goal, deadline, totalRaised, state)
                            // But title and description are public variables so we can fetch them.

                            const [title, description] = await Promise.all([
                                campaign.title(),
                                campaign.description()
                            ]);

                            return {
                                address,
                                title,
                                description,
                                owner: summary[0],
                                goal: summary[1],
                                deadline: summary[2],
                                totalRaised: summary[3],
                                state: Number(summary[4])
                            };
                        } catch (err) {
                            console.error(`Failed to fetch campaign at ${address}`, err);
                            return null;
                        }
                    })
                )).filter(campaign => campaign !== null);

                setCampaigns(campaignData.reverse()); // Show newest first
            } catch (error) {
                console.error("Error fetching campaigns:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, [provider]);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-12">
            <div className="mb-12">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    Explore Campaigns
                </h1>
                <p className="text-text-muted mt-4 text-lg">
                    Discover and support the next generation of decentralized projects.
                </p>
            </div>

            {campaigns.length === 0 ? (
                <Card className="p-12 text-center text-text-muted">
                    <p>No active campaigns found. Be the first to launch one!</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {campaigns.map((campaign) => (
                        <CampaignCard key={campaign.address} address={campaign.address} data={campaign} />
                    ))}
                </div>
            )}
        </div>
    );
}
