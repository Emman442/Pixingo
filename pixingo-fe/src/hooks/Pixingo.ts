"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import TruthDuel from "@/lib/contracts/pixingo"
import { getContractAddress } from "@/lib/genlayer/client";
import type { Puzzle, SoloGame, UserProfile } from "@/lib/contracts/types";
import { toast } from "sonner";
import { useWallets } from "@privy-io/react-auth";


export function usePixingoContract(): TruthDuel | null {
    const { wallets } = useWallets();
    const contractAddress = getContractAddress();
    const address = wallets[0]?.address;

    return useMemo(() => {
        if (!contractAddress || !address) {
            return null;
        }
        return new TruthDuel(contractAddress, address);
    }, [contractAddress, address]);
}

export function useCheckIfProfileExists(account_address: string | null) {
    const contract = usePixingoContract();

    return useQuery<boolean, Error>({
        queryKey: ["profileExists", account_address],
        queryFn: async () => {
            if (!account_address) return false;
            if (!contract) throw new Error("Contract not initialized");

            return await contract.CheckIfProfileExists(account_address);
        },
        enabled: !!account_address && !!contract,
        retry: false,
    });
}

export function useUserProfile(wallet_address: string) {
    const contract = usePixingoContract();

    return useQuery<UserProfile, Error>({
        queryKey: ["userProfile", wallet_address],
        queryFn: () => {
            if (!contract) {
                throw new Error("Contract not initialized");
            }
            return contract.getUserProfile(wallet_address);
        },
        enabled: !!contract && !!wallet_address,
    });
}


export function useFetchPuzzles() {
    const contract = usePixingoContract();

    return useQuery<Puzzle[], Error>({
        queryKey: ["puzzles"],
        queryFn: () => {
            if (!contract) {
                throw new Error("Contract not initialized");
            }
            return contract.getPuzzles();
        },
        enabled: !!contract,
    });
}


export function useFetchSoloGame(gameId: string) {
    const contract = usePixingoContract();

    return useQuery<SoloGame, Error>({
        queryKey: ["solo_game"],
        queryFn: () => {
            if (!contract) {
                throw new Error("Contract not initialized");
            }
            return contract.getSoloGame(gameId);
        },
        enabled: !!contract,
    });
}


export function useCreateProfile() {
    const contract = usePixingoContract();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            username,
        }: {
            username: string;
        }) => {
            if (!contract) {
                throw new Error("Contract not initialized");
            }

            const receipt = await contract.createProfile(username);
            console.log("Profile creation transaction receipt:", receipt);
            return receipt;
        },

        onSuccess: async (_, variables) => {
            // refresh any relevant reads after profile creation
            await queryClient.invalidateQueries({
                queryKey: ["profileExists"],
            });

            await queryClient.invalidateQueries({
                queryKey: ["profile"],
            });
        },
    });
}


export function useAddPuzzle() {
    const contract = usePixingoContract();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            image_1,
            image_2,
            image_3,
            image_4,
            theme,
            difficulty,
            answer_hint
        }: {
            image_1: string,
            image_2: string,
            image_3: string,
            image_4: string,
            theme: string,
            difficulty: string,
            answer_hint: string,
        }) => {
            if (!contract) {
                throw new Error("Contract not initialized");
            }

            const receipt = await contract.addPuzzle(image_1, image_2, image_3, image_4, theme, difficulty, answer_hint);
            console.log("Puzzle Addition transaction receipt:", receipt);
            return receipt;
        },

        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({
                queryKey: ["puzzles"],
            });
        },
        onError: async (error) => {
            console.error("Error adding puzzle:", error);
            toast.error("Failed to add puzzle. Please try again.");
        }
    });
}


export function useStartSoloGame() {
    const contract = usePixingoContract();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            puzzle_ids
        }: {
            puzzle_ids: [string]
        }) => {
            if (!contract) {
                throw new Error("Contract not initialized");
            }

            const receipt = await contract.startSoloGame(puzzle_ids);
            console.log("Start Game transaction receipt:", receipt);
            console.log("FULL RECEIPT", JSON.stringify(receipt, null, 2));
            return receipt;
        },

        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({
                queryKey: ["solo_game"],
            });
        },
        onError: async (error) => {
            console.error("Error starting game:", error);
            toast.error("Failed to start game. Please try again.");
        }
    });
}

export function useSubmitSoloGame() {
    const contract = usePixingoContract();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            game_id,
            answers,
            time_taken_list
        }: {
            game_id: string,
            answers: [string],
            time_taken_list: [number]
        }) => {
            if (!contract) {
                throw new Error("Contract not initialized");
            }

            const receipt = await contract.submitSoloGame(game_id, answers, time_taken_list);
            console.log("Submit game details tx receipt:", receipt);
            console.log("FULL RECEIPT", JSON.stringify(receipt, null, 2));
            return receipt;
        },

        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({
                queryKey: ["solo_game"],
            });
        },
        onError: async (error) => {
            console.error("Error submitting game details:", error);
            toast.error("Failed to record game details. Please try again.");
        }
    });
}


