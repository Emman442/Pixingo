
"use client";

export const dynamic = "force-dynamic";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Trophy, Star, TrendingUp, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import SoloResult from "@/components/ui/soloResult";
import { useFetchSoloGame } from "@/hooks/Pixingo";

export default function ResultsClient() {
  const params = useSearchParams()
  const mode = params.get("mode");
  const isSolo = mode === "solo";
  const gameId = params.get("gameId");


  const { isPending: isFetchingSoloGame, data: game } = useFetchSoloGame(gameId!)

  console.log("gameeeId: ", gameId)
  console.log("gameee: ", game, gameId)

  if (isSolo) {
    return (
      <SoloResult
        game={game}
        isLoading={isFetchingSoloGame}
      />
    );
  }
  return (
    
    <div className="min-h-screen p-6 flex flex-col items-center space-y-12 bg-[radial-gradient(ellipse_at_top,_rgba(157,80,255,0.15)_0%,_transparent_80%)]">
      <header className="text-center pt-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex bg-accent/20 text-accent p-3 rounded-full mb-4"
        >
          <Trophy size={40} />
        </motion.div>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl font-headline font-bold text-white tracking-tighter"
        >
          VICTORY!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground uppercase tracking-widest text-xs mt-2"
        >
          Match Successfully Verified on GenLayer
        </motion.p>
      </header>

      {/* Podium Visualization */}
      <div className="w-full max-w-sm flex items-end justify-center space-x-2 pt-8">
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "140px" }}
          transition={{ delay: 0.6 }}
          className="flex-1 bg-gradient-to-t from-muted/50 to-muted/20 rounded-t-2xl p-4 flex flex-col items-center justify-end space-y-2 border-x border-t border-white/5"
        >
          <div className="w-8 h-8 rounded-full bg-slate-400/20 flex items-center justify-center text-slate-400 text-xs font-bold">2</div>
          <div className="text-[8px] uppercase tracking-tighter text-muted-foreground">ShadowRider</div>
        </motion.div>

        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "200px" }}
          transition={{ delay: 0.4 }}
          className="flex-1 bg-gradient-to-t from-primary/30 to-primary/10 rounded-t-3xl p-4 flex flex-col items-center justify-end space-y-4 border-x border-t border-primary/20 shadow-[0_-10px_50px_rgba(157,80,255,0.2)]"
        >
          <motion.div
            animate={{ rotateY: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-background font-black text-xl shadow-[0_0_20px_rgba(255,215,0,0.5)]"
          >
            1
          </motion.div>
          <div className="text-center">
            <div className="text-[10px] font-bold uppercase tracking-widest text-white">YOU</div>
            <div className="text-xl font-headline font-bold text-accent">3,450</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "110px" }}
          transition={{ delay: 0.8 }}
          className="flex-1 bg-gradient-to-t from-muted/50 to-muted/20 rounded-t-2xl p-4 flex flex-col items-center justify-end space-y-2 border-x border-t border-white/5"
        >
          <div className="w-8 h-8 rounded-full bg-amber-700/20 flex items-center justify-center text-amber-700 text-xs font-bold">3</div>
          <div className="text-[8px] uppercase tracking-tighter text-muted-foreground">NoobMaster</div>
        </motion.div>
      </div>

      {/* Stats Table */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="w-full max-w-sm glass-card rounded-3xl p-6 space-y-6"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-[10px] text-muted-foreground uppercase tracking-wider">
              <Star size={10} className="text-accent" />
              <span>Correctness</span>
            </div>
            <div className="text-xl font-headline font-bold">100%</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-[10px] text-muted-foreground uppercase tracking-wider">
              <TrendingUp size={10} className="text-primary" />
              <span>XP Earned</span>
            </div>
            <div className="text-xl font-headline font-bold text-primary">+850</div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Global Rank Change</span>
            <span className="text-green-400 font-bold tracking-widest">▲ 14 POSITIONS</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Avg. Response Time</span>
            <span className="text-white font-bold tracking-widest">4.2S</span>
          </div>
        </div>
      </motion.div>

      <div className="w-full max-w-sm pt-4 flex flex-col space-y-3">
        <Link href="/lobby">
          <Button className="w-full py-8 text-lg font-headline uppercase tracking-widest bg-primary hover:bg-primary/90 rounded-2xl">
            Play Again
          </Button>
        </Link>
        <Link href="/">
          <Button variant="ghost" className="w-full py-6 text-muted-foreground hover:text-white">
            <RotateCcw size={16} className="mr-2" />
            Back to Arena
          </Button>
        </Link>
      </div>

      <p className="text-[8px] text-muted-foreground/30 uppercase tracking-[0.5em] pb-8">
        Transaction Hash: 0x8b3...22e
      </p>
    </div>
  );
}
