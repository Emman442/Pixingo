"use client";
import React from 'react'
import { useMemo } from "react";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    Trophy,
    Brain,
    Timer,
    Target,
    CheckCircle2,
    RotateCcw,
    Share2,
    Sparkles,
    Loader2,
    Badge,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RoundResult } from '@/lib/contracts/types';

interface GameProps {
    game_id: string;
    player: string;
    status: string;          // "active" | "completed" | "abandoned"
    current_round: string;
    total_rounds: number;
    total_score: number;
    puzzle_ids: [string];
    round_results: [RoundResult]
    started_at: string;
    completed_at: string;
}

export default function SoloResult({ game, isLoading }: { game: GameProps, isLoading: boolean }) {

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
                <Loader2 className="animate-spin text-primary mb-4" size={48} />
                <p className="text-muted-foreground font-headline uppercase tracking-widest text-xs">Fetching your results...</p>
            </div>
        );
    }

    const title =
        game.total_score >= 600
            ? "Puzzle Master"
            : game.total_score >= 500
                ? "Vision Sage"
                : game.total_score >= 400
                    ? "Image Hunter"
                    : "Rookie Decoder";

    const averageTime =
        (
            game.round_results.reduce(
                (sum, round) => sum + round.time_taken_seconds,
                0
            ) / game.round_results.length
        ).toFixed(1);
    const correctAnswers = game.round_results.filter(
        (round) => round.ai_verdict === "correct"
    ).length;

    const accuracy =
        (correctAnswers / game.round_results.length) * 100;

    const scoreColor = useMemo(() => {
        if (game.total_score >= 600) return "text-yellow-400";
        if (game.total_score >= 500) return "text-primary";
        return "text-white";
    }, [game.total_score]);
    return (
        <div className="min-h-screen px-6 py-12 relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(157,80,255,0.18)_0%,_transparent_60%)]">
            <Confetti recycle={false} numberOfPieces={450} />

            {/* Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 blur-[180px]" />

            <div className="relative z-10 max-w-5xl mx-auto space-y-10">
                {/* HERO */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-5"
                >
                    <div className="mx-auto h-24 w-24 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
                        <Trophy className="h-12 w-12 text-yellow-400" />
                    </div>

                    <div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight">
                            MISSION COMPLETE!
                        </h1>
                    </div>

                    <div className={`text-8xl font-black ${scoreColor}`}>
                        {game.total_score}
                    </div>

                    <div className="inline-flex items-center px-5 py-2 rounded-full border border-primary/30 bg-primary/10">

                        <span className="font-bold uppercase tracking-widest text-sm">
                            Solo Game
                        </span>
                    </div>
                </motion.div>

                {/* STATS */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                    <StatCard
                        icon={<Target className="h-5 w-5" />}
                        label="Accuracy"
                        value={`${accuracy}%`}
                    />

                    <StatCard
                        icon={<Timer className="h-5 w-5" />}
                        label="Average Time"
                        value={`${averageTime}s`}
                    />

                    <StatCard
                        icon={<Brain className="h-5 w-5" />}
                        label="Rounds"
                        value={`${game.total_rounds}/${game.total_rounds}`}
                    />

                    <StatCard
                        icon={<Badge className="h-5 w-5" />}
                        label="Rank"
                        value={title}
                    />
                </motion.div>

                {/* ROUND BREAKDOWN */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4"
                >
                    <h2 className="text-2xl font-black uppercase">
                        Round Breakdown
                    </h2>

                    {game.round_results.map((round, index) => (
                        <Card
                            key={round.puzzle_id}
                            className="glass border-primary/10 hover:border-primary/30 transition-all"
                        >
                            <CardContent className="p-5">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="text-xs uppercase tracking-widest text-muted-foreground">
                                            Round {index + 1}
                                        </div>

                                        <div className="text-2xl font-black mt-1">
                                            {round.player_answer}
                                        </div>

                                        <div className="text-xs text-muted-foreground mt-2">
                                            Solved in {round.time_taken_seconds}s
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div
                                            className={`${round.ai_verdict === "partial" ||
                                                    round.ai_verdict === "correct"
                                                    ? "text-green-400"
                                                    : "text-red-400"
                                                } font-black flex items-center gap-2 justify-end`}
                                        >
                                            <CheckCircle2 className="h-4 w-4" />
                                            {round.ai_verdict}
                                        </div>

                                        <div className="text-3xl font-black text-primary">
                                            {round.score}
                                        </div>

                                        <div className="text-xs uppercase tracking-widest">
                                            XP
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </motion.div>

                {/* CTA */}
                <div className="grid md:grid-cols-2 gap-4 pt-4">
                    <Link href="/solo">
                        <Button className="w-full h-14 font-bold uppercase tracking-widest">
                            Play Again
                        </Button>
                    </Link>

                    <Link href="/">
                        <Button
                            variant="ghost"
                            className="w-full h-14 uppercase tracking-widest"
                        >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Back Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}


function StatCard({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <Card className="glass border-primary/10">
            <CardContent className="p-5">
                <div className="flex items-center gap-2 text-primary mb-3">
                    {icon}
                </div>

                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                    {label}
                </div>

                <div className="text-2xl font-black mt-1">
                    {value}
                </div>
            </CardContent>
        </Card>
    );

}
