import { ModalState } from "@/model/ModalState";

interface FooterButtonsProps {
    openModal: (content: ModalState) => void;
}

export default function FooterButtons({ openModal }: FooterButtonsProps) {
    return (
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <button onClick={() => openModal(ModalState.TOU)} className="footer-link m-1">Terms of Use</button>
            <button onClick={() => openModal(ModalState.CONTACT)} className="footer-link m-1">Contact</button>
        </div>
    );
}
