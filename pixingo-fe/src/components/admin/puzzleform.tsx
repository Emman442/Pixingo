
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PuzzleGrid } from "@/components/game/PuzzleGrid";
import { Eye, Plus, Trash2, Wand2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { Puzzle } from "@/lib/contracts/types";
import { useAddPuzzle } from "@/hooks/Pixingo";
import toast from "@/lib/utils/toast";

interface PuzzleFormProps {
    onSubmitting: (msg: string | null) => void;
}

export function PuzzleForm({ onSubmitting }: PuzzleFormProps) {
    const [formData, setFormData] = useState({
        image1: "",
        image2: "",
        image3: "",
        image4: "",
        theme: "",
        difficulty: "medium",
        hint: ""
    });
    const { isPending: isAddingPuzzle, mutate: AddPuzzle } = useAddPuzzle()


    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const images = [formData.image1, formData.image2, formData.image3, formData.image4]
    const allImagesSet = images.every(img => img.length > 0);

    const handleCreatePuzzle = async () => {

        onSubmitting("Uploading puzzle to VisionQuest...");
        const puzzleData: Puzzle = {
            image_1: formData.image1,
            image_2: formData.image2,
            image_3: formData.image3,
            image_4: formData.image4,
            theme: formData.theme,
            difficulty: formData.difficulty,
            answer_hint: formData.hint,
        };

        AddPuzzle(puzzleData, {
            onSuccess: () => {
                toast.success("Puzzle Added Successfully!", {
                    description: "Your puzzle has been added successfully!",
                })
                onSubmitting(null);
                setFormData({
                    image1: "",
                    image2: "",
                    image3: "",
                    image4: "",
                    theme: "",
                    difficulty: "easy",
                    hint: ""
                });
                setIsPreviewMode(false);
            },
            onError: () => {
                toast.error("Failed to Add Puzzle. Please try again.")
            }
        })

    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <Card className="glass-card p-8 border-white/5 space-y-8">
                <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
                        <Plus size={24} />
                    </div>
                    <h2 className="text-2xl font-headline font-bold uppercase tracking-tight">Create Puzzle</h2>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((num) => (
                            <div key={num} className="space-y-2">
                                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Image {num} URL</Label>
                                <Input
                                    placeholder="https://..."
                                    className="bg-white/5 border-white/10 text-xs py-5 rounded-xl focus:border-primary/50 transition-all"
                                    value={(formData as any)[`image${num}`]}
                                    onChange={(e) => setFormData({ ...formData, [`image${num}`]: e.target.value })}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Puzzle Connection (Theme)</Label>
                        <Input
                            placeholder="e.g. Heat, Time, Justice"
                            className="bg-white/5 border-white/10 py-6 rounded-xl focus:border-primary/50"
                            value={formData.theme}
                            onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Difficulty</Label>
                            <Select value={formData.difficulty} onValueChange={(val) => setFormData({ ...formData, difficulty: val })}>
                                <SelectTrigger className="bg-white/5 border-white/10 py-6 rounded-xl">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-white/5">
                                    <SelectItem value="easy">Easy</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="hard">Hard</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Hint (Optional)</Label>
                            <Input
                                placeholder="A slight nudge..."
                                className="bg-white/5 border-white/10 py-6 rounded-xl focus:border-primary/50"
                                value={formData.hint}
                                onChange={(e) => setFormData({ ...formData, hint: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <Button
                        variant="outline"
                        className="flex-1 py-7 uppercase tracking-widest text-xs font-headline border-white/10 hover:bg-white/5 rounded-2xl"
                        onClick={() => setIsPreviewMode(!isPreviewMode)}
                        disabled={!allImagesSet}
                    >
                        <Eye size={18} className="mr-2" />
                        {isPreviewMode ? "Hide Preview" : "Preview Puzzle"}
                    </Button>
                    <Button
                        className="flex-1 py-7 uppercase tracking-widest text-xs font-headline bg-primary hover:bg-primary/90 rounded-2xl shadow-xl shadow-primary/20"
                        onClick={handleCreatePuzzle}
                        disabled={!allImagesSet || !formData.theme || isAddingPuzzle}
                    >
                        <Wand2 size={18} className="mr-2" />
                        {!isAddingPuzzle? "Create Puzzle": "Creating Puzzle...."}
                    </Button>
                </div>
            </Card>

            <div className="space-y-8">
                {isPreviewMode && allImagesSet ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-headline font-bold uppercase tracking-widest text-primary">Live Preview</h3>
                            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest border-white/10 text-muted-foreground">
                                Format: 2x2 Grid
                            </Badge>
                        </div>

                        <div className="max-w-md mx-auto">
                            <PuzzleGrid images={images} />
                        </div>

                        <Card className="bg-primary/5 border-primary/20 p-6 rounded-2xl space-y-4">
                            <div className="flex items-center justify-between border-b border-primary/10 pb-4">
                                <span className="text-[10px] uppercase font-bold tracking-widest text-primary">Puzzle Data</span>
                                <Badge className={formData.difficulty === 'easy' ? 'bg-green-500' : formData.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'}>
                                    {formData.difficulty.toUpperCase()}
                                </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <span className="text-[8px] uppercase font-bold tracking-widest text-muted-foreground">Theme Connection</span>
                                    <div className="text-sm font-headline font-bold text-white uppercase">{formData.theme || "---"}</div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[8px] uppercase font-bold tracking-widest text-muted-foreground">Hint Display</span>
                                    <div className="text-sm font-headline italic text-muted-foreground">{formData.hint || "No hint provided"}</div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 border-2 border-dashed border-white/5 rounded-3xl opacity-20">
                        <Eye size={80} />
                        <p className="text-xs uppercase tracking-widest font-bold">Input images to enable live preview</p>
                    </div>
                )}
            </div>
        </div>
    );
}
