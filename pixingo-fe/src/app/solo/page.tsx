
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PuzzleGrid } from "@/components/game/PuzzleGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Timer, CheckCircle2, Zap, Brain, ShieldCheck, ChevronRight, Loader2 } from "lucide-react";
// import { MATCH_ROUNDS } from "@/app/lib/game-data";
import { useFetchPuzzles, useStartSoloGame, useSubmitSoloGame } from "@/hooks/Pixingo";
import toast from "@/lib/utils/toast";
import { CircleLoader } from "react-spinners";

type GameState = 'intro' | 'playing' | 'summary' | 'signing';

export default function SoloPage() {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState>('intro');
  const [currentRound, setCurrentRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isPending: isFetchingPuzzles, data: puzzles } = useFetchPuzzles()
  const { isPending: isStartingGame, mutate: StartGame } = useStartSoloGame()
  const { isPending: isSubmittingGame, mutate: SubmitGame } = useSubmitSoloGame()
  const [game, setGame] = useState<any>(null);
  // Timer Effect
  useEffect(() => {
    if (gameState !== 'playing') return;

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else { 
      handleNextRound("");
    }
  }, [timeLeft, gameState]);

  useEffect(() => {
    const storedGame = localStorage.getItem("pixingo_game");

    if (storedGame) {
      setGame(JSON.parse(storedGame));
    }
  }, []);

  const handleStartRun = () => {
    const shuffled = [...puzzles || []].sort(() => Math.random() - 0.5);
    const selectedPuzzles = shuffled.slice(0, 3);

    const puzzleIds: any = selectedPuzzles.map(
      (p) => p.puzzle_id
    );
    StartGame({ puzzle_ids: puzzleIds }, {
      onSuccess: (data) => {
        const gameId = data?.consensus_data?.leader_receipt?.[0]?.result?.payload?.readable?.replace(/"/g, "")
        console.log("gameId: ", gameId)
        const gameData = {
          gameId,
          currentRound: 1,
          totalRounds: puzzleIds.length,
          puzzleIds,
          score: 0,
          roundResults: [],
          startedAt: Date.now(),
        };

        localStorage.setItem(
          "pixingo_game",
          JSON.stringify(gameData)
        );
        setGame(gameData);
        setGameState("playing");
        setTimeLeft(30);

        toast.success("Game Started Successfully!")
      },
      onError: () => {
        toast.error("Failed to start game. Please try again.");
      }
    })
  };


  const handleNextRound = (submittedAnswer: string) => {
    const game = JSON.parse(
      localStorage.getItem("pixingo_game")!
    );

    game.roundResults.push({
      round: currentRound + 1,
      puzzleId: game.puzzleIds[currentRound],
      answer: submittedAnswer,
      timeUsed: 30 - timeLeft,
    });

    game.currentRound += 1;

    localStorage.setItem(
      "pixingo_game",
      JSON.stringify(game)
    );
    setGame(game);
    setIsSubmitting(true);

    setTimeout(() => {
      if (currentRound < game.totalRounds - 1) {
        setCurrentRound(currentRound + 1);
        setTimeLeft(30);
        setAnswer("");
        setIsSubmitting(false);
      } else {
        setGameState("summary");
        setIsSubmitting(false);
      }
    }, 1200);
  };

 const progressValue =
  game
    ? ((currentRound + 1) / game.totalRounds) * 100
    : 0;


  const currentPuzzleId =
    game?.puzzleIds?.[currentRound];

  const currentPuzzle = puzzles?.find(
    (p) => p.puzzle_id === currentPuzzleId
  );

  const answers = game?.roundResults.map(
    (r: any) => r.answer
  );

  const times = game?.roundResults.map(
    (r: any) => r.timeUsed
  );


  const images = [
    currentPuzzle?.image_1,
    currentPuzzle?.image_2,
    currentPuzzle?.image_3,
    currentPuzzle?.image_4,
  ].filter(Boolean) as string[];

  const handleSubmitGame = () => {
    if (answers.length !== game.totalRounds) {
      toast.error("Some rounds are missing");
      return;
    }
    setGameState('signing');
    SubmitGame({ game_id: game.gameId, answers: answers, time_taken_list: times }, {
      onSuccess: () => {
        toast.success("Game Datas Submitted Successfully");
        router.push(`/results?gameId=${game.gameId}&mode=solo`);
      },
      onError: () => {
        setGameState("summary");
        toast.error("Failed to Submit Game Details")
      }
    })
  };


  return (
    <div className="min-h-screen flex flex-col p-6 max-w-md mx-auto bg-background">
      <AnimatePresence mode="wait">
        {gameState === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col justify-center space-y-12"
          >
            <div className="space-y-4 text-center">
              <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-4">
                <Brain size={48} />
              </div>
              <h1 className="text-4xl font-headline font-bold tracking-tighter">Solo <span className="text-primary">Infiltration</span></h1>
              <p className="text-muted-foreground text-sm">
                Connect 4 rounds of semantic imagery. Your answers will be verified by the GenLayer Validator Network.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="h-10 w-10 rounded-xl bg-accent/20 text-accent flex items-center justify-center shrink-0">
                  <Timer size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest">30s per round</h4>
                  <p className="text-[10px] text-muted-foreground">Speed affects your final XP multiplier.</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="h-10 w-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest">AI Consensus</h4>
                  <p className="text-[10px] text-muted-foreground">GenLayer nodes verify semantic accuracy.</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleStartRun}
              disabled={isStartingGame}
              className="w-full py-8 text-xl font-headline uppercase tracking-[0.3em] rounded-2xl bg-primary hover:bg-primary/90 shadow-[0_10px_40px_rgba(157,80,255,0.3)]"
            >
              {!isStartingGame
                ? "Start Run" : "Starting Run..."}
            </Button>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col space-y-6"
          >
            <header className="space-y-4">
              <div className="flex justify-between items-center text-xs font-headline tracking-widest uppercase">
                <div className="text-muted-foreground">
                  Round <span className="text-white">{currentRound + 1}</span> of <span className="text-white">4</span>
                </div>
                <div className={`flex items-center gap-2 ${timeLeft < 10 ? 'text-destructive' : 'text-accent'}`}>
                  <Timer size={14} />
                  <span className="tabular-nums">{timeLeft}S</span>
                </div>
              </div>
              <Progress value={progressValue} className="h-1.5 bg-white/5" />
            </header>

            <div className="flex-1 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentRound}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="space-y-8"
                >
                  <PuzzleGrid images={images} />

                  <div className="space-y-4">
                    <div className="relative">
                      <Input
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Define the connection..."
                        className="py-8 px-6 text-lg bg-white/5 border-2 border-white/10 rounded-2xl focus:border-primary/50 transition-all placeholder:text-muted-foreground/30"
                        disabled={isSubmitting}
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && answer.trim() && handleNextRound(answer)}
                      />
                      {isSubmitting && (
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-2xl flex items-center justify-center space-x-2 text-primary">
                          <CheckCircle2 size={24} className="animate-bounce" />
                          <span className="font-headline uppercase tracking-widest text-sm font-bold">Transmitting...</span>
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={() => handleNextRound(answer)}
                      disabled={!answer.trim() || isSubmitting}
                      className="w-full py-8 text-lg font-headline uppercase tracking-[0.2em] bg-primary rounded-2xl"
                    >
                      Lock Answer
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {gameState === 'summary' && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col justify-center space-y-8"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-headline font-bold">Run <span className="text-primary">Complete</span></h2>
              <p className="text-muted-foreground text-xs uppercase tracking-widest">Verify answers on-chain</p>
            </div>

            {/* <div className="space-y-3">
              {answers.map((ans, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Round {i + 1}</span>
                  <span className="text-sm font-headline font-medium text-white">{ans || "(Skipped)"}</span>
                </div>
              ))}
            </div> */}

            <div className="pt-4 space-y-3">
              <Button
                onClick={handleSubmitGame}
                disabled={isSubmittingGame}
                className="w-full py-8 text-lg font-headline uppercase tracking-widest rounded-2xl bg-accent text-background hover:bg-accent/90"
              >
                {!isSubmittingGame ? "Get Game Results" : "Getting Game Results"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => window.location.reload()}
                className="w-full text-muted-foreground"
              >
                Discard Run
              </Button>
            </div>
          </motion.div>
        )}

        {gameState === 'signing' && (
          <motion.div
            key="signing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center space-y-6"
          >
            <div className="">
              <CircleLoader size={40} color="#BC17FD" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-headline font-bold text-xl uppercase tracking-widest">FETCHING RESULTS</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest animate-pulse">
                Please wait while we fetch your results from genlayer...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mt-auto pt-6 text-center">
        <p className="text-[8px] text-muted-foreground/30 uppercase tracking-[0.4em]">
          GenLayer Protocol • Secure Sandbox v1.2
        </p>
      </footer>
    </div>
  );
}
