import { Counter } from "@/model/Counter";

interface GameInfoProps {
    userWord: string;
    counter: Counter;
}

export default function GameInfo({ userWord, counter }: GameInfoProps) {
    return (
        <div className="flex flex-row gap-4 mb-4 h-20 text-white">
            <div className="box-blue p-2 rounded-lg shadow flex-1 flex items-center justify-center">
                <h2 className="text-center">
                    <p className="text-xl font-extrabold">Your Word</p>
                    <p className="text-2xl">{userWord}</p>
                </h2>
            </div>
            <div className="box-blue p-2 rounded-lg shadow flex-1 flex items-center justify-center">
                <h3 className="text-center">
                    <p className="text-xl font-extrabold">Questions</p>
                    <p className="text-3xl font-extrabold"><span className="counter ai">{counter.ai}</span> / <span className="counter human">{counter.human}</span></p>
                </h3>
            </div>
        </div>
    );
}