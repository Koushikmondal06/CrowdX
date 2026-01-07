"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useWeb3 } from "@/components/web3/Web3Provider";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Wallet, Plus, LayoutDashboard, Rocket, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
    const { account, connectWallet, switchWallet, isLoading } = useWeb3();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { name: "Explore", href: "/campaigns", icon: Rocket },
        { name: "Create", href: "/create", icon: Plus },
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ];

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 sm:h-20 items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative w-8 h-8 sm:w-10 sm:h-10 group-hover:scale-105 transition-transform">
                            <Image
                                src="/logo.png"
                                alt="CrowdX Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="font-bold text-lg sm:text-xl tracking-wide">CrowdX</span>
                    </Link>

                    {/* Desktop Navigation */}
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

                    <div className="flex items-center gap-2 sm:gap-4">
                        {isLoading ? (
                            <Button variant="secondary" size="sm" className="opacity-50">Loading...</Button>
                        ) : account ? (
                            <div className="flex items-center gap-1 sm:gap-2">
                                {/* Network Warning */}
                                {(window as any).ethereum && (window as any).ethereum.chainId !== '0xaa36a7' && (
                                    <span className="hidden md:flex items-center gap-1 text-xs text-amber-500 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
                                        Wrong Network
                                    </span>
                                )}

                                <div className="flex items-center gap-1 sm:gap-2">
                                    <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full bg-surface border border-primary/20">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-xs sm:text-sm font-mono text-primary">
                                            {account.slice(0, 4)}...{account.slice(-3)}
                                        </span>
                                    </div>

                                    <Button
                                        onClick={switchWallet}
                                        variant="outline"
                                        size="sm"
                                        className="hidden sm:flex border-primary/20 hover:bg-primary/10 hover:text-primary transition-colors"
                                    >
                                        Switch
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <Button onClick={connectWallet} size="sm" className="rounded-full text-xs sm:text-sm">
                                <Wallet className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                                <span className="hidden sm:inline">Connect Wallet</span>
                                <span className="sm:hidden">Connect</span>
                            </Button>
                        )}

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-text-muted hover:text-text transition-colors"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden top-16 sm:top-20"
                        onClick={() => setMobileMenuOpen(false)}
                    />

                    {/* Menu Panel */}
                    <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/5">
                        <div className="px-4 py-6 space-y-4">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 text-base font-medium transition-colors duration-200 py-3 px-4 rounded-lg",
                                            isActive
                                                ? "text-primary bg-primary/10 neon-glow"
                                                : "text-text-muted hover:text-text hover:bg-white/5"
                                        )}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {item.name}
                                    </Link>
                                );
                            })}

                            {/* Mobile-only Switch Wallet button */}
                            {account && (
                                <Button
                                    onClick={() => {
                                        switchWallet();
                                        setMobileMenuOpen(false);
                                    }}
                                    variant="outline"
                                    className="w-full border-primary/20 hover:bg-primary/10"
                                >
                                    Switch Wallet
                                </Button>
                            )}
                        </div>
                    </div>
                </>
            )}
        </nav>
    );
}
