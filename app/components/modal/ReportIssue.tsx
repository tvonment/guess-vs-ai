import { ReportedIssue } from "@/model/Game";
import { faPaperPlane, faRotateLeft, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from 'react';

interface ReportIssueProps {
    onClose: () => void;
    userId: string;
    gameStatus: string;
}

export default function ReportIssue({ onClose, userId, gameStatus }: ReportIssueProps) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [systemMessage, setSystemMessage] = useState('');

    const handleSend = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: userId, reportedIssue: { message: message, gameStatus: gameStatus } as ReportedIssue }),
            });
            const data = await response.json();
            const result = data.result;
            if (result) {
                setSystemMessage(result);
            } else {
                setSystemMessage('Error sending issue!');
            }
        } catch (error) {
            console.error('Error sending the Issue', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Report Issue</h2>
            {(!loading && !systemMessage) ? (
                <>
                    <h3 className="mb-4">Message: </h3>
                    <textarea
                        className="w-full p-2 mb-4"
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="(optional) Please describe the issue here..."
                    ></textarea>
                    <div className="flex justify-center space-x-4">
                        <button className="btn-blue" onClick={onClose} disabled={loading}>
                            <FontAwesomeIcon icon={faRotateLeft} className="icon-margin" />
                            <span className="text-center">Back</span>
                            <FontAwesomeIcon icon={faRotateLeft} className="icon-margin hidden sm:inline" />
                        </button>
                        <button className="btn-orange" onClick={handleSend} disabled={loading}>
                            <FontAwesomeIcon icon={faPaperPlane} className="icon-margin" />
                            <span className="text-center">Send</span>
                            <FontAwesomeIcon icon={faPaperPlane} className="icon-margin hidden sm:inline" />
                        </button>
                    </div>
                </>
            ) : systemMessage ? (
                <>
                    <p className="mb-4">{systemMessage}</p>
                    <div className="flex justify-end space-x-4">
                        <button className="btn-orange" onClick={onClose} disabled={loading}>
                            <FontAwesomeIcon icon={faThumbsUp} className="icon-margin" />
                            <span className="text-center">Ok</span>
                            <FontAwesomeIcon icon={faThumbsUp} className="icon-margin hidden sm:inline" />
                        </button>
                    </div>
                </>
            ) : (
                <p className="center-spinner">
                    <span className="loading-spinner"></span>
                </p>
            )}

        </div>
    )
}