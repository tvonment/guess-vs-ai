
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Category } from '@/model/Categories';

interface CategoryHeaderProps {
    category: Category;
}

export default function GameHeader({ category }: CategoryHeaderProps) {
    return (
        <h1 className="box-orange flex items-center justify-center h-10 md:h-20 mb-4 text-xl md:text-3xl font-extrabold">
            <FontAwesomeIcon icon={category.icon} className="icon-margin" />
            <span className="mx-2 text-center">{category.name}</span>
            <FontAwesomeIcon icon={category.icon} className="icon-margin" />
        </h1>
    );
}