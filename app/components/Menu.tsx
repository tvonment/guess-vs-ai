import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GameInfo from './game/GameInfo';
import GameButtons from './game/GameButtons';
import FooterButtons from './FooterButtons';

interface MenuProps {
    onCloseMenu: () => void;
    onMenuOpenModal: (content: string) => void;
    isGameScreen: boolean;
    userWord: string;
    counter: number;
}

export default function Menu({ onCloseMenu, onMenuOpenModal, userWord, counter, isGameScreen }: MenuProps) {

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
                        <GameButtons openModal={onMenuOpenModal} />
                    </div>
                )}
                <div className="text-gray-700 hover:text-gray-900">
                    <FooterButtons openModal={onMenuOpenModal} />
                </div>
            </div>
        </>
    );
}