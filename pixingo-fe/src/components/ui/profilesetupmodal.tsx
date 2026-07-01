"use client";

import { useState } from "react";
import { Shield, User, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import { useCreateProfile } from "../../hooks/Pixingo";
import { toast } from "sonner";
import { useWallets } from "@privy-io/react-auth";

interface ProfileSetupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProfileCreated: () => void;
    address: string;
}

export default function ProfileSetupModal({
    isOpen,
    onClose,
    onProfileCreated,
    address,
}: ProfileSetupModalProps) {
    const [username, setUsername] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const createProfileMutation = useCreateProfile();
    const { wallets } = useWallets();
    const isUsernameValid = username.trim().length >= 5;

    const handleCreateProfile = async () => {
        if (!username) return;

        try {
            setIsCreating(true);

            await createProfileMutation.mutateAsync({
                username,
            });

            onProfileCreated();
        } catch (err) {
            console.error(err);
            toast.error("Failed to create profile", {
                description: err instanceof Error ? err.message : "Something went wrong",
            });
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            showCloseButton={false}
            size="md"
        >
            <div className="space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                        <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold text-white">
                        Welcome to Pixingo!
                    </h2>
                    <p>Set up your profile to get started</p>

                </div>


                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Username
                        </label>
                        <Input
                            placeholder="e.g. emmanuel_dev"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="bg-white/5 border-white/10"
                        />
                    </div>

                    <Button onClick={handleCreateProfile} disabled={isCreating || !isUsernameValid} className="w-full bg-primary hover:bg-primary/90">
                        {isCreating ? "Creating Profile..." : "Create Profile"}
                    </Button>

                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-xs text-muted-foreground">
                            Registering with wallet{" "}
                            <span className="font-mono">
                                {address?.slice(0, 6)}...{address?.slice(-4)}
                            </span>
                        </p>
                    </div>
                </div>

            </div>
        </Modal>
    );
}