"use client";

import { Category, Categories } from "@/model/Categories";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";

interface CategorySelectionProps {
    onSetCategory: (theme: Category) => void;
}

export default function CategorySelection({ onSetCategory }: CategorySelectionProps) {

    const categories = Categories;

    useEffect(() => {
        const handleResize = () => {
            const element = document.getElementById('category-header');
            if (window.innerWidth >= 768) {
                element?.classList.add('box-blue');
            } else {
                element?.classList.remove('box-blue');
            }
        };

        // Initial check
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Cleanup event listener on unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <main className="w-full flex flex-col items-center md:mt-12 lg:mt-20 xl:mt-24">
            <div className="w-full md:w-2/3">
                <div id="category-header" className="w-full flex justify-center text-white mb-4">
                    <h1 className="text-center text-xl md:text-4xl font-extrabold flex items-center justify-between py-6">
                        <FontAwesomeIcon icon={faGamepad} className="icon-margin hidden lg:inline" />
                        <span className="mx-2 text-center text-6xl">Pick Your Category</span>
                        <FontAwesomeIcon icon={faGamepad} className="icon-margin hidden lg:inline" />
                    </h1>
                </div>
            </div>
            <div className="w-2/3">
                <div className="grid grid-cols-1 mb-4 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xl">
                    {categories.map((category) => (
                        <button
                            className={`btn-orange category-button font-bold flex items-center justify-between p-4 h-24 ${category.type}`}
                            onClick={() => onSetCategory(category)}
                            key={category.name}>
                            <FontAwesomeIcon icon={category.icon} className="icon-margin-small" />
                            <span className="mx-2 text-center text-3xl">{category.name}</span>
                            <FontAwesomeIcon icon={category.icon} className="icon-margin-small" />
                        </button>
                    ))}
                    <button
                        className="btn-orange opacity-50 category-button font-bold p-4 h-24 text-center"
                        disabled>
                        <span className="mx-2 text-center">more coming soon...</span>
                    </button>
                </div>
            </div>
        </main>
    );
}