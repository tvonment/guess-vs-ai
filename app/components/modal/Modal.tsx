import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ModalProps {
    content: string | null;
    onClose: () => void;
    renderContent: (onConfirm?: () => void, onCancel?: () => void) => JSX.Element | null;
    onConfirm?: () => void;
    onCancel?: () => void;
}

export default function Modal({ content, onClose, renderContent, onConfirm, onCancel }: ModalProps) {
    if (!content) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-white p-4 rounded-lg max-w-md w-full text-black relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center">
                    <FontAwesomeIcon icon={faClose} />
                </button>
                {renderContent(onConfirm, onCancel)}
            </div>
        </div>
    );
}