import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface HelpProps {
    onClose: () => void;
}

export default function Help({ onClose }: HelpProps) {
    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Help</h2>
            <p className="mb-4">Coming soon!</p>
            <div className="flex justify-end space-x-4">
                <button className="btn btn-orange" onClick={onClose}>
                    <FontAwesomeIcon icon={faThumbsUp} className="icon-margin" />
                    <span className="text-center">OK</span>
                    <FontAwesomeIcon icon={faThumbsUp} className="icon-margin" />
                </button>
            </div>
        </div>
    )
}