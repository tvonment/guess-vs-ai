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
        <main className="w-full flex flex-col items-center">
            <div className="w-full flex mb-4">
                <button onClick={onNavigateBack} className="btn font-bold py-5 px-8">
                    <FontAwesomeIcon icon={faChevronLeft} className="icon-margin text-white" />
                </button>
            </div>
            <div className="flex justify-center">
                <Image src="/images/Pick your Poison.png" width={400} height={200} alt="Logo" className="w-100 h-100 mb-4" />
            </div>
            <div className="w-2/3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                        <button
                            className="btn-orange category-button font-bold flex items-center justify-between p-4"
                            onClick={() => onSetCategory(category)}
                            key={category.name}>
                            <FontAwesomeIcon icon={category.icon} className="icon-margin" />
                            <span className="mx-2 text-center">{category.name}</span>
                            <FontAwesomeIcon icon={category.icon} className="icon-margin" />
                        </button>
                    ))}
                </div>
            </div>
        </main>
    );
}