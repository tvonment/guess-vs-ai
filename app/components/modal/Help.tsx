import { Answer } from "@/model/Answer";
import { Category } from "@/model/Categories";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface HelpProps {
    category?: Category;
    onClose: () => void;
}

export default function Help({ onClose, category }: HelpProps) {
    const helpText = categoryHelpTexts.find((item) => item.name === category?.name)?.help;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Help</h2>
            <p className="mb-4">Ask <strong>Yes/No Questions</strong> to get to the AIs character.</p>
            <p className="mb-4">{helpText}</p>
            <p className="mb-4">Ask your Questions carefully, if the answer is a <strong>{Answer.YES}</strong> or <strong>{Answer.PROBABLY_YES}</strong> you get another turn.</p>
            <div className="flex justify-end space-x-4">
                <button className="btn-orange" onClick={onClose}>
                    <FontAwesomeIcon icon={faThumbsUp} className="icon-margin" />
                    <span className="text-center">OK</span>
                    <FontAwesomeIcon icon={faThumbsUp} className="icon-margin hidden sm:inline" />
                </button>
            </div>
        </div>
    )
}

const categoryHelpTexts = [
    {
        name: "Marvel",
        help: "Try asking about their superpowers, their team affiliation, or the movies they appear in."
    },
    {
        name: "Star Wars",
        help: "Consider asking if they're a Jedi, a Sith, a droid, or associated with a particular era of the saga."
    },
    {
        name: "Harry Potter",
        help: "You might ask about their Hogwarts house, their role in the Wizarding World, or who they fought against."
    },
    {
        name: "Disney Animal",
        help: "Try asking if they're from a classic Disney film, if they talk, or what special trait makes them stand out."
    },
    {
        name: "Historical Figures",
        help: "You could ask if they are known for scientific achievements, political influence, or cultural impact."
    }
];