interface GameInfoProps {
    userWord: string;
    counter: number;
}

export default function GameInfo({ userWord, counter }: GameInfoProps) {
    return (
        <div className="flex flex-row gap-4 mb-4 h-20">
            <div className="box-blue p-2 rounded-lg shadow flex-1 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-sm font-semibold">Your Word</p>
                    <p className="text-sm">{userWord}</p>
                </div>
            </div>
            <div className="box-blue p-2 rounded-lg shadow flex-1 flex items-center justify-center">
                <p className="text-sm font-semibold">Round: {counter}</p>
            </div>
        </div>
    );
}