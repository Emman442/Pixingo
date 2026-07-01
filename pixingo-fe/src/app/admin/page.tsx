
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    PlusSquare,
    Table as TableIcon,
    ShieldAlert,
    Loader2,
    LogOut,
    Gamepad2,
    Settings,
    Lock,
    ChevronRight
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminStats } from "@/components/admin/AdminStats";
import { PuzzleForm } from "@/components/admin/puzzleform";
import { PuzzleTable } from "@/components/admin/PuzzleTable";
import { TransactionModal } from "@/components/admin/TransactionModal";
import Link from "next/link";
import { useWallets } from "@privy-io/react-auth";
import { useFetchPuzzles } from "@/hooks/Pixingo";
import LoginButton from "@/components/ui/loginButton";

type Tab = "dashboard" | "create" | "manage";

export default function AdminDashboard() {
    const { wallets, ready } = useWallets()
    const embeddedWallet = wallets[0];
    const address = embeddedWallet?.address;
    const [activeTab, setActiveTab] = useState<Tab>("dashboard");
    const [txMessage, setTxMessage] = useState<string | null>(null);
    const { isPending: isFetchingPuzzles, data: puzzles } = useFetchPuzzles()
    if (!address || !ready) return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-6">
            <LoginButton />
        </div>
    );

    const isAdmin = address?.toLowerCase() === process.env.NEXT_PUBLIC_ADMIN!.toLowerCase();

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-6">
                <div className="p-6 rounded-full bg-destructive/10 text-destructive border border-destructive/20 mb-4">
                    <ShieldAlert size={64} />
                </div>
                <h1 className="text-4xl font-headline font-bold uppercase tracking-tighter">Access <span className="text-destructive">Denied</span></h1>
                <p className="text-muted-foreground max-w-md text-sm leading-relaxed uppercase tracking-widest">
                    The connected wallet does not have administrative privileges for the Pixingo protocol.
                </p>
                <Link href="/">
                    <Button variant="outline" className="border-white/10 hover:bg-white/5 uppercase tracking-widest text-[10px]">
                        Return to Arena
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 border-r border-white/5 bg-black/20 backdrop-blur-xl flex flex-col p-6 space-y-8">
                <div className="flex items-center space-x-3 px-2">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                        <Lock size={18} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-headline font-bold leading-none">ADMIN</h2>
                        <span className="text-[10px] text-primary font-bold uppercase tracking-widest">Master Node</span>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    {[
                        { id: "dashboard", icon: LayoutDashboard, label: "Overview" },
                        { id: "create", icon: PlusSquare, label: "Add Puzzle" },
                        { id: "manage", icon: TableIcon, label: "Management" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as Tab)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                                ? 'bg-primary/20 text-primary border border-primary/20'
                                : 'text-muted-foreground hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <tab.icon size={18} />
                            <span className="text-xs font-headline font-bold uppercase tracking-widest">{tab.label}</span>
                            {activeTab === tab.id && <ChevronRight size={14} className="ml-auto" />}
                        </button>
                    ))}
                </nav>

                <div className="pt-6 border-t border-white/5 space-y-4">
                    <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Status</div>
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] text-white font-bold tracking-wider">Sync Synchronized</span>
                        </div>
                    </div>
                    <Link href="/">
                        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-white hover:bg-white/5 text-[10px] uppercase tracking-widest font-bold">
                            <LogOut size={14} className="mr-2" />
                            Exit Dashboard
                        </Button>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6 md:p-12 bg-[radial-gradient(circle_at_top_right,_rgba(157,80,255,0.05)_0%,_transparent_50%)]">
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <Badge variant="outline" className="text-primary border-primary/20 mb-2 font-headline uppercase tracking-widest text-[10px]">
                            Protocol Management
                        </Badge>
                        <h1 className="text-5xl font-headline font-bold tracking-tighter">VisionQuest <span className="text-primary">Control</span></h1>
                        <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">Session Active • {address?.slice(0, 10)}...</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Network</span>
                            <span className="text-xs font-headline font-bold text-white">GENLAYER MAINNET</span>
                        </div>
                        <div className="h-10 w-1px bg-white/5" />
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Gas Price</span>
                            <span className="text-xs font-headline font-bold text-accent">12.4 GWEI</span>
                        </div>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {activeTab === "dashboard" && (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            <AdminStats puzzles={puzzles || []} />
                        </motion.div>
                    )}

                    {activeTab === "create" && (
                        <motion.div
                            key="create"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <PuzzleForm onSubmitting={(msg) => setTxMessage(msg)} />
                        </motion.div>
                    )}

                    {activeTab === "manage" && (
                        <motion.div
                            key="manage"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <PuzzleTable puzzles={puzzles || []} loading={isFetchingPuzzles} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <TransactionModal isOpen={!!txMessage} message={txMessage || ""} />
        </div>
    );
}
