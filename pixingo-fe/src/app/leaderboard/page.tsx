
"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, ChevronLeft, Medal, Star } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function LeaderboardPage() {

  const loading = false;
  const entries = [{
    id: "",
    avatarUrl: "",
    userName: "",
    score: 2,
  }]


  return (
    <div className="min-h-screen flex flex-col p-6 max-w-md mx-auto space-y-8 bg-[radial-gradient(circle_at_top_right,_rgba(157,80,255,0.1)_0%,_transparent_50%)]">
      <header className="flex items-center justify-between">
        <Link href="/" className="text-muted-foreground hover:text-white transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-headline font-bold uppercase tracking-widest text-white">Global Ranks</h1>
        <div className="w-6" />
      </header>

      {/* Top 3 Podium Mockup or Logic */}
      <div className="grid grid-cols-3 gap-4 items-end pt-8 pb-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className={`rounded-2xl ${i === 1 ? 'h-32' : 'h-24'} bg-white/5`} />
          ))
        ) : (
          <>
            {/* 2nd Place */}
            <div className="flex flex-col items-center space-y-2">
              <div className="relative">
                <Avatar className="h-16 w-16 border-2 border-slate-400/50">
                  <AvatarImage src={entries?.[1]?.avatarUrl} />
                  <AvatarFallback>2</AvatarFallback>
                </Avatar>
                <div className="absolute -top-2 -right-2 bg-slate-400 text-black text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">2</div>
              </div>
              <span className="text-[10px] font-headline uppercase truncate w-full text-center">{entries?.[1]?.userName || "---"}</span>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center space-y-3 pb-4">
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -inset-2 rounded-full bg-accent/20 blur-md"
                />
                <Avatar className="h-20 w-20 border-4 border-accent shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                  <AvatarImage src={entries?.[0]?.avatarUrl} />
                  <AvatarFallback>1</AvatarFallback>
                </Avatar>
                <Medal className="absolute -top-3 -right-3 text-accent h-8 w-8 drop-shadow-lg" />
              </div>
              <div className="text-center">
                <span className="text-xs font-headline font-bold uppercase text-white block truncate w-24">
                  {entries?.[0]?.userName || "Searching..."}
                </span>
                <span className="text-accent text-sm font-bold font-headline">{entries?.[0]?.score || "0"}</span>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center space-y-2">
              <div className="relative">
                <Avatar className="h-14 w-14 border-2 border-amber-700/50">
                  <AvatarImage src={entries?.[2]?.avatarUrl} />
                  <AvatarFallback>3</AvatarFallback>
                </Avatar>
                <div className="absolute -top-2 -right-2 bg-amber-700 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">3</div>
              </div>
              <span className="text-[10px] font-headline uppercase truncate w-full text-center">{entries?.[2]?.userName || "---"}</span>
            </div>
          </>
        )}
      </div>

      {/* List */}
      <div className="flex-1 glass-card rounded-3xl overflow-hidden border-white/5 flex flex-col">
        <div className="p-4 bg-white/5 border-b border-white/5">
          <h2 className="text-[10px] font-headline uppercase tracking-widest text-muted-foreground font-bold">Runner Rankings</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-2xl bg-white/5" />
            ))
          ) : (
            entries?.slice(3).map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-[10px] font-bold text-muted-foreground w-4">{i + 4}</span>
                  <Avatar className="h-10 w-10 border border-white/10">
                    <AvatarImage src={entry.avatarUrl} />
                    <AvatarFallback>{entry.userName[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-headline font-medium text-white">{entry.userName}</span>
                </div>
                <div className="flex items-center space-x-1 text-primary">
                  <Star size={12} fill="currentColor" />
                  <span className="font-headline font-bold text-sm">{entry.score}</span>
                </div>
              </motion.div>
            ))
          )}
          {!loading && entries?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground space-y-4">
              <Trophy size={48} className="opacity-10" />
              <p className="text-xs uppercase tracking-widest">No legends recorded yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
