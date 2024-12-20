import { faArrowUpFromBracket, faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Install() {
    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Install App</h2>
            <p className="mb-4">If there is no Install Prompt opening follow one of these steps:</p>
            <h3 className="text-lg mb-4">On iPhone</h3>
            <p className="mb-4">Open this site in Safari, tap the Share <FontAwesomeIcon icon={faArrowUpFromBracket} /> button and then tap "Add to Home Screen".</p>
            <h3 className="text-lg mb-4">Already installed</h3>
            <p className="mb-4">Check if the App is already installed on your device.</p>
        </div>
    )
}