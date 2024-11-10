import React from 'react';
import Image from 'next/image';

type HomeScreenProps = {
    onNavigate: () => void;
};

export default function Home({ onNavigate }: HomeScreenProps) {
    return (
        <main className="shadow-lg w-full">
            <div className="flex justify-center mb-4">
                <Image src="/images/Guess vs AI logo.png" width={300} height={300} alt="Logo" className="w-100 h-100 mb-4" />
            </div>
            <div className="flex justify-center">
                <button onClick={onNavigate} className="btn-orange font-bold py-5 px-8">Start Game</button>
            </div>
        </main>
    );
};