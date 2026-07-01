
"use client";

import { motion } from "framer-motion";
import { LucideIcon, Trophy, Users, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface GameModeCardProps {
  title: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  icon: LucideIcon;
  variant: "primary" | "secondary" | "accent";
  disabled?: boolean;
}

export const GameModeCard = ({
  title,
  description,
  features,
  cta,
  href,
  icon: Icon,
  variant,
  disabled,
}: GameModeCardProps) => {
  const colors = {
    primary: "from-primary/20 via-primary/5 to-transparent border-primary/30",
    secondary: "from-secondary/20 via-secondary/5 to-transparent border-secondary/30",
    accent: "from-accent/20 via-accent/5 to-transparent border-accent/30",
  }[variant];

  const buttonVariant = {
    primary: "bg-primary hover:bg-primary/90",
    secondary: "bg-secondary hover:bg-secondary/90",
    accent: "bg-accent hover:bg-accent/90 text-background",
  }[variant];

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;     // ← Add this at the top
    // ... rest of your code
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full"
    >
      <Card className={`relative overflow-hidden border-2 bg-gradient-to-br p-6 ${colors}`}>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-3">
            <div className={`rounded-xl p-3 ${variant === 'accent' ? 'bg-accent/20 text-accent' : variant === 'secondary' ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'}`}>
              <Icon size={24} />
            </div>
            <h3 className="text-2xl font-headline tracking-tight">{title}</h3>
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>

          <ul className="space-y-2">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center text-xs text-foreground/80">
                <div className="mr-2 h-1 w-1 rounded-full bg-current opacity-50" />
                {feature}
              </li>
            ))}
          </ul>

          <Link href={href} className="pt-4">
            {/* <Button className={`w-full font-headline uppercase tracking-wider py-6 ${buttonVariant}`} disabled={disabled} onClick={disabled ? undefined : handleClick} >
              {cta}
            </Button> */}
            <Button
              className={`w-full font-headline uppercase tracking-wider py-6 ${buttonVariant} 
    ${disabled
                  ? 'opacity-50 cursor-not-allowed pointer-events-none'
                  : 'hover:opacity-90 active:scale-[0.98]'}`}
              disabled={disabled}
              onClick={disabled ? undefined : handleClick}
            >
              {cta}
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
};
