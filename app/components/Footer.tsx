"use client";

import { useState, useEffect } from 'react';

interface FooterProps {
    openModal: (content: string) => void;
}

function FooterButtons({ openModal }: FooterProps) {
    return (
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <button onClick={() => openModal('FAQ')} className="footer-link m-1">FAQ</button>
            <button onClick={() => openModal('Terms of Use')} className="footer-link m-1">Terms of Use</button>
            <button onClick={() => openModal('Contact')} className="footer-link m-1">Contact</button>
        </div>
    );
}

function FooterText() {
    const year = new Date().getFullYear();
    return (
        <p className='m-2'>© {year}. Created by <span style={{ color: "#7a95d2" }}>Pjotr Tinke</span> & <span style={{ color: "#ffa74f" }}>Thomas von Mentlen</span></p>
    );
}

export default function Footer({ openModal }: FooterProps) {
    const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768);
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <footer className="footer flex flex-col md:flex-row justify-between items-center p-4">
            {isSmallScreen ? (
                <>
                    <FooterButtons openModal={openModal} />
                    <FooterText />
                </>
            ) : (
                <>
                    <FooterText />
                    <FooterButtons openModal={openModal} />
                </>
            )}
        </footer>
    );
}