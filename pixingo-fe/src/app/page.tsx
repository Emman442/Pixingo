
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Users, Zap, Gamepad2, Info, ListOrdered, Wallet, Power } from "lucide-react";
import { GameModeCard } from "@/components/game/GameModeCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/ui/navbar";

export default function Home() {


  return (
    <div className="min-h-screen flex flex-col px-6 py-12 max-w-md mx-auto space-y-12 pb-24 bg-background">
      <header className="flex flex-col items-center space-y-6">
        <Navbar/>

        <div className="text-center space-y-4">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full text-primary text-xs font-medium uppercase tracking-widest"
          >
            <Gamepad2 size={14} />
            <span>Arena v1.2.0</span>
          </motion.div>
          
          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-5xl font-headline font-bold text-white tracking-tighter"
          >
            Pixingo
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-sm"
          >
            The ultimate semantic AI puzzle arena.
          </motion.p>
        </div>
      </header>

      <div className="flex gap-3">
        <Link href="/how-to-play" className="flex-1">
          <Button variant="outline" className="w-full h-12 rounded-xl border-white/10 hover:bg-white/5 font-headline uppercase tracking-wider text-[10px]">
            <Info size={14} className="mr-2 text-primary" />
            Manual
          </Button>
        </Link>
        <Link href="/leaderboard" className="flex-1">
          <Button variant="outline" className="w-full h-12 rounded-xl border-white/10 hover:bg-white/5 font-headline uppercase tracking-wider text-[10px]">
            <ListOrdered size={14} className="mr-2 text-primary" />
            Rankings
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        <GameModeCard
          title="Solo Arena"
          description="Instant play. Complete 4 rounds against AI consensus."
          features={["No waiting", "Local state", "Fast XP"]}
          cta="Initiate Solo Run"
          href="/solo"
          icon={Zap}
          variant="primary"
          
        />
        
        <GameModeCard
          title="Duel Arena"
          description="Challenge another player in real-time."
          features={["1v1 Matchmaking", "Arena Comms", "High Stakes"]}
          cta="Enter Duel Lobby"
          href="/duel"
          icon={Users}
          variant="secondary"
          disabled={true}
        />
        
        <GameModeCard
          title="Battle Royale"
          description="Compete against a pool of runners."
          features={["Large Lobbies", "Massive Rewards", "Live Consensus"]}
          cta="Join Royale Pool"
          href="/royale"
          icon={Trophy}
          variant="accent"
          disabled={true}
        />
      </div>

      <footer className="pt-8 text-center">
        <p className="text-[10px] text-muted-foreground/50 uppercase tracking-[0.2em]">
          Powered by GenLayer AI Consensus
        </p>
      </footer>
    </div>
  );
}
