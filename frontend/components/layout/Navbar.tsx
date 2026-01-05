"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useWeb3 } from "@/components/web3/Web3Provider";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Wallet, Plus, LayoutDashboard, Rocket } from "lucide-react";

export default function Navbar() {
    const { account, connectWallet, switchWallet, isLoading } = useWeb3();
    const pathname = usePathname();

    const navItems = [
        { name: "Explore", href: "/campaigns", icon: Rocket },
        { name: "Create", href: "/create", icon: Plus },
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ];

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative w-10 h-10 group-hover:scale-105 transition-transform">
                            <Image
                                src="/logo.png"
                                alt="CrowdX Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="font-bold text-xl tracking-wide">CrowdX</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-2 text-sm font-medium transition-colors duration-200",
                                        isActive
                                            ? "text-primary neon-glow"
                                            : "text-text-muted hover:text-text"
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-4">
                        {isLoading ? (
                            <Button variant="secondary" className="w-32 opacity-50">Loading...</Button>
                        ) : account ? (
                            <div className="flex items-center gap-2">
                                {/* Network Warning - Show if not Sepolia (11155111) */}
                                {(window as any).ethereum && (window as any).ethereum.chainId !== '0xaa36a7' && (
                                    <span className="hidden md:flex items-center gap-1 text-xs text-amber-500 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
                                        Wrong Network
                                    </span>
                                )}

                                <div className="flex items-center gap-2 group relative">
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-primary/20">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-sm font-mono text-primary">
                                            {account.slice(0, 6)}...{account.slice(-4)}
                                        </span>
                                    </div>

                                    <Button
                                        onClick={switchWallet}
                                        variant="outline"
                                        className="h-9 px-3 text-xs border-primary/20 hover:bg-primary/10 hover:text-primary transition-colors"
                                    >
                                        Switch
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <Button onClick={connectWallet} className="rounded-full">
                                <Wallet className="w-4 h-4 mr-2" />
                                Connect Wallet
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
