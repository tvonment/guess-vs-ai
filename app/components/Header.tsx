import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { faBars, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

interface HeaderProps {
    currentPage: string;
    onClick: () => void;
    onToggleMenu: () => void;
    onNavigateBack: () => void;
}

export default function Header({ currentPage, onClick, onToggleMenu, onNavigateBack }: HeaderProps) {
    return (
        <header className="header mb-4 flex items-center justify-center relative">
            {currentPage !== 'home' && currentPage !== 'game' && <div className="absolute left-4">
                <button onClick={onNavigateBack} className="btn font-bold">
                    <FontAwesomeIcon icon={faChevronLeft} className="icon-margin text-white" />
                </button>
            </div>}
            <div className="relative w-48 h-auto mx-auto" onClick={onClick}>
                <Image src="/images/Guess vs AI logo Text.png" width={200} height={50} alt="Logo" className="max-w-full h-auto" />
            </div>
            <div className="absolute right-4 md:hidden inline">
                <button onClick={onToggleMenu} className="btn p-2 text-white">
                    <FontAwesomeIcon icon={faBars} />
                </button>
            </div>
        </header>
    );
}