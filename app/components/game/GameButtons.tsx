import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBug, faHand, faHeart, faQuestion, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { TurnState } from '@/model/TurnState';
import { ModalState } from '@/model/ModalState';

interface GameButtonsProps {
    turn: TurnState;
    feedbackSent: boolean;
    openModal: (content: ModalState) => void;
    onRestart: () => void;
}

export default function GameButtons({ openModal, turn, feedbackSent, onRestart }: GameButtonsProps) {
    const handleGiveUp = () => {
        openModal(ModalState.GIVEUP);
    };

    const handleHelp = () => {
        openModal(ModalState.HELP);
    };

    const handleIssueReport = () => {
        if (turn === TurnState.FINISHED) {
            openModal(ModalState.REPORT_GAMEOVER);
        } else {
            openModal(ModalState.REPORT_INGAME);
        }
    }

    const handleFeedback = () => {
        openModal(ModalState.FEEDBACK);
    }

    const handleAgain = () => {
        if (!feedbackSent) {
            openModal(ModalState.FEEDBACK);
        } else {
            onRestart();
        }
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            {turn !== TurnState.FINISHED ? (
                <>
                    <div className="flex flex-row gap-4 w-full">
                        <button className="btn-orange p-3 rounded-lg shadow flex-1 flex items-center justify-between" onClick={handleHelp}>
                            <FontAwesomeIcon icon={faQuestion} className="icon-margin-small" />
                            <span className="mx-2 text-center">Help</span>
                            <FontAwesomeIcon icon={faQuestion} className="icon-margin-small hidden sm:inline" />
                        </button>
                        <button className="btn-red p-3 rounded-lg shadow flex-1 flex items-center justify-between" onClick={handleGiveUp}>
                            <FontAwesomeIcon icon={faHand} className="icon-margin-small mirror-icon" />
                            <span className="mx-2 text-center">Give up</span>
                            <FontAwesomeIcon icon={faHand} className="icon-margin-small hidden sm:inline" />
                        </button>
                    </div>
                    <button className="btn-ghost self-center" onClick={handleIssueReport}>
                        <FontAwesomeIcon icon={faBug} className="icon-margin-small" />
                        <span className="mx-1">Report an issue</span>
                    </button>
                </>
            ) : (
                <>
                    <button className="btn-orange p-3 rounded-lg shadow w-full flex items-center justify-between" onClick={handleAgain}>
                        <FontAwesomeIcon icon={faRotateLeft} className="icon-margin-small" />
                        <span className="mx-2 text-center">Again</span>
                        <FontAwesomeIcon icon={faRotateLeft} className="icon-margin-small hidden sm:inline" />
                    </button>
                    <div className="flex flex-row justify-center gap-6 w-full">
                        {!feedbackSent && (
                            <button className="btn-ghost" onClick={handleFeedback}>
                                <FontAwesomeIcon icon={faHeart} className="icon-margin-small" />
                                <span className="mx-1">Leave feedback</span>
                            </button>
                        )}
                        <button className="btn-ghost" onClick={handleIssueReport}>
                            <FontAwesomeIcon icon={faBug} className="icon-margin-small" />
                            <span className="mx-1">Report an issue</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}