import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GameInfo from './game/GameInfo';
import GameHelper from './game/GameHelper';
import GameButtons from './game/GameButtons';
import FooterButtons from './FooterButtons';
import { TurnState } from "@/model/TurnState";
import { Counter } from "@/model/Counter";
import { ModalState } from "@/model/ModalState";
import { Message } from "@/model/Message";
import { FooterText } from "./Footer";

interface MenuProps {
    onCloseMenu: () => void;
    onMenuOpenModal: (content: ModalState) => void;
    onRestart: () => void;
    feedbackSent: boolean;
    isGameScreen: boolean;
    userWord: string;
    counter: Counter;
    turn: TurnState;
    userId: string;
    helperMessages: Message[];
    onHelperMessagesChange: (messages: Message[]) => void;
}

export default function Menu({ onCloseMenu, onMenuOpenModal, onRestart, feedbackSent, userWord, counter, isGameScreen, turn, userId, helperMessages, onHelperMessagesChange }: MenuProps) {

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onCloseMenu}></div>
            <div className="fixed top-0 right-0 h-full w-4/5 bg-white shadow-lg p-4 z-50 flex flex-col">
                <div className="flex justify-end">
                    <button onClick={onCloseMenu} className="text-gray-700 hover:text-gray-900 w-8 h-8 flex items-center justify-center">
                        <FontAwesomeIcon icon={faClose} />
                    </button>
                </div>
                {isGameScreen && (
                    <div className="flex-1 overflow-y-auto">
                        <GameInfo userWord={userWord} counter={counter} />
                        <GameHelper userId={userId} messages={helperMessages} onMessagesChange={onHelperMessagesChange} />
                        <GameButtons openModal={onMenuOpenModal} turn={turn} onRestart={onRestart} feedbackSent={feedbackSent} />
                    </div>
                )}
                <div className="text-gray-700 hover:text-gray-900 overflow-y-auto mb-10">
                    <FooterButtons openModal={onMenuOpenModal} />
                </div>
                <footer className="absolute bottom-0 w-full z-40 p-4">
                    <FooterText />
                </footer>
            </div>

        </>
    );
}