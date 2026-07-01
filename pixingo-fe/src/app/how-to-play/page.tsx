
"use client";

import { motion } from "framer-motion";
import { ChevronLeft, Brain, Scan, Users, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    icon: Scan,
    title: "Analyze Images",
    description: "Each round presents 4 seemingly unrelated images. Your brain is the primary processor.",
    color: "text-blue-400"
  },
  {
    icon: Brain,
    title: "Find the Connection",
    description: "Identify the underlying semantic concept that links all 4 images. Think laterally.",
    color: "text-purple-400"
  },
  {
    icon: ShieldCheck,
    title: "AI Consensus",
    description: "Submit your answer. Our GenLayer Node verifies your choice via semantic multi-model consensus.",
    color: "text-green-400"
  },
  {
    icon: Zap,
    title: "Earn XP & Rewards",
    description: "Correct answers build your score. In Duel mode, higher accuracy and speed takes the pot.",
    color: "text-accent"
  }
];

export default function HowToPlayPage() {
  return (
    <div className="min-h-screen flex flex-col p-6 max-w-md mx-auto space-y-8 bg-background">
      <header className="flex items-center">
        <Link href="/" className="text-muted-foreground hover:text-white transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="ml-4 text-xl font-headline font-bold uppercase tracking-widest text-white">Manual</h1>
      </header>

      <section className="space-y-4">
        <h2 className="text-4xl font-headline font-bold tracking-tight">The Pixingo <span className="text-primary">Protocol</span></h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Pixingo is not a trivia game. It is a semantic synchronization challenge where humans and AI reach consensus on conceptual relationships.
        </p>
      </section>

      <div className="space-y-6">
        {STEPS.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex space-x-4 p-4 rounded-2xl bg-white/5 border border-white/10"
          >
            <div className={`shrink-0 h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center ${step.color}`}>
              <step.icon size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="font-headline font-bold text-sm text-white uppercase tracking-wider">{step.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="pt-8 space-y-4">
        <div className="p-6 rounded-3xl bg-primary/10 border border-primary/20 space-y-3">
          <div className="flex items-center space-x-2 text-primary">
            <Users size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">Multiplayer Rules</span>
          </div>
          <p className="text-[10px] text-primary/80 leading-relaxed uppercase tracking-wider font-medium">
            In Duel and Battle Royale modes, winners are determined by:
          </p>
          <ul className="text-[10px] space-y-1 text-muted-foreground uppercase tracking-widest list-disc pl-4">
            <li>Number of correct semantic connections</li>
            <li>Confidence score from AI Consensus</li>
            <li>Submission speed (tie-breaker)</li>
          </ul>
        </div>

        <Link href="/lobby">
          <Button className="w-full py-8 text-lg font-headline uppercase tracking-widest bg-primary hover:bg-primary/90 rounded-2xl shadow-xl">
            Initiate Run
          </Button>
        </Link>
      </div>

      <footer className="text-center py-8">
        <p className="text-[8px] text-muted-foreground/30 uppercase tracking-[0.5em]">
          GenLayer Protocol Documentation v1.0
        </p>
      </footer>
    </div>
  );
}
