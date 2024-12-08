import Image from 'next/image';

type GameOverWinnerProps = {
    winnerText: string;
    image: string;
    aiWord: string;
};
export default function GameOverWinner({ winnerText, image, aiWord }: GameOverWinnerProps) {
    return (
        <>
            <div className="flex justify-center mb-4">
                <Image src={`/images/${image}`} width={300} height={300} alt="Logo" className="w-100 h-100 mb-4" />
            </div>
            <div className="flex justify-center mb-4">
                <h1 className="text-2xl font-bold">{winnerText}</h1>
            </div>
            <div className="flex justify-center mb-4">
                <p className="text-lg font-semibold">AI&apos;s word was: {aiWord}</p>
            </div>
        </>
    );
}
