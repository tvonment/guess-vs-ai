import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ModalProps {
    content: string | null;
    onClose: () => void;
    renderContent: (onRestart?: () => void, onCancel?: () => void, openModal?: (content: string) => void, userId?: string, gameStatus?: string, winner?: string, aiWord?: string) => JSX.Element | null;
    onRestart?: () => void;
    onCancel?: () => void;
    openModal?: (content: string) => void;
}

export default function Modal({ content, onClose, renderContent, onRestart, onCancel, openModal }: ModalProps) {
    if (!content) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4" onClick={onClose}>
            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-xl max-h-full overflow-y-auto p-4" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center">
                    <FontAwesomeIcon icon={faClose} />
                </button>
                {renderContent(onRestart, onCancel, openModal)}
            </div>
        </div>
    );
}