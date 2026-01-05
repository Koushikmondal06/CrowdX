"use client";

import { useEffect, useState } from "react";
import { ethers, formatEther, parseEther } from "ethers";
import { useWeb3 } from "@/components/web3/Web3Provider";
import { CampaignABI } from "@/lib/web3/abi";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Loader2, Calendar, Target, User, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function CampaignDetails({ params }: { params: { address: string } }) {
    const { provider, signer, account } = useWeb3();
    const [campaign, setCampaign] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [amount, setAmount] = useState("");
    const [contributing, setContributing] = useState(false);
    const [error, setError] = useState("");

    const fetchCampaign = async () => {
        if (!provider) return;
        try {
            const contract = new ethers.Contract(params.address, CampaignABI, provider);

            const [summary, title, desc] = await Promise.all([
                contract.getSummary(),
                contract.title(),
                contract.description()
            ]);

            setCampaign({
                owner: summary[0],
                goal: summary[1],
                deadline: summary[2],
                totalRaised: summary[3],
                state: Number(summary[4]),
                title,
                description: desc
            });
        } catch (err) {
            console.error(err);
            setError("Failed to load campaign data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaign();
    }, [provider, params.address]);

    const handleContribute = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!signer) return alert("Please connect wallet");

        try {
            setContributing(true);
            setError("");

            const contract = new ethers.Contract(params.address, CampaignABI, signer);
            const tx = await contract.contribute({ value: parseEther(amount) });
            await tx.wait();

            setAmount("");
            fetchCampaign(); // Refresh data
        } catch (err: any) {
            console.error(err);
            setError(err.reason || err.message || "Transaction failed");
        } finally {
            setContributing(false);
        }
    };

    const handleClaimRefund = async () => {
        if (!signer) return;
        try {
            setContributing(true);
            const contract = new ethers.Contract(params.address, CampaignABI, signer);
            const tx = await contract.claimRefund();
            await tx.wait();
            alert("Refund claimed successfully!");
            fetchCampaign();
        } catch (err) {
            console.error(err);
            alert("Refund failed");
        } finally {
            setContributing(false);
        }
    };

    const handleFinalize = async () => {
        if (!signer) return;
        try {
            setContributing(true);
            const contract = new ethers.Contract(params.address, CampaignABI, signer);
            const tx = await contract.finalizeCampaign();
            await tx.wait();
            alert("Campaign finalized!");
            fetchCampaign();
        } catch (err: any) {
            console.error(err);
            alert(err.reason || "Finalization failed");
        } finally {
            setContributing(false);
        }
    };

    const handleWithdraw = async () => {
        if (!signer) return;
        try {
            setContributing(true);
            const contract = new ethers.Contract(params.address, CampaignABI, signer);
            const tx = await contract.withdrawFunds();
            await tx.wait();
            alert("Funds withdrawn!");
            fetchCampaign();
        } catch (err: any) {
            console.error(err);
            alert(err.reason || "Withdrawal failed");
        } finally {
            setContributing(false);
        }
    };

    if (loading) return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="animate-spin" /></div>;
    if (!campaign) return <div className="p-12 text-center">Campaign not found</div>;

    const progress = Number((campaign.totalRaised * 100n) / campaign.goal);
    const isOwner = account && campaign.owner.toLowerCase() === account.toLowerCase();
    const isActive = campaign.state === 0;
    const isFailed = campaign.state === 2;

    return (
        <div className="max-w-6xl mx-auto py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isActive ? "bg-green-500/10 text-green-500 border border-green-500/20" :
                            isFailed ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                                "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                            }`}>
                            {isActive ? "Active" : isFailed ? "Failed" : "Successful"}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        {campaign.title}
                    </h1>

                    <div className="flex items-center gap-4 text-sm text-text-muted mb-8 pb-8 border-b border-white/5">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span className="font-mono text-primary">{campaign.owner}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Ends {new Date(Number(campaign.deadline) * 1000).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className="prose prose-invert max-w-none text-text-muted leading-relaxed whitespace-pre-wrap">
                        {campaign.description}
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <Card className="sticky top-24 border-t-4 border-t-secondary p-8 space-y-8">
                    <div>
                        <div className="flex justify-between items-baseline mb-2">
                            <span className="text-3xl font-bold text-white">{formatEther(campaign.totalRaised)} ETH</span>
                            <span className="text-sm text-text-muted">raised of {formatEther(campaign.goal)} ETH</span>
                        </div>

                        <div className="h-3 bg-surface rounded-full overflow-hidden mb-2">
                            <div
                                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000 ease-out"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                        </div>

                        <div className="flex justify-between text-xs text-text-muted">
                            <span>{progress.toFixed(2)}% funded</span>
                            {isActive && <span>{Math.ceil((Number(campaign.deadline) * 1000 - Date.now()) / (1000 * 60 * 60 * 24))} days left</span>}
                        </div>
                    </div>

                    {isActive ? (
                        <form onSubmit={handleContribute} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-muted">Amount to Contribute (ETH)</label>
                                <div className="relative">
                                    <Input
                                        type="number"
                                        step="0.001"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.1"
                                        className="pr-16"
                                        required
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-text-muted font-bold">ETH</span>
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-12 text-lg" isLoading={contributing}>
                                Back this Project
                            </Button>

                            {error && (
                                <div className="p-3 rounded bg-red-500/10 border border-red-500/20 flex items-start gap-2 text-sm text-red-500">
                                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}
                        </form>
                    ) : (
                        <div className="p-4 rounded-lg bg-surface border border-white/5 text-center">
                            <h3 className="font-bold text-white mb-2">Campaign Ended</h3>
                            <p className="text-sm text-text-muted">
                                This campaign is no longer accepting contributions.
                            </p>
                            {isFailed && (
                                <Button onClick={handleClaimRefund} variant="outline" className="mt-4 w-full" isLoading={contributing}>
                                    Claim Refund
                                </Button>
                            )}
                        </div>
                    )}

                    <div className="pt-6 border-t border-white/5 text-xs text-text-muted text-center">
                        <p>All funds are safely stored in the smart contract until the campaign succeeds.</p>
                    </div>

                    {isOwner && (
                        <div className="pt-6 border-t border-white/10">
                            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Admin Zone</h3>
                            <div className="space-y-3">
                                {isActive && (
                                    <Button
                                        onClick={handleFinalize}
                                        variant="outline"
                                        className="w-full border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
                                        isLoading={contributing}
                                    >
                                        Finalize Campaign
                                    </Button>
                                )}
                                {campaign.state === 1 && (
                                    <Button
                                        onClick={handleWithdraw}
                                        variant="outline"
                                        className="w-full border-green-500/50 text-green-500 hover:bg-green-500/10"
                                        isLoading={contributing}
                                    >
                                        Withdraw Funds
                                    </Button>
                                )}
                                {!isActive && campaign.state !== 1 && (
                                    <p className="text-xs text-text-muted text-center italic">No actions available</p>
                                )}
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
