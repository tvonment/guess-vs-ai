import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faBug, faHand, faHeart, faQuestion, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { TurnState } from '@/model/TurnState';

interface GameButtonsProps {
    turn: TurnState;
    openModal: (content: string) => void;
}

export default function GameButtons({ openModal, turn }: GameButtonsProps) {
    const handleGiveUp = () => {
        openModal('giveup');
    };

    const handleHelp = () => {
        openModal('help');
    };

    const handleIssueReport = () => {
        openModal('report-ingame');
    }

    const handleFeedback = () => {
        openModal('feedback');
    }

    const handleAgain = () => {
        openModal('gameover');
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            {turn !== TurnState.FINISHED ? (
                <>
                    <div className="flex flex-row gap-4 w-full">
                        <button className="btn-orange p-3 rounded-lg shadow flex-1 flex items-center justify-between" onClick={handleHelp}>
                            <FontAwesomeIcon icon={faQuestion} className="icon-margin-small" />
                            <span className="mx-2 text-center">Help</span>
                            <FontAwesomeIcon icon={faQuestion} className="icon-margin-small" />
                        </button>
                        <button className="btn-blue p-3 rounded-lg shadow flex-1 flex items-center justify-between" onClick={handleIssueReport}>
                            <FontAwesomeIcon icon={faBug} className="icon-margin-small" />
                            <span className="mx-2 text-center">Report Issue</span>
                            <FontAwesomeIcon icon={faBug} className="icon-margin-small" />
                        </button>
                    </div>
                    <button className="btn-red p-3 rounded-lg shadow w-full flex items-center justify-between" onClick={handleGiveUp}>
                        <FontAwesomeIcon icon={faHand} className="icon-margin-small mirror-icon" />
                        <span className="mx-2 text-center">Give up</span>
                        <FontAwesomeIcon icon={faHand} className="icon-margin-small" />
                    </button>
                </>
            ) : (
                <>
                    <button className="btn-blue p-3 rounded-lg shadow w-full flex flex items-center justify-between" onClick={handleFeedback}>
                        <FontAwesomeIcon icon={faHeart} className="icon-margin-small" />
                        <span className="mx-2 text-center">Feedback</span>
                        <FontAwesomeIcon icon={faHeart} className="icon-margin-small" />
                    </button>
                    <div className="flex flex-row gap-4 w-full">
                        <button className="btn-red p-3 rounded-lg shadow flex-1 flex items-center justify-between" onClick={handleIssueReport}>
                            <FontAwesomeIcon icon={faBug} className="icon-margin-small" />
                            <span className="mx-2 text-center">Report Issue</span>
                            <FontAwesomeIcon icon={faBug} className="icon-margin-small" />

                        </button>
                        <button className="btn-orange p-3 rounded-lg shadow flex-1 items-center justify-between" onClick={handleAgain}>
                            <FontAwesomeIcon icon={faRotateLeft} className="icon-margin-small" />
                            <span className="mx-2 text-center">Again</span>
                            <FontAwesomeIcon icon={faRotateLeft} className="icon-margin-small" />
                        </button>
                    </div>

                </>
            )}
        </div>
    );
}