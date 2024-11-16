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
        <div className="grid grid-cols-2 gap-4">
            <button className="btn-orange p-2 rounded-lg shadow" onClick={handleHelp}>
                <FontAwesomeIcon icon={faQuestion} className="icon-margin" />
                Help
                <FontAwesomeIcon icon={faQuestion} className="icon-margin" />
            </button>
            <button className="btn-red p-2 rounded-lg shadow" onClick={handleGiveUp} >
                <FontAwesomeIcon icon={faHand} className="icon-margin mirror-icon" />
                Give up
                <FontAwesomeIcon icon={faHand} className="icon-margin" />
            </button>
        </div>
    )
}