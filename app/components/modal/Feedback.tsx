import { Feedback } from "@/model/Feedback";
import { faHeart, faHeartBroken, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Import UUID library

interface ReportIssueProps {
    onClose: () => void;
    userId: string;
}

export default function ReportIssue({ onClose, userId }: ReportIssueProps) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [systemMessage, setSystemMessage] = useState('');
    const [warning, setWarning] = useState('');

    const handleSend = async () => {
        if (!message) {
            setWarning('Please write a message!');
            return;
        }
        const feedbackId = uuidv4();

        setLoading(true);
        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ feedback: { id: feedbackId, userId: userId, message: message } as Feedback }),
            });
            const data = await response.json();
            const result = data.result;
            if (result) {
                setSystemMessage(result);
            } else {
                setSystemMessage('Error sending feedback!');
            }
        } catch (error) {
            console.error('Error sending the feedback', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Feedback</h2>
            {(!loading && !systemMessage) ? (
                <>
                    <textarea
                        className="w-full p-2 mb-4"
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Send us your thoughts..."
                        required
                    ></textarea>
                    <p className="text-orange-500 mb-4">{warning}</p>
                    <div className="flex justify-center space-x-4">
                        <button className="btn btn-red" onClick={onClose} disabled={loading}>
                            <FontAwesomeIcon icon={faHeartBroken} className="icon-margin" />
                            <span className="text-center">Back</span>
                            <FontAwesomeIcon icon={faHeartBroken} className="icon-margin" />
                        </button>
                        <button className="btn btn-orange" onClick={handleSend} disabled={loading}>
                            <FontAwesomeIcon icon={faHeart} className="icon-margin" />
                            <span className="text-center">Send</span>
                            <FontAwesomeIcon icon={faHeart} className="icon-margin" />
                        </button>
                    </div>
                </>
            ) : systemMessage ? (
                <>
                    <p className="mb-4">{systemMessage}</p>
                    <div className="flex justify-end space-x-4">
                        <button className="btn btn-orange" onClick={onClose} disabled={loading}>
                            <FontAwesomeIcon icon={faThumbsUp} className="icon-margin" />
                            <span className="text-center">Ok</span>
                            <FontAwesomeIcon icon={faThumbsUp} className="icon-margin" />
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