import Image from 'next/image';

interface HeaderProps {
    onClick: () => void;
}

export default function Header({ onClick }: HeaderProps) {
    return (
        <header className="header">
            <Image src="/images/Guess vs AI logo Text.png" width={200} height={50} alt="Logo" className="w-100 h-100" onClick={onClick} />
        </header>
    );
}