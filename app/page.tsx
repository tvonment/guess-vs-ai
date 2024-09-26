"use client";

import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid'; // Import UUID library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { Answer } from "@/enum/Answer";
import { Category } from "@/enum/Categories";
import Image from 'next/image';

import "./page.css";
import './globals.css'; // Ensure you have the global styles imported

export default function Home() {
  const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);
  const [input, setInput] = useState(""); // State for input value
  const [userId, setUserId] = useState<string>(""); // State for user ID
  const [userWord, setUserWord] = useState(""); // State for character input
  const [category, setCategory] = useState(Category.CHARACTER); // State for character input
  const [isWordLocked, setIsWordLocked] = useState(false); // State for locking character
  const [showInputField, setShowInputField] = useState(true); // State for showing buttons
  const [showButtons, setShowButtons] = useState(false); // State for showing buttons
  const [winner, setWinner] = useState(""); // State for winner
  const [aiWord, setAiWord] = useState(""); // State for AIs chosen word after someone wins.
  const chatWindowRef = useRef<HTMLDivElement>(null); // Ref for chat window


  const handleHumanGuess = async () => {
    setShowInputField(false); // Show input field after sending
    const newMessage = { role: "user", content: input };
    setMessages([...messages, newMessage]); // Add user message to messages
    const response = await fetch('/api/guess', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: userId, text: input }), // Use input value
    });
    const data = await response.json();
    const aiMessages = data.result;
    const userWin = data.userWin;
    const aiWin = data.aiWin;
    if (userWin) {
      console.log("You win!");
      setWinner("human");
      setAiWord(data.aiWord)
    } else if (aiWin) {
      console.log("AI wins!");
      setMessages([...messages, newMessage, ...aiMessages]); // Add AI response to messages
      setWinner("ai");
      setAiWord(data.aiWord)
    } else {
      setMessages([...messages, newMessage, ...aiMessages]); // Add AI response to messages
      setShowButtons(true); // Show buttons after sending the question
      setInput(""); // Clear input field
    }
  };

  const handleWordLock = async () => {
    setIsWordLocked(true);
    setShowInputField(false);

    // Initialize user after character is locked
    const generatedUserId = uuidv4();
    setUserId(generatedUserId);

    // Call the /api/start endpoint to retrieve chat history
    const response = await fetch('/api/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: generatedUserId, category: category, userWord: userWord }),
    });
    const data = await response.json();
    // Set the retrieved chat history
    if (data.result) {
      setMessages(data.result);
      setShowInputField(true); // Show input field after locking
    }
  };

  const handleWordKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && userWord) {
      handleWordLock();
    }
  };

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]); // Scroll to bottom when messages change

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleHumanGuess();
    }
  };

  const handleAnswerClick = async (answer: string) => {
    setShowInputField(false); // Hide input field after selection
    setShowButtons(false); // Hide buttons after selection
    // Call the /api/saveanswer endpoint to save the humens answer
    const response = await fetch('/api/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: userId, answer: answer }),
    });
    const data = await response.json();
    const responseMessage = data.result;
    if (responseMessage) {
      setMessages([...messages, responseMessage]); // Add user message to messages
      setShowInputField(true); // Show input field after selection
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <main className="bg-white p-6 rounded-lg shadow-lg w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Guess vs AI</h1>
        <p className="text-lg mb-6 text-center">Play a game of <strong>guess what</strong> against an AI.</p>

        <div className="mb-4 flex items-center justify-center">
          <label className="mr-2">Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)} // Update category value
            className="p-2 border border-gray-300 rounded-lg"
            disabled={isWordLocked} // Disable dropdown if character is locked
          >
            {Object.entries(Category).map(([key, value]) => (
              <option key={key} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4 flex items-center justify-center">
          <label className="mr-2">{`Your word:`}</label> {/* Dynamically update label text */}
          <input
            type="text"
            value={userWord}
            onChange={(e) => setUserWord(e.target.value)} // Update character input value
            onKeyDown={handleWordKeyDown} // Add keydown event listener
            placeholder={category ? `Enter a word from the ${category} category` : "You should select a category"} // Dynamic placeholder
            className="flex-grow p-2 border border-gray-300 rounded-l-lg"
            readOnly={isWordLocked} // Make input readonly if character is locked
          />
          {!isWordLocked && (
            <button onClick={handleWordLock} className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded hover:bg-blue-600">
              <FontAwesomeIcon icon={faLock} />
            </button>
          )}
        </div>
        <div ref={chatWindowRef} className="chat-window border border-gray-300 p-4 h-64 overflow-y-scroll mb-4 bg-gray-50 rounded-lg">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              <strong>{message.role === "user" ? "You" : "AI"}:</strong> {message.content}
            </div>
          ))}

        </div>
        {winner != "" ? (
          <div className="flex flex-col items-center mb-4">
            <p className="text-lg mb-2"><strong>{winner === "human" ? "You win!" : "AI wins!"}</strong></p>
            <p className="text-lg mb-2">AI&apos;s chosen word was: {aiWord}</p>
            <Image src={`/images/${winner}win-${Math.floor(Math.random() * 3) + 1}.png`} width={400} height={400} alt="Winner" className="w-100 h-100 mb-4" />
            <button
              onClick={() => {
                setMessages([]);
                setInput("");
                setUserId("");
                setUserWord("");
                setIsWordLocked(false);
                setShowButtons(false);
                setShowInputField(true);
                setWinner("");
              }}
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Again!
            </button>
          </div>
        ) : showButtons ? (
          <div className="flex flex-wrap justify-center mb-4">
            <button onClick={() => handleAnswerClick(Answer.YES)} className="m-1 p-2 bg-green-800 text-white rounded hover:bg-green-600">{Answer.YES}</button>
            <button onClick={() => handleAnswerClick(Answer.PROBABLY_YES)} className="m-1 p-2 bg-green-400 text-white rounded hover:bg-green-500">{Answer.PROBABLY_YES}</button>
            <button onClick={() => handleAnswerClick(Answer.PROBABLY_NO)} className="m-1 p-2 bg-red-400 text-white rounded hover:bg-red-500">{Answer.PROBABLY_NO}</button>
            <button onClick={() => handleAnswerClick(Answer.NO)} className="m-1 p-2 bg-red-800 text-white rounded hover:bg-red-600">{Answer.NO}</button>
            <button onClick={() => handleAnswerClick(Answer.I_DONT_KNOW)} className="m-1 p-2 bg-gray-400 text-white rounded hover:bg-gray-500">{Answer.I_DONT_KNOW}</button>
          </div>
        ) : showInputField ? (
          <div className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)} // Update input value
              onKeyDown={handleKeyDown} // Add keydown event listener
              placeholder={isWordLocked ? "Enter your question" : "Lock your character before asking your first question"} // Conditional placeholder text
              className="flex-grow p-2 border border-gray-300 rounded-l-lg"
              disabled={!isWordLocked} // Disable input if character is not locked
            />
            {isWordLocked && (
              <button onClick={handleHumanGuess} className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded hover:bg-blue-600">
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            )}
          </div>
        ) : (
          <p className="center-spinner">
            <span className="loading-spinner"></span>
          </p>
        )}
      </main>
      <footer>
      </footer>
    </div>
  );
}