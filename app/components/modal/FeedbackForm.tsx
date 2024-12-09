import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmile, faMeh, faFrown, faSadTear, faHeart, faHeartBroken, faThumbsUp, faStar, faFaceTired, faFaceGrimace, faFaceSmileWink, faFaceLaughSquint, faFaceGrinStars, faFaceDizzy } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid'; // Import UUID library
import { Feedback } from "@/model/Feedback";
import { IconProp } from '@fortawesome/fontawesome-svg-core';

type FeedbackProps = {
    onClose: () => void;
    userId: string;
};

export default function FeedbackForm({ onClose, userId }: FeedbackProps) {
    const [overallRating, setOverallRating] = useState<number>(0);
    const [aiDifficulty, setAiDifficulty] = useState<string>('');
    const [aiFairness, setAiFairness] = useState<string>('');
    const [gameLength, setGameLength] = useState<string>('');
    const [overallEnjoyment, setOverallEnjoyment] = useState<string>('');
    const [additionalComments, setAdditionalComments] = useState<string>('');
    const [warning, setWarning] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [systemMessage, setSystemMessage] = useState('');

    const handleSend = async () => {
        if (!overallRating || !aiDifficulty || !aiFairness || !gameLength || !overallEnjoyment) {
            setWarning('Please answer all questions.');
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
                body: JSON.stringify(
                    {
                        feedback:
                            {
                                id: feedbackId,
                                userId: userId,
                                overallRating: overallRating,
                                aiDifficulty: aiDifficulty,
                                aiFairness: aiFairness,
                                gameLength: gameLength,
                                overallEnjoyment: overallEnjoyment,
                                additionalComments: additionalComments
                            } as Feedback
                    }),
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

    const getColorClass = (value: string, selectedValue: string) => {
        if (selectedValue === value) {
            switch (value) {
                case 'Very fair':
                case 'Very fun':
                    return 'text-green-500';
                case 'Fair':
                case 'Fun':
                    return 'text-green-300';
                case 'Sometimes':
                case 'Okay':
                case 'Just right':
                case 'Just the right level of challenge':
                    return 'text-yellow-500';
                case 'Unfair':
                case 'Not fun':
                case 'Long':
                case 'Short':
                case 'Hard':
                    return 'text-red-300';
                case 'Very short':
                case 'Very unfair':
                case 'Not fun at all':
                case 'Very long':
                case 'Very hard':
                    return 'text-red-500';
                case 'Easy':
                    return 'text-blue-300';
                case 'Too easy':
                    return 'text-blue-500';
                default:
                    return 'text-gray-500';
            }
        }
        return 'text-gray-500';
    };

    const renderIconButton = (name: string, value: string, icon: IconProp, selectedValue: string, setSelectedValue: (value: string) => void, description: string) => (
        <label className={`cursor-pointer flex flex-col items-center ${getColorClass(value, selectedValue)}`}>
            <input
                type="radio"
                name={name}
                value={value}
                className="hidden"
                onChange={(e) => setSelectedValue(e.target.value)}
            />
            <p className='hidden'>{description}</p>
            <FontAwesomeIcon icon={icon} size="2x" />
        </label>
    );

    const renderStarRating = () => (
        <div className="flex justify-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesomeIcon
                    key={star}
                    icon={faStar}
                    size="2x"
                    className={`cursor-pointer ${overallRating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                    onClick={() => setOverallRating(star)}
                />
            ))}
        </div>
    );

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Feedback</h2>
            {(!loading && !systemMessage) ? (
                <>
                    <div className="mb-4">
                        <h3 className="mb-2">How would you rate the overall experience?</h3>
                        {renderStarRating()}
                    </div>
                    <div className="mb-4">
                        <h3 className="mb-2">How challenging was the AI to play against?</h3>
                        <div className="flex justify-around">
                            {renderIconButton('aiDifficulty', 'Very hard', faFaceTired, aiDifficulty, setAiDifficulty, 'Very hard')}
                            {renderIconButton('aiDifficulty', 'Hard', faFaceGrimace, aiDifficulty, setAiDifficulty, 'Hard')}
                            {renderIconButton('aiDifficulty', 'Just the right level of challenge', faFaceGrinStars, aiDifficulty, setAiDifficulty, 'Just the right level of challenge')}
                            {renderIconButton('aiDifficulty', 'Easy', faFaceSmileWink, aiDifficulty, setAiDifficulty, 'Easy')}
                            {renderIconButton('aiDifficulty', 'Too easy', faFaceLaughSquint, aiDifficulty, setAiDifficulty, 'Too easy')}
                        </div>
                        <div className="flex justify-around mt-2">
                            <div className="flex-1 text-left">
                                <p className="text-gray-500 text-sm">Too hard</p>
                            </div>
                            <div className="flex-1 text-center">
                                <p className="text-gray-500 text-sm">Just the right level of challenge</p>
                            </div>
                            <div className="flex-1 text-right">
                                <p className="text-gray-500 text-sm">Too easy</p>
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <h3 className="mb-2">Did the AI answer correctly and allow you to win when you should have?</h3>
                        <div className="flex justify-around">
                            {renderIconButton('aiFairness', 'Very unfair', faSadTear, aiFairness, setAiFairness, 'Very unfair')}
                            {renderIconButton('aiFairness', 'Unfair', faFrown, aiFairness, setAiFairness, 'Unfair')}
                            {renderIconButton('aiFairness', 'Sometimes', faMeh, aiFairness, setAiFairness, 'Sometimes')}
                            {renderIconButton('aiFairness', 'Fair', faSmile, aiFairness, setAiFairness, 'Fair')}
                            {renderIconButton('aiFairness', 'Very fair', faFaceGrinStars, aiFairness, setAiFairness, 'Very fair')}
                        </div>
                        <div className="flex justify-around mt-2">
                            <div className="flex-1 text-left">
                                <p className="text-gray-500 text-sm">Very unfair</p>
                            </div>
                            <div className="flex-1 text-center">
                                <p className="text-gray-500 text-sm">Sometimes</p>
                            </div>
                            <div className="flex-1 text-right">
                                <p className="text-gray-500 text-sm">Very fair</p>
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <h3 className="mb-2">Was the length of the game just right?</h3>
                        <div className="flex justify-around">
                            {renderIconButton('gameLength', 'Very short', faSadTear, gameLength, setGameLength, 'Very short')}
                            {renderIconButton('gameLength', 'Short', faFrown, gameLength, setGameLength, 'Short')}
                            {renderIconButton('gameLength', 'Just right', faFaceGrinStars, gameLength, setGameLength, 'Just right')}
                            {renderIconButton('gameLength', 'Long', faFaceGrimace, gameLength, setGameLength, 'Long')}
                            {renderIconButton('gameLength', 'Very long', faFaceDizzy, gameLength, setGameLength, 'Very long')}
                        </div>
                        <div className="flex justify-around mt-2">
                            <div className="flex-1 text-left">
                                <p className="text-gray-500 text-sm">Very short</p>
                            </div>
                            <div className="flex-1 text-center">
                                <p className="text-gray-500 text-sm">Just right</p>
                            </div>
                            <div className="flex-1 text-right">
                                <p className="text-gray-500 text-sm">Very long</p>
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <h3 className="mb-2">How much fun did you have playing this game?</h3>
                        <div className="flex justify-around">
                            {renderIconButton('overallEnjoyment', 'Not fun at all', faSadTear, overallEnjoyment, setOverallEnjoyment, 'Not fun at all')}
                            {renderIconButton('overallEnjoyment', 'Not fun', faFrown, overallEnjoyment, setOverallEnjoyment, 'Not fun')}
                            {renderIconButton('overallEnjoyment', 'Okay', faMeh, overallEnjoyment, setOverallEnjoyment, 'Okay')}
                            {renderIconButton('overallEnjoyment', 'Fun', faSmile, overallEnjoyment, setOverallEnjoyment, 'Fun')}
                            {renderIconButton('overallEnjoyment', 'Very fun', faFaceGrinStars, overallEnjoyment, setOverallEnjoyment, 'Very fun')}
                        </div>
                        <div className="flex justify-around mt-2">
                            <div className="flex-1 text-left">
                                <p className="text-gray-500 text-sm">Not fun at all</p>
                            </div>
                            <div className="flex-1 text-center">
                                <p className="text-gray-500 text-sm">Okay</p>
                            </div>
                            <div className="flex-1 text-right">
                                <p className="text-gray-500 text-sm">Very Fun</p>
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <h3 className="mb-2">Additional Comments</h3>
                        <textarea
                            className="w-full p-2 mb-4"
                            rows={4}
                            value={additionalComments}
                            onChange={(e) => setAdditionalComments(e.target.value)}
                            placeholder="(optional) Send us your thoughts..."
                        ></textarea>
                    </div>
                    <p className="text-orange-500 mb-4">{warning}</p>
                    <div className="flex justify-center space-x-4">
                        <button className="btn-red" onClick={onClose} disabled={loading}>
                            <FontAwesomeIcon icon={faHeartBroken} className="icon-margin" />
                            <span className="text-center">Back</span>
                            <FontAwesomeIcon icon={faHeartBroken} className="icon-margin hidden sm:inline" />
                        </button>
                        <button className="btn-orange" onClick={handleSend} disabled={loading}>
                            <FontAwesomeIcon icon={faHeart} className="icon-margin" />
                            <span className="text-center">Send</span>
                            <FontAwesomeIcon icon={faHeart} className="icon-margin hidden sm:inline" />
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
    );
}