import React from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad } from '@fortawesome/free-solid-svg-icons';
import { Answer } from '@/model/Answer';

type HomeScreenProps = {
    onNavigate: () => void;
};

export default function Home({ onNavigate }: HomeScreenProps) {
    return (
        <main className="mt-4 shadow-lg w-full">
            <div className="flex justify-center md:mb-2">
                <div className="relative w-40 md:w-72 h-auto">
                    <Image src="/images/Guess vs AI logo.png" width={400} height={300} alt="Logo" className="max-w-full h-auto mb-4" />
                </div>
            </div>
            <div className="flex p-10 pt-3 pb-3 flex-col items-center text-center">
                <h2 className="text-orange text-2xl md:text-4xl font-bold mb-4">Challenge the AI in our question game!</h2>
                <h3 className="text-white text-lg md:text-2xl mb-2">Choose a character of one of our categories and outguess the AI.</h3>
                <h3 className="text-white text-lg md:text-2xl mb-2">Ask <strong>Yes/No Questions</strong> to narrow down the Character, but choose carefully, if the answer is a <strong>{Answer.YES}</strong> or <strong>{Answer.PROBABLY_YES}</strong> you get another turn.</h3>
                <h3 className="text-white text-lg md:text-2xl mb-6">Think you can deduce its choice before it does yours?</h3>
                <button className="btn-orange md:mt-10 py-6 px-6 rounded-lg shadow flex items-center justify-between text-3xl font-extrabold" onClick={onNavigate}>
                    <FontAwesomeIcon icon={faGamepad} className="icon-margin" />
                    <span className="mx-1 text-center text-2xl md:text-4xl">Start</span>
                    <FontAwesomeIcon icon={faGamepad} className="icon-margin" />
                </button>
            </div>
        </main>
    );
}