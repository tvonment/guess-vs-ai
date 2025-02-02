import { Opponent, Opponents } from "@/model/Opponent";
import { faBrain } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";


interface OpponentSelectionProps {
    onSetOpponent: (opponent: Opponent) => void;
}

export default function OpponentSelection({ onSetOpponent }: OpponentSelectionProps) {

    const opponents = Opponents;

    useEffect(() => {
        const handleResize = () => {
            const element = document.getElementById('opponent-header');
            if (window.innerWidth >= 768) {
                element?.classList.add('box-blue');
            } else {
                element?.classList.remove('box-blue');
            }
        };

        // Initial check
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Cleanup event listener on unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <main className="w-full flex flex-col items-center md:mt-12 lg:mt-20 xl:mt-24">
            <div className="w-full md:w-2/3">
                <div id="opponent-header" className="w-full flex justify-center text-white mb-4">
                    <h1 className="text-center text-xl md:text-4xl font-extrabold flex items-center justify-between py-6">
                        <FontAwesomeIcon icon={faBrain} className="icon-margin hidden lg:inline" />
                        <span className="mx-2 text-center text-6xl">Select Your Opponent</span>
                        <FontAwesomeIcon icon={faBrain} className="icon-margin hidden lg:inline" />
                    </h1>
                </div>
            </div>
            <div className="w-2/3">
                <div className="flex flex-col gap-4 text-xl">
                    {opponents.map((opponent) => (
                        <button
                            className="btn-orange category-button font-bold flex items-center justify-between p-4 h-24"
                            onClick={() => onSetOpponent(opponent)}
                            key={opponent.name}>
                            <img src={opponent.image} alt={opponent.name} className="h-16 w-16 ml-4" />

                            <div className="flex flex-col items-center flex-grow">
                                <span className="text-center text-3xl">{opponent.name}</span>
                                <span className="text-center text-xl">{opponent.description}</span>
                            </div>

                        </button>
                    ))}
                </div>
            </div>
        </main >
    );
}
