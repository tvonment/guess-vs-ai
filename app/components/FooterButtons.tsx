interface FooterButtonsProps {
    openModal: (content: string) => void;
}

export default function FooterButtons({ openModal }: FooterButtonsProps) {
    return (
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <button onClick={() => openModal('FAQ')} className="footer-link m-1">FAQ</button>
            <button onClick={() => openModal('Terms of Use')} className="footer-link m-1">Terms of Use</button>
            <button onClick={() => openModal('Contact')} className="footer-link m-1">Contact</button>
        </div>
    );
}
