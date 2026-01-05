"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers, BrowserProvider, JsonRpcSigner } from "ethers";

interface Web3ContextType {
    provider: BrowserProvider | null;
    signer: JsonRpcSigner | null;
    account: string | null;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
    switchWallet: () => Promise<void>;
    isLoading: boolean;
    chainId: bigint | null;
}

const Web3Context = createContext<Web3ContextType>({
    provider: null,
    signer: null,
    account: null,
    connectWallet: async () => { },
    disconnectWallet: () => { },
    switchWallet: async () => { },
    isLoading: true,
    chainId: null,
});

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [provider, setProvider] = useState<BrowserProvider | null>(null);
    const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
    const [account, setAccount] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [chainId, setChainId] = useState<bigint | null>(null);

    const initWeb3 = async () => {
        if (typeof window !== "undefined" && (window as any).ethereum) {
            try {
                const _provider = new ethers.BrowserProvider((window as any).ethereum);
                const _signer = await _provider.getSigner();
                const _account = await _signer.getAddress();
                const _network = await _provider.getNetwork();

                setProvider(_provider);
                setSigner(_signer);
                setAccount(_account);
                setChainId(_network.chainId);
            } catch (err) {
                console.error("Failed to connect wallet on init", err);
                // If we fail here, we should probably clear state
                setProvider(null);
                setSigner(null);
                setAccount(null);
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        initWeb3();

        if ((window as any).ethereum) {
            (window as any).ethereum.on('accountsChanged', initWeb3);
            (window as any).ethereum.on('chainChanged', () => window.location.reload());
        }

        return () => {
            if ((window as any).ethereum) {
                (window as any).ethereum.removeListener('accountsChanged', initWeb3);
            }
        };
    }, []);

    const switchNetwork = async () => {
        if (typeof window !== "undefined" && (window as any).ethereum) {
            try {
                await (window as any).ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: "0xaa36a7" }], // Sepolia
                });
                await initWeb3();
            } catch (switchError: any) {
                // This error code indicates that the chain has not been added to MetaMask.
                if (switchError.code === 4902) {
                    try {
                        await (window as any).ethereum.request({
                            method: "wallet_addEthereumChain",
                            params: [
                                {
                                    chainId: "0xaa36a7",
                                    chainName: "Sepolia Test Network",
                                    nativeCurrency: {
                                        name: "SepoliaETH",
                                        symbol: "ETH",
                                        decimals: 18,
                                    },
                                    rpcUrls: ["https://sepolia.infura.io/v3/"],
                                    blockExplorerUrls: ["https://sepolia.etherscan.io"],
                                },
                            ],
                        });
                        await initWeb3();
                    } catch (addError) {
                        console.error("Failed to add Sepolia network", addError);
                    }
                }
                console.error("Failed to switch network", switchError);
            }
        }
    };

    const connectWallet = async () => {
        if (typeof window !== "undefined" && (window as any).ethereum) {
            try {
                await (window as any).ethereum.request({
                    method: "eth_requestAccounts",
                });
                const _provider = new ethers.BrowserProvider((window as any).ethereum);
                const _network = await _provider.getNetwork();

                // Auto-switch to Sepolia if not on it
                if (_network.chainId !== 11155111n) {
                    await switchNetwork();
                } else {
                    await initWeb3();
                }
            } catch (error) {
                console.error("Error connecting wallet:", error);
            }
        } else {
            alert("Please install MetaMask!");
        }
    };

    const disconnectWallet = () => {
        setProvider(null);
        setSigner(null);
        setAccount(null);
        setChainId(null);
    };

    const switchWallet = async () => {
        if (typeof window !== "undefined" && (window as any).ethereum) {
            try {
                await (window as any).ethereum.request({
                    method: "wallet_requestPermissions",
                    params: [
                        {
                            eth_accounts: {}
                        }
                    ]
                });
                // After permission change, accountsChanged event should trigger initWeb3
            } catch (error) {
                console.error("Error switching wallet:", error);
            }
        }
    }

    return (
        <Web3Context.Provider
            value={{ provider, signer, account, connectWallet, disconnectWallet, switchWallet, isLoading, chainId }}
        >
            {children}
        </Web3Context.Provider>
    );
};
