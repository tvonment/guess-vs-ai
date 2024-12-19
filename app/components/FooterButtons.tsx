import { ModalState } from "@/model/ModalState";
import React, { useState, useEffect } from 'react';

interface FooterButtonsProps {
    openModal: (content: ModalState) => void;
}

export default function FooterButtons({ openModal }: FooterButtonsProps) {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isStandalone, setIsStandalone] = useState<boolean>(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as any);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Check if the app is running in standalone mode
        const checkStandaloneMode = () => {
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
            setIsStandalone(isStandalone);
        };

        checkStandaloneMode();
        window.addEventListener('resize', checkStandaloneMode);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('resize', checkStandaloneMode);
        };
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            setDeferredPrompt(null);
        }
    };

    return (
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            {!isStandalone && (
                <button onClick={handleInstallClick} className="footer-link m-1">Install App</button>
            )}
            <button onClick={() => openModal(ModalState.STATISTICS)} className="footer-link m-1">Statistics</button>
            <button onClick={() => openModal(ModalState.TOU)} className="footer-link m-1">Terms of Use</button>
            <button onClick={() => openModal(ModalState.CONTACT)} className="footer-link m-1">Contact</button>
        </div>
    );
}
