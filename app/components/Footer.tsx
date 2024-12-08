"use client";

import { useState, useEffect } from 'react';
import FooterButtons from './FooterButtons';

interface FooterProps {
    openModal: (content: string) => void;
}

function FooterText() {
    const year = new Date().getFullYear();
    return (
        <p className='m-1 lg:m-2'>© {year} <a href='https://www.cheesy-ai.com/' target='_blank'><span style={{ color: "#ffa74f" }}>Cheesy AI</span></a>. Created by <span style={{ color: "#7a95d2" }}>Pjotr Tinke</span> & <span style={{ color: "#ffa74f" }}>Thomas von Mentlen</span></p>
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
        <footer className="footer text-white flex flex-col md:flex-row justify-between items-center p-2 md:p-4">
            {isSmallScreen ? (
                <>
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