
import { Answer } from '@/model/Answer';
import { TurnState } from '@/model/TurnState';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

interface GameInputsProps {
    onHandleAnswerClick: (answer: Answer) => void;
    onHandleHumanGuess: (input: string) => void;
    turn: TurnState;
}

export default function GameInputs({ onHandleAnswerClick, onHandleHumanGuess, turn }: GameInputsProps) {

    const [input, setInput] = useState("");

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && input) {
            onHandleHumanGuess(input);
            setInput("");
        }
    };

    const handleHumanGuess = () => {
        if (input) {
            onHandleHumanGuess(input);
            setInput("");
        }
    }

    return (
        <div className="w-full flex justify-center mb-4">
            {turn == TurnState.AI ? (
                <>
                    <button onClick={() => onHandleAnswerClick(Answer.YES)} className="btn m-1 p-2 bg-green rounded flex-1">{Answer.YES}</button>
                    <button onClick={() => onHandleAnswerClick(Answer.PROBABLY_YES)} className="btn m-1 p-2 bg-light-green rounded flex-1">{Answer.PROBABLY_YES}</button>
                    <button onClick={() => onHandleAnswerClick(Answer.PROBABLY_NO)} className="btn m-1 p-2 bg-light-red rounded flex-1">{Answer.PROBABLY_NO}</button>
                    <button onClick={() => onHandleAnswerClick(Answer.NO)} className="btn m-1 p-2 bg-red rounded flex-1">{Answer.NO}</button>
                    <button onClick={() => onHandleAnswerClick(Answer.I_DONT_KNOW)} className="btn m-1 p-2 bg-gray-300 rounded flex-1">{Answer.I_DONT_KNOW}</button>
                </>
            ) : turn == TurnState.HUMAN ? (
                <div className="w-full flex">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)} // Update input value
                        onKeyDown={handleKeyDown} // Add keydown event listener
                        placeholder="Enter your question" // Conditional placeholder text
                        className="flex-grow p-2 border border-gray-300 rounded-l-lg"
                    />
                    <button onClick={handleHumanGuess}
                        disabled={!input} // Disable button if character is not locked or input is empty
                        className={`flex items-center justify-center rounded-r-lg px-4 ${!input ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-blue text-white'}`}>
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                </div>
            ) : (
                <p className="center-spinner">
                    <span className="loading-spinner"></span>
                </p>
            )}
        </div>
    );
}