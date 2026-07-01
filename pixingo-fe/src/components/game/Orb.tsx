
"use client";

import { motion } from "framer-motion";

export const Orb = ({ size = "lg" }: { size?: "sm" | "md" | "lg" }) => {
  const dimensions = {
    sm: "w-24 h-24",
    md: "w-40 h-40",
    lg: "w-64 h-64",
  }[size];

  return (
    <div className={`relative ${dimensions} flex items-center justify-center`}>
      {/* Outer Glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 rounded-full bg-primary/30 blur-2xl"
      />
      
      {/* Secondary Glow */}
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 rounded-full bg-secondary/20 blur-xl"
      />

      {/* The Core */}
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="relative w-full h-full rounded-full bg-gradient-to-tr from-primary via-secondary to-accent/50 p-1 shadow-[0_0_50px_rgba(157,80,255,0.5)]"
      >
        <div className="w-full h-full rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center overflow-hidden">
          {/* Internal Particles/Energy */}
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-1/2 h-1/2 rounded-full bg-primary/40 blur-md"
          />
        </div>
      </motion.div>

      {/* Orbital Ring */}
      <motion.div
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -inset-4 rounded-full border-t-2 border-primary/20"
      />
    </div>
  );
};
