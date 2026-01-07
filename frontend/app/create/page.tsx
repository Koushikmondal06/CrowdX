"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useWeb3 } from "@/components/web3/Web3Provider";
import { FactoryABI, FACTORY_ADDRESS } from "@/lib/web3/abi";
import { ArrowLeft, Calendar, Rocket, Target } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CreateCampaign() {
    const router = useRouter();
    const { signer } = useWeb3();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        goal: "",
        duration: "", // in days
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const createCampaign = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!signer) {
            alert("Please connect your wallet!");
            return;
        }

        try {
            setLoading(true);
            const factory = new ethers.Contract(FACTORY_ADDRESS, FactoryABI, signer);

            const goalInWei = ethers.parseEther(formData.goal);
            const durationInSeconds = parseInt(formData.duration) * 24 * 60 * 60;

            const tx = await factory.createCampaign(
                formData.title,
                formData.description,
                goalInWei,
                durationInSeconds
            );

            await tx.wait();

            router.push("/dashboard");
        } catch (error) {
            console.error("Error creating campaign:", error);
            alert("Failed to create campaign. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-8 sm:py-12 px-4">
            <Link
                href="/"
                className="inline-flex items-center text-text-muted hover:text-primary transition-colors mb-6 sm:mb-8"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
                <div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-3 sm:mb-4">
                        Launch Your <br /> Vision
                    </h1>
                    <p className="text-text-muted mb-6 sm:mb-8 text-sm sm:text-base">
                        Create a campaign, set your goal, and start raising funds on the blockchain in minutes.
                    </p>

                    <div className="space-y-4 sm:space-y-6 hidden md:block">
                        <div className="flex items-center gap-4 text-sm text-text-muted">
                            <div className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center">
                                <Target className="w-5 h-5 text-primary" />
                            </div>
                            <p>Set a realistic funding goal in ETH</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-text-muted">
                            <div className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-secondary" />
                            </div>
                            <p>Choose a duration for your campaign</p>
                        </div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="border-t-4 border-t-primary">
                        <form onSubmit={createCampaign} className="space-y-5 sm:space-y-6">
                            <Input
                                label="Campaign Title"
                                name="title"
                                placeholder="e.g., Decentralized Social Network"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-muted">Description</label>
                                <textarea
                                    name="description"
                                    className="w-full h-28 sm:h-32 rounded-lg bg-black/40 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                    placeholder="Tell your story..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Goal (ETH)"
                                    name="goal"
                                    type="number"
                                    step="0.01"
                                    placeholder="10.5"
                                    value={formData.goal}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    label="Duration (Days)"
                                    name="duration"
                                    type="number"
                                    placeholder="30"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full text-base sm:text-lg h-11 sm:h-12"
                                isLoading={loading}
                            >
                                <Rocket className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                Launch Campaign
                            </Button>
                        </form>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
