import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { faBars } from '@fortawesome/free-solid-svg-icons';

interface HeaderProps {
    onClick: () => void;
    onToggleMenu: () => void;
}

export default function Header({ onClick, onToggleMenu }: HeaderProps) {
    return (
        <header className="header flex items-center justify-between p-4">
            <div className="relative w-48 h-auto" onClick={onClick}>
                <Image src="/images/Guess vs AI logo Text.png" width={200} height={50} alt="Logo" className="max-w-full h-auto" />
            </div>
            <div className="absolute top-4 right-4 flex justify-end md:hidden text-white">
                <button onClick={onToggleMenu} className="btn p-2">
                    <FontAwesomeIcon icon={faBars} />
                </button>
            </div>
        </header>
    );
}