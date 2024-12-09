import { faRotateLeft, faSkullCrossbones } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from 'react';

interface ConfirmProps {
    onConfirm: (winner: string, aiWord: string, summary: string) => void;
    onClose: () => void;
    userId: string;
}

export default function Confirm({ onConfirm, onClose, userId }: ConfirmProps) {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/finish', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: userId }),
            });
            const data = await response.json();
            const aiWord = data.result;
            const summary = data.summary;
            console.log("SUMMARY", summary);
            onConfirm("givenup", aiWord, summary);
        } catch (error) {
            console.error('Error fetching AI word:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        (!loading) ? (
            <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Give up</h2>
                <p className="mb-4">Are you sure?</p>
                <div className="flex justify-center space-x-4">
                    <button className="btn-blue" onClick={onClose} disabled={loading}>
                        <FontAwesomeIcon icon={faRotateLeft} className="icon-margin" />
                        <span className="text-center">Continue</span>
                        <FontAwesomeIcon icon={faRotateLeft} className="icon-margin hidden sm:inline" />
                    </button>
                    <button className="btn-red" onClick={handleConfirm} disabled={loading}>
                        <FontAwesomeIcon icon={faSkullCrossbones} className="icon-margin" />
                        <span className="text-center">Finish</span>
                        <FontAwesomeIcon icon={faSkullCrossbones} className="icon-margin hidden sm:inline" />
                    </button>
                </div>
            </div>
        ) : (
            <p className="center-spinner">
                <span className="loading-spinner"></span>
            </p>
        )
    );
}