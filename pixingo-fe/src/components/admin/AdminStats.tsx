
"use client";

import { motion } from "framer-motion";
import { 
  Puzzle as PuzzleIcon, 
  CheckCircle, 
  XCircle, 
  User, 
  Users, 
  Trophy,
  Zap
} from "lucide-react";
import { Card } from "@/components/ui/card";

interface AdminStatsProps {
  puzzles: any[];
}

export function AdminStats({ puzzles }: AdminStatsProps) {
  const stats = [
    {
      label: "Total Puzzles",
      value: puzzles.length,
      icon: PuzzleIcon,
      color: "text-blue-400",
      bg: "bg-blue-400/10"
    },
    {
      label: "Active Puzzles",
      value: puzzles.filter(p => p.status === 'active').length,
      icon: CheckCircle,
      color: "text-green-400",
      bg: "bg-green-400/10"
    },
    {
      label: "Inactive Puzzles",
      value: puzzles.filter(p => p.status === 'inactive').length,
      icon: XCircle,
      color: "text-red-400",
      bg: "bg-red-400/10"
    },
    {
      label: "Solo Games",
      value: "1,242", // Mock data for prototype
      icon: User,
      color: "text-purple-400",
      bg: "bg-purple-400/10"
    },
    {
      label: "Duel Matches",
      value: "485", // Mock data for prototype
      icon: Users,
      color: "text-secondary",
      bg: "bg-secondary/10"
    },
    {
      label: "Royale Events",
      value: "92", // Mock data for prototype
      icon: Trophy,
      color: "text-accent",
      bg: "bg-accent/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
        >
          <Card className="glass-card p-6 border-white/5 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
              <stat.icon size={80} />
            </div>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="text-[10px] font-headline font-bold uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </span>
            </div>
            
            <div className="flex items-baseline space-x-2">
              <h3 className="text-4xl font-headline font-bold text-white tracking-tighter">
                {stat.value}
              </h3>
              <div className="h-1 w-1 rounded-full bg-primary" />
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
