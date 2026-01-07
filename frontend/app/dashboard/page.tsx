"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "@/components/web3/Web3Provider";
import { FactoryABI, CampaignABI, FACTORY_ADDRESS } from "@/lib/web3/abi";
import CampaignCard from "@/components/campaign/CampaignCard";
import { Card } from "@/components/ui/Card";
import React from 'react';

export default function Dashboard() {
    const { provider, account } = useWeb3();
    const [myCampaigns, setMyCampaigns] = useState<any[]>([]);

    useEffect(() => {
        const fetchMyData = async () => {
            if (!provider || !account) return;

            const factory = new ethers.Contract(FACTORY_ADDRESS, FactoryABI, provider);

            // Check if contract is deployed
            try {
                const code = await provider.getCode(FACTORY_ADDRESS);
                if (code === "0x") {
                    console.warn("Contract not deployed at", FACTORY_ADDRESS);
                    return;
                }
            } catch (e) {
                console.error("Error checking contract:", e);
                return;
            }

            const addresses = await factory.getCampaigns();

            const myItems = (await Promise.all(addresses.map(async (addr: string) => {
                try {
                    const campaign = new ethers.Contract(addr, CampaignABI, provider);
                    // Use getSummary which we know works and returns everything including owner
                    const summary = await campaign.getSummary();
                    // summary: owner, goal, deadline, totalRaised, state
                    const owner = summary[0];

                    if (owner.toLowerCase() === account.toLowerCase()) {
                        const [title, desc] = await Promise.all([
                            campaign.title(),
                            campaign.description()
                        ]);

                        return {
                            address: addr,
                            title,
                            description: desc,
                            owner: summary[0],
                            goal: summary[1],
                            deadline: summary[2],
                            totalRaised: summary[3],
                            state: Number(summary[4])
                        };
                    }
                    return null;
                } catch (e) {
                    console.error(`Error fetching campaign ${addr} for dashboard:`, e);
                    return null;
                }
            }))).filter(item => item !== null);

            setMyCampaigns(myItems);
        };

        fetchMyData();
    }, [provider, account]);

    if (!account) {
        return <div className="p-8 sm:p-12 text-center text-text-muted text-sm sm:text-base">Please connect your wallet to view dashboard</div>;
    }

    return (
        <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8">My Dashboard</h1>

            <section className="mb-8 sm:mb-12">
                <h2 className="text-lg sm:text-xl font-medium text-text-muted mb-4 sm:mb-6">Active Campaigns</h2>
                {myCampaigns.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myCampaigns.map(c => <CampaignCard key={c.address} address={c.address} data={c} />)}
                    </div>
                ) : (
                    <Card className="p-6 text-center text-text-muted border-dashed border-white/20 text-sm sm:text-base">
                        You haven't created any campaigns yet.
                    </Card>
                )}
            </section>
        </div>
    );
}
