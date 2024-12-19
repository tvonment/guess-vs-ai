"use client";

import { useState, useEffect } from 'react';
import FooterButtons from './FooterButtons';
import { ModalState } from '@/model/ModalState';

interface FooterProps {
    openModal: (content: ModalState) => void;
}

export function FooterText() {
    const year = new Date().getFullYear();
    return (
        <p className='m-1 lg:m-2'>© {year} <a href='https://www.cheesy-ai.com/' target='_blank'><span style={{ color: "#ffa74f" }}>Cheesy AI</span></a>.</p>
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

        isSmallScreen ? (
            <>
            </>
        ) : (
            <footer className="footer text-white flex flex-col md:flex-row justify-between items-center p-2 md:p-4">
                <FooterText />
                <FooterButtons openModal={openModal} />
            </footer>
        )
    );
}