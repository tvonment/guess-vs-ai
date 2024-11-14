"use client";

import { Category, Categories } from "@/model/Categories";
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons/faChevronLeft";

interface CategorySelectionProps {
    onNavigateBack: () => void;
    onSetCategory: (theme: Category) => void;
}

export default function CategorySelection({ onNavigateBack, onSetCategory }: CategorySelectionProps) {

    const categories = Categories;

    return (
        <main>
            <div className="flex mb-4">
                <button onClick={onNavigateBack} className="btn font-bold py-5 px-8">
                    <FontAwesomeIcon icon={faChevronLeft} className="icon-margin text-white" />
                </button>
            </div>
            <div className="flex justify-center">
                <Image src="/images/Pick your Poison.png" width={600} height={200} alt="Logo" className="w-100 h-100 mb-4" />
            </div>

            <div className="category-grid">
                {categories.map((category) => (
                    <button
                        className="btn-orange category-button fond-bolt"
                        onClick={() => onSetCategory(category)}
                        key={category.name}>
                        <FontAwesomeIcon icon={category.icon} className="icon-margin" />
                        {category.name}
                        <FontAwesomeIcon icon={category.icon} className="icon-margin" />
                    </button>
                ))}
            </div>
        </main>
    );
}