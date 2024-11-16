
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Category } from '@/model/Categories';

interface CategoryHeaderProps {
    category: Category;
}

export default function GameHeader({ category }: CategoryHeaderProps) {
    return (
        <div className="box-orange flex items-center justify-center h-20 mb-4">
            <FontAwesomeIcon icon={category.icon} className="icon-margin" />
            <span className="mx-2 text-center">{category.name}</span>
            <FontAwesomeIcon icon={category.icon} className="icon-margin" />
        </div>
    );
}