import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { faBars } from '@fortawesome/free-solid-svg-icons';

interface HeaderProps {
    onClick: () => void;
    onToggleMenu: () => void;
}

export default function Header({ onClick, onToggleMenu }: HeaderProps) {
    return (
        <header className="header">
            <Image src="/images/Guess vs AI logo Text.png" width={200} height={50} alt="Logo" className="w-100 h-100" onClick={onClick} />
            <div className="absolute top-4 right-4 flex justify-end md:hidden text-white">
                <button onClick={onToggleMenu} className="btn p-2">
                    <FontAwesomeIcon icon={faBars} />
                </button>
            </div>
        </header>
    );
}