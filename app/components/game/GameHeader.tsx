
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Category } from '@/model/Categories';

interface CategoryHeaderProps {
    category: Category;
}

export default function GameHeader({ category }: CategoryHeaderProps) {
    return (
        <div className="box-orange flex items-center justify-center h-20 mb-4">
            <p className="text-lg font-semibold">
                <FontAwesomeIcon icon={category.icon} className="icon-margin" />
                {category.name}
                <FontAwesomeIcon icon={category.icon} className="icon-margin" />
            </p>
        </div>
    );
}