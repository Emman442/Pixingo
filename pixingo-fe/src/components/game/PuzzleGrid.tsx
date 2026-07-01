
"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export const PuzzleGrid = ({ images }: { images: string[] }) => {
  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 w-full aspect-square">
      {images.map((src, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.03 }}
          className="relative group overflow-hidden rounded-2xl border-2 border-white/5 bg-muted"
        >
          <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
          <Image
            src={src}
            alt={`Puzzle part ${index + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.4)]" />
        </motion.div>
      ))}
    </div>
  );
};
