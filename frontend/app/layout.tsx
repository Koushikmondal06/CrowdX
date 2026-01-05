import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/components/web3/Web3Provider";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "CrowdX | Web3 Crowdfunding",
    description: "Decentralized crowdfunding platform",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Web3Provider>
                    <div className="flex flex-col min-h-screen">
                        <Navbar />
                        <main className="flex-grow pt-24 px-4 sm:px-6 lg:px-8">
                            {children}
                        </main>
                        <footer className="py-8 text-center text-text-muted text-sm glass-panel mt-12 bg-black/40">
                            <p>&copy; 2024 CrowdX. Built on Ethereum.</p>
                        </footer>
                    </div>
                </Web3Provider>
            </body>
        </html>
    );
}
