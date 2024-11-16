"use client";

interface FooterProps {
    openModal: (content: string) => void;
}

export default function Footer({ openModal }: FooterProps) {
    const year = new Date().getFullYear();

    return (
        <footer className="footer flex justify-between items-center p-4">
            <p>© {year}. Created by <span style={{ color: "#7a95d2" }}>Pjotr Tinke</span> & <span style={{ color: "#ffa74f" }}>Thomas von Mentlen</span></p>
            <div className="flex space-x-4">
                <button onClick={() => openModal('FAQ')} className="footer-link">FAQ</button>
                <button onClick={() => openModal('Terms of Use')} className="footer-link">Terms of Use</button>
                <button onClick={() => openModal('Contact')} className="footer-link">Contact</button>
            </div>
        </footer>
    );
}