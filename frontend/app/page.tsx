"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Globe, Shield, Zap } from "lucide-react";

export default function Home() {
    const containerCallback = (delay: number) => ({
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, delay, ease: "easeOut" },
        },
    });

    return (
        <div className="flex flex-col items-center justify-center pt-20 pb-16">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[120px]" />
            </div>

            <motion.div
                initial="hidden"
                animate="visible"
                className="text-center max-w-4xl mx-auto space-y-6 sm:space-y-8 px-4"
            >
                <motion.div variants={containerCallback(0)} className="space-y-3 sm:space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-surface border border-white/10 mb-3 sm:mb-4">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-xs font-medium text-text-muted tracking-wide">
                            LIVE ON ETHEREUM SEPOLIA
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-4 sm:mb-6">
                        The Future of <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary animate-pulse-slow">
                            Decentralized Funding
                        </span>
                    </h1>

                    <p className="text-base sm:text-lg md:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed px-4">
                        Launch your ideas into the decentralized world. Transparent, secure, and permissionless crowdfunding powered by smart contracts.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerCallback(0.2)}
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center mt-6 sm:mt-8"
                >
                    <Link href="/create" className="w-full sm:w-auto">
                        <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14 rounded-full">
                            Start a Campaign <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                    </Link>
                    <Link href="/campaigns" className="w-full sm:w-auto">
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14 rounded-full"
                        >
                            Explore Projects
                        </Button>
                    </Link>
                </motion.div>
            </motion.div>

            {/* Features Grid */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
                }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-20 sm:mt-32 max-w-7xl mx-auto w-full px-4"
            >
                {[
                    {
                        icon: Shield,
                        title: "Trustless Security",
                        desc: "Funds are locked in smart contracts and only released when goals are met.",
                    },
                    {
                        icon: Globe,
                        title: "Global Access",
                        desc: "Anyone with a wallet can contribute from anywhere in the world.",
                    },
                    {
                        icon: Zap,
                        title: "Instant Verification",
                        desc: "Real-time updates on funding progress and transparent transaction history.",
                    },
                ].map((feature, i) => (
                    <motion.div
                        key={i}
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        className="p-6 sm:p-8 rounded-2xl bg-surface/30 border border-white/5 hover:bg-surface/50 transition-colors"
                    >
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 sm:mb-6">
                            <feature.icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">
                            {feature.title}
                        </h3>
                        <p className="text-sm sm:text-base text-text-muted leading-relaxed">{feature.desc}</p>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
