import { TransactionReceipt } from "@privy-io/react-auth";
import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";

import { TransactionStatus } from "genlayer-js/types"
import { parseEther } from "viem";
import { Puzzle, SoloGame, UserProfile } from "./types";


/**
 * Pixingo contract class for interacting with the GenLayer Pixingo contract
 */

class Pixingo {
    private contractAddress: `0x${string}`;
    private client: ReturnType<typeof createClient>;

    constructor(
        contractAddress: string,
        address?: string | null,
        studioUrl?: string
    ) {
        this.contractAddress = contractAddress as `0x${string}`;

        const config: any = {
            chain: studionet,
        };

        if (address) {
            config.account = address as `0x${string}`;
        }

        if (studioUrl) {
            config.endpoint = studioUrl;
        }

        this.client = createClient(config);
    }

    /**
     * Update the address used for transactions
     */
    updateAccount(address: string): void {
        const config: any = {
            chain: studionet,
            account: address as `0x${string}`,
        };

        this.client = createClient(config);
    }


    /**
     * Get a particular user profile from the contract
     * @returns a user profile object with all relevant details
     */
    async CheckIfProfileExists(account_address: string): Promise<boolean> {

        try {
            const profile_exists: any = await this.client.readContract({
                address: this.contractAddress,
                functionName: "player_exists",
                args: [account_address],
            });

            return profile_exists as boolean;

        } catch (error) {
            console.error("Error fetching user profile:", error);
            throw new Error("Failed to check if user profile exists");
        }
    }


    async getUserProfile(wallet_address: string): Promise<UserProfile
    > {
        try {
            const profile: any = await this.client.readContract({
                address: this.contractAddress,
                functionName: "get_user",
                args: [wallet_address],
            });

            console.log("profile: ", profile)


            return profile as UserProfile;

        } catch (error) {
            console.error("Error fetching user profile:", error);
            throw new Error("Failed to fetch user profile");
        }
    }

    async getPuzzles(): Promise<Puzzle[]
    > {
        try {
            const puzzles: any = await this.client.readContract({
                address: this.contractAddress,
                functionName: "get_all_puzzles",
            });


            return puzzles as Puzzle[];

        } catch (error) {
            console.error("Error fetching puzzles: ", error);
            throw new Error("Failed to fetch puzzles");
        }
    }

    async getSoloGame(gameId: string): Promise<SoloGame> {
        try {
            const game: any = await this.client.readContract({
                address: this.contractAddress,
                functionName: "get_solo_game",
                args: [gameId]
            });


            return game as SoloGame;

        } catch (error) {
            console.error("Error fetching solo game: ", error);
            throw new Error("Failed to fetch solo game");
        }
    }





    async createProfile(username: string) {
        await this.client.connect("studionet");
        try {
            const txHash = await this.client.writeContract({
                address: this.contractAddress,
                functionName: "register_player",
                args: [username],
                value: BigInt(0),
            });

            const receipt = await this.client.waitForTransactionReceipt({
                hash: txHash,
                status: "ACCEPTED" as any,
            });
            console.log("Receopttt", receipt)
            return receipt as TransactionReceipt
                ;
        } catch (error) {
            console.error("Error creating profile:", error);
            throw new Error("Failed to create profile");
        }
    }


    async addPuzzle(
        image_1: string,
        image_2: string,
        image_3: string,
        image_4: string,
        theme: string,
        difficulty: string,
        answer_hint: string,
    ) {

        await this.client.connect("studionet");
        try {
            const txHash = await this.client.writeContract({
                address: this.contractAddress,
                functionName: "add_puzzle",
                args: [image_1, image_2, image_3, image_4, theme, difficulty, answer_hint],
                value: BigInt(0),

            });

            const receipt = await this.client.waitForTransactionReceipt({
                hash: txHash,
                status: TransactionStatus.ACCEPTED,
            });

            return receipt as TransactionReceipt;
        } catch (error) {
            console.error("Error adding Puzzle:", error);
            throw new Error("Failed to add puzzle");
        }
    }

    async startSoloGame(
        puzzle_ids: [string]
    ) {

        await this.client.connect("studionet");
        try {
            const txHash = await this.client.writeContract({
                address: this.contractAddress,
                functionName: "start_solo_game",
                args: [puzzle_ids],
                value: BigInt(0)
            });

            const receipt = await this.client.waitForTransactionReceipt({
                hash: txHash,
                status: TransactionStatus.ACCEPTED,
            });

            return receipt as TransactionReceipt;
        } catch (error) {
            console.error("Error starting Solo game:", error);
            throw new Error("Failed to start solo game");
        }
    }

    async submitSoloGame(
        game_id: string,
        answers: [string],
        time_taken_list: [number]
    ) {

        await this.client.connect("studionet");
        try {
            const txHash = await this.client.writeContract({
                address: this.contractAddress,
                functionName: "submit_solo_game",
                args: [game_id, answers, time_taken_list],
                value: BigInt(0)
            });

            const receipt = await this.client.waitForTransactionReceipt({
                hash: txHash,
                status: TransactionStatus.ACCEPTED,
                retries: 60,
                interval: 5000
            });

            return receipt as TransactionReceipt;
        } catch (error) {
            console.error("Error submitting game details: ", error);
            throw new Error("Failed to record your game details");
        }
    }







}


export default Pixingo;