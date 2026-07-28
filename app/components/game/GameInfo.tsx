import { Counter } from "@/model/Counter";
import { AI_DISPLAY_NAME } from "@/model/Ai";

interface GameInfoProps {
    userWord: string;
    counter: Counter;
}

export default function GameInfo({ userWord, counter }: GameInfoProps) {
    return (
        <>
            <div className="flex flex-row gap-4 mb-4 h-20 text-white">
                <div className="box-blue p-2 rounded-lg shadow flex-1 flex items-center justify-center">
                    <h2 className="text-center">
                        <p className="text-2xl font-extrabold"><span className="opponent human">You</span> vs <span className="opponent ai">{AI_DISPLAY_NAME}</span></p>
                    </h2>
                </div>
            </div >
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
                        <p className="text-3xl font-extrabold"><span className="counter human">{counter.human}</span> / <span className="counter ai">{counter.ai}</span></p>
                    </h3>
                </div>
            </div>
        </>
    );
}
