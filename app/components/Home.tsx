import React from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad } from '@fortawesome/free-solid-svg-icons';

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
                <div className="flex max-w-1/3 ">
                    <button className="btn-orange py-4 px-8 rounded-lg shadow sm:flex-1 flex items-center justify-between text-2xl font-extrabold" onClick={onNavigate}>
                        <FontAwesomeIcon icon={faGamepad} className="icon-margin" />
                        <span className="mx-2 text-center">Start Game</span>
                        <FontAwesomeIcon icon={faGamepad} className="icon-margin" />
                    </button>
                </div>
            </div>
        </main>
    );
}