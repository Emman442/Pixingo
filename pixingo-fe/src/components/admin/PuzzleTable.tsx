
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Calendar,
  Puzzle as PuzzleIcon,
  Search,
  Filter,
  ShieldCheck,
  ShieldX,
  Loader2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { PuzzleGrid } from "@/components/game/PuzzleGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";


interface PuzzleTableProps {
  puzzles: any[];
  loading: boolean;
}

export function PuzzleTable({ puzzles, loading }: PuzzleTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPuzzle, setSelectedPuzzle] = useState<any>(null);
  console.log(puzzles)

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2
          className="animate-spin text-primary" size={48} />
      </div>
    );
  }


  const filteredPuzzles = puzzles.filter(p =>
    p.theme.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.puzzle_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const togglePuzzleStatus = async (puzzle: any) => {

  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            placeholder="Search by ID or Theme..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs focus:ring-1 focus:ring-primary/50 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="border-white/10 text-[10px] uppercase tracking-widest font-bold">
            <Filter size={14} className="mr-2" /> Filter
          </Button>
          <Button variant="outline" className="border-white/10 text-[10px] uppercase tracking-widest font-bold">
            <Calendar size={14} className="mr-2" /> Recent
          </Button>
        </div>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden border-white/5">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="hover:bg-transparent border-white/5">
              <TableHead className="text-[10px] uppercase tracking-widest font-bold py-4">Puzzle ID</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold">Theme Connection</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold">Difficulty</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold">Status</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-white/5">
                  <TableCell colSpan={6}><Skeleton className="h-12 w-full bg-white/5" /></TableCell>
                </TableRow>
              ))
            ) : filteredPuzzles.length > 0 ? (
              filteredPuzzles.map((puzzle) => (
                <TableRow key={puzzle.id} className="hover:bg-white/5 border-white/5 group transition-colors">
                  <TableCell className="font-mono text-[10px] text-muted-foreground py-5">
                    {puzzle.puzzle_id.slice(0, 12)}...
                  </TableCell>
                  <TableCell className="font-headline font-bold text-white uppercase tracking-wider">
                    {puzzle.theme}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] font-bold border-transparent ${puzzle.difficulty === 'easy' ? 'bg-green-500/10 text-green-400' :
                        puzzle.difficulty === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                          'bg-red-500/10 text-red-400'
                      }`}>
                      {puzzle.difficulty?.toUpperCase()}
                    </Badge>
                  </TableCell>
               
                  <TableCell>
                    <Badge className={puzzle.is_active === true ? 'bg-primary/20 text-primary border-primary/20' : 'bg-muted text-muted-foreground border-white/5'}>
                      {puzzle?.is_active? "active": "inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-primary/20 text-primary" onClick={() => setSelectedPuzzle(puzzle)}>
                            <Eye size={14} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl bg-background border-white/5 overflow-y-auto max-h-[90vh]">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-headline font-bold uppercase tracking-tight flex items-center gap-3">
                              <PuzzleIcon className="text-primary" /> Puzzle Explorer
                            </DialogTitle>
                          </DialogHeader>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
                            <div className="aspect-square">
                              <PuzzleGrid images={[puzzle?.image_1, puzzle?.image_2, puzzle?.image_3, puzzle?.image_4]} />
                            </div>
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <span className="text-[8px] uppercase font-bold tracking-widest text-muted-foreground">Internal ID</span>
                                  <div className="text-[10px] font-mono bg-white/5 p-2 rounded border border-white/5 truncate">{puzzle.puzzle_id}</div>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-[8px] uppercase font-bold tracking-widest text-muted-foreground">Protocol Status</span>
                                  <Badge className="block w-fit uppercase text-[10px]">{puzzle.is_active?"active": "inactive"}</Badge>
                                </div>
                              </div>

                              <div className="space-y-4 pt-4 border-t border-white/5">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Semantic Connection</span>
                                  <span className="text-lg font-headline font-bold text-white uppercase">{puzzle.theme}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Difficulty Rating</span>
                                  <Badge variant="outline" className="font-bold">{puzzle.difficulty.toUpperCase()}</Badge>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Answer Hint</span>
                                  <p className="text-xs italic text-muted-foreground bg-white/5 p-3 rounded-xl">{puzzle.answer_hint || "No hint data stored."}</p>
                                </div>
                              </div>

                              <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4 text-[10px] text-muted-foreground">
                                <div>
                                  <span className="block font-bold uppercase tracking-widest mb-1">Created By</span>
                                  <span className="text-white">NODE_{puzzle?.created_by?.slice(0, 8)}</span>
                                </div>
                            
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="icon" variant="ghost" className={`h-8 w-8 hover:bg-white/10 ${puzzle.status === 'active' ? 'text-orange-400' : 'text-green-400'}`}>
                            {puzzle.status === 'active' ? <ShieldX size={14} /> : <ShieldCheck size={14} />}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-background border-white/5">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-headline font-bold uppercase tracking-tight">
                              Confirm State Change
                            </DialogTitle>
                          </DialogHeader>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Are you sure you want to {puzzle.status === 'active' ? 'deactivate' : 'activate'} this puzzle?
                            This will {puzzle.status === 'active' ? 'remove it from' : 'add it to'} the active game pool.
                          </p>
                          <DialogFooter className="gap-2 sm:gap-0">
                            <DialogClose asChild>
                              <Button variant="ghost" className="uppercase tracking-widest text-[10px] font-bold">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button
                                variant={puzzle.status === 'active' ? 'destructive' : 'default'}
                                className="uppercase tracking-widest text-[10px] font-bold bg-primary hover:bg-primary/90"
                                onClick={() => togglePuzzleStatus(puzzle)}
                              >
                                {puzzle.status === 'active' ? 'Deactivate Puzzle' : 'Activate Puzzle'}
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="py-24 text-center">
                  <div className="flex flex-col items-center space-y-4 opacity-20">
                    <PuzzleIcon size={64} />
                    <p className="text-xs uppercase tracking-[0.4em] font-bold">No puzzles detected in the rift</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
