"use client"

import React, { useEffect, useState } from 'react'
import { Button } from './button'
import { usePathname } from 'next/navigation'
import { useWallets, usePrivy } from '@privy-io/react-auth'
import { Power, Wallet } from 'lucide-react'
import toast from '@/lib/utils/toast';
import Modal from './modal';
import ProfileSetupModal from './profilesetupmodal';
import LoginButton from './loginButton'
import { useCheckIfProfileExists } from '@/hooks/Pixingo'
import { CircleLoader } from 'react-spinners';


export default function Navbar() {

    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const { wallets, ready } = useWallets();
    const { logout } = usePrivy();
    const [hasChecked, setHasChecked] = useState(false);
    const [showSetupModal, setShowSetupModal] = useState(false);
    const embeddedWallet = wallets[0];
    const address = embeddedWallet?.address;
    const { isLoading, data: profileExists } = useCheckIfProfileExists(address);
    console.log(profileExists)
    // console.log(address)

    useEffect(() => {
        if (!address) {
            setHasChecked(false);
            setShowSetupModal(false);
            return;
        }

        // Wait for loading to finish
        if (isLoading) return;

        // Only run once per address
        if (hasChecked) return;

        setHasChecked(true);

        if (profileExists) {
            toast.success("Welcome back!", {
                description: `${address.slice(0, 6)}...${address.slice(-4)}`,
            });
        } else {
            setShowSetupModal(true);
        }
    }, [address, isLoading, profileExists, hasChecked]);

    return (
        <>
            <Modal
                isOpen={!!address && isLoading}
                onClose={() => { }}
                showCloseButton={false}
                size="sm"
            >
                <div className="flex flex-col items-center gap-4 py-4">
                    <CircleLoader size={30} color="#BC17FD" />
                    <div className="text-center space-y-1">
                        <p className="text-sm font-bold text-white">Checking your profile</p>
                        <p className="text-xs text-muted-foreground">
                            Connecting to GenLayer...
                        </p>
                    </div>
                </div>
            </Modal>


            {isLoading == false && <ProfileSetupModal
                isOpen={showSetupModal}
                onClose={() => setShowSetupModal(false)}
                address={address || ""}
                onProfileCreated={() => {
                    toast.success("Profile created!", {
                        description: "Welcome to Pixingo!",
                    });
                    setShowSetupModal(false);
                }}
            />}

            <div className="w-full flex justify-end">
                {address ? (
                    <Button
                        variant="outline"

                    // className="h-10 rounded-full border-primary/20 bg-primary/5 text-[10px] font-headline font-bold uppercase tracking-widest text-primary hover:bg-primary/10"
                    >
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2 animate-pulse" />
                        {address.slice(0, 6)}...{address.slice(-4)}
                        <Power size={12} className="ml-2 opacity-50" />
                    </Button>
                ) : (
                    <LoginButton />
                )}
            </div>

        </>
    )
}
