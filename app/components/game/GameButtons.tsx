import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHand, faQuestion } from '@fortawesome/free-solid-svg-icons';

interface GameButtonsProps {
    openModal: (content: string) => void;
}

export default function GameButtons({ openModal }: GameButtonsProps) {
    const handleGiveUp = () => {
        openModal('giveup');
    };

    const handleHelp = () => {
        openModal('help');
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <button className="btn-orange p-1 rounded-lg shadow w-full sm:flex-1 flex items-center justify-between" onClick={handleHelp}>
                <FontAwesomeIcon icon={faQuestion} className="icon-margin-small" />
                <span className="mx-2 text-center">Help</span>
                <FontAwesomeIcon icon={faQuestion} className="icon-margin-small" />
            </button>
            <button className="btn-red p-1 rounded-lg shadow w-full sm:flex-1 flex items-center justify-between" onClick={handleGiveUp}>
                <FontAwesomeIcon icon={faHand} className="icon-margin-small mirror-icon" />
                <span className="mx-2 text-center">Give up</span>
                <FontAwesomeIcon icon={faHand} className="icon-margin-small" />
            </button>
        </div>
    );
}