
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Orb } from "@/components/game/Orb";

const STATUS_MESSAGES = [
  "Preparing your game results...",
  "Submitting match data to GenLayer...",
  "State is being stored on-chain...",
  "Validators are reviewing your answers...",
  "Consensus votes are being collected...",
  "Semantic analysis in progress...",
  "Checking image-answer relationships...",
  "Calculating final score...",
  "Verifying game integrity...",
  "Finalizing consensus...",
  "Almost there...",
];

const STEPS = [
  { id: 1, label: "Store State" },
  { id: 2, label: "Validator Review" },
  { id: 3, label: "Consensus Formation" },
  { id: 4, label: "Score Finalization" },
  { id: 5, label: "Results Ready" },
];

export default function ConsensusPage() {
  const router = useRouter();
  const [messageIndex, setMessageIndex] = useState(0);
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 2500);

    const stepInterval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= 5) {
          clearInterval(stepInterval);
          setTimeout(() => router.push("/results"), 1000);
          return 5;
        }
        return prev + 1;
      });
    }, 2000);

    return () => {
      clearInterval(messageInterval);
      clearInterval(stepInterval);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(157,80,255,0.05)_0%,_transparent_70%)]" />

      <div className="relative z-10 flex flex-col items-center space-y-16 w-full max-w-sm">
        <header className="text-center">
          <h2 className="text-sm font-headline uppercase tracking-[0.4em] text-primary/80 mb-2">GenLayer Node</h2>
          <div className="h-1 w-12 bg-primary/40 mx-auto rounded-full" />
        </header>

        <Orb size="lg" />

        <div className="space-y-8 w-full">
          <div className="h-12 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={messageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center text-muted-foreground text-sm font-medium italic"
              >
                "{STATUS_MESSAGES[messageIndex]}"
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="space-y-4">
            {STEPS.map((step) => {
              const isActive = activeStep >= step.id;
              const isCurrent = activeStep === step.id;

              return (
                <div key={step.id} className="flex items-center space-x-4">
                  <div className={`relative h-2 w-2 rounded-full transition-all duration-500 ${isActive ? 'bg-primary' : 'bg-white/10'}`}>
                    {isCurrent && (
                      <motion.div
                        layoutId="active-glow"
                        className="absolute inset-0 rounded-full bg-primary animate-ping"
                      />
                    )}
                  </div>
                  <span className={`text-[10px] font-headline uppercase tracking-widest transition-colors duration-500 ${isActive ? 'text-white' : 'text-muted-foreground/30'}`}>
                    {step.label}
                  </span>
                  {isActive && step.id < activeStep && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "auto" }}
                      className="ml-auto"
                    >
                      <div className="text-[10px] text-primary font-bold">DONE</div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
