
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ShieldCheck, Box, Network, Fingerprint } from "lucide-react";

interface TransactionModalProps {
  isOpen: boolean;
  message: string;
}

const MESSAGES = [
  "Uploading puzzle to Pixingo...",
  "Validating puzzle metadata...",
  "Broadcasting transaction...",
  "Images are being indexed...",
  "Puzzle is being stored on-chain...",
  "Preparing challenge for future players...",
  "Almost done...",
];

export function TransactionModal({ isOpen, message }: TransactionModalProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % MESSAGES.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-xl flex items-center justify-center p-6"
        >
          {/* Background Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute -top-1/2 -left-1/2 w-full h-full border border-primary/20 rounded-full"
            />
            <motion.div 
              animate={{ rotate: -360 }} 
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-1/2 -right-1/2 w-full h-full border border-secondary/20 rounded-full"
            />
          </div>

          <div className="relative z-10 max-w-sm w-full space-y-12 flex flex-col items-center">
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="h-24 w-24 rounded-full border-t-4 border-primary shadow-[0_0_40px_rgba(157,80,255,0.4)]"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Box size={32} className="text-primary animate-pulse" />
              </div>
            </div>

            <div className="space-y-6 text-center w-full">
              <div className="h-8 relative">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-white font-headline font-bold uppercase tracking-widest text-sm"
                  >
                    {MESSAGES[index]}
                  </motion.p>
                </AnimatePresence>
              </div>

              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 15, repeat: Infinity }}
                  className="h-full bg-gradient-to-r from-primary to-secondary shadow-[0_0_15px_rgba(157,80,255,0.8)]"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                {[
                  { icon: Fingerprint, label: "Sign" },
                  { icon: Network, label: "Node" },
                  { icon: ShieldCheck, label: "Verify" }
                ].map((step, i) => (
                  <div key={i} className="flex flex-col items-center space-y-2">
                    <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground animate-pulse">
                      <step.icon size={16} />
                    </div>
                    <span className="text-[8px] uppercase tracking-widest font-bold text-muted-foreground/50">{step.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
