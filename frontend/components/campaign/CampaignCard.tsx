import Link from "next/link";
import { formatEther } from "ethers";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Timer, TrendingUp } from "lucide-react";

// Helper to determine status color
const getStatusColor = (state: number) => {
    switch (state) {
        case 0: return "text-green-400 bg-green-400/10";
        case 1: return "text-blue-400 bg-blue-400/10";
        case 2: return "text-red-400 bg-red-400/10";
        default: return "text-gray-400 bg-gray-400/10";
    }
};

const getStatusText = (state: number) => {
    switch (state) {
        case 0: return "Active";
        case 1: return "Success";
        case 2: return "Failed";
        default: return "Unknown";
    }
}

interface CampaignProps {
    address: string;
    data: {
        title: string;
        description: string;
        goal: bigint;
        totalRaised: bigint;
        deadline: bigint;
        state: number;
        owner: string;
    };
}

export default function CampaignCard({ address, data }: CampaignProps) {
    const progress = Number((data.totalRaised * 100n) / data.goal);
    const timeLeft = Number(data.deadline) * 1000 - Date.now();
    const daysLeft = Math.max(0, Math.ceil(timeLeft / (1000 * 60 * 60 * 24)));

    return (
        <Link href={`/campaigns/${address}`}>
            <Card hoverEffect className="h-full flex flex-col justify-between group">
                <div>
                    <div className="flex justify-between items-start mb-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${getStatusColor(data.state)}`}>
                            {getStatusText(data.state)}
                        </span>
                        <div className="flex items-center text-text-muted text-xs">
                            <Timer className="w-3 h-3 mr-1" />
                            {daysLeft} days left
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors line-clamp-1">
                        {data.title}
                    </h3>
                    <p className="text-text-muted text-sm line-clamp-2 mb-6">
                        {data.description}
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-white font-medium">{formatEther(data.totalRaised)} ETH</span>
                            <span className="text-text-muted">{progress.toFixed(0)}%</span>
                        </div>
                        <div className="h-2 bg-surface rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500" />
                            <span className="text-xs text-text-muted truncate max-w-[100px]">
                                by {data.owner.slice(0, 6)}...{data.owner.slice(-4)}
                            </span>
                        </div>
                        <Button variant="ghost" className="text-xs h-8 px-3 hover:bg-white/10">
                            View Details
                        </Button>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
