"use client";

import { Category, Categories } from "@/model/Categories";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

interface CategorySelectionProps {
    onSetCategory: (theme: Category) => void;
}

export default function CategorySelection({ onSetCategory }: CategorySelectionProps) {

    const categories = Categories;
    const [hoveredCategory, setHoveredCategory] = useState(null as Category | null);

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
                        <div
                            key={category.name}
                            className="relative"
                            onMouseEnter={() => {
                                if (category.subcategories?.length) {
                                    setHoveredCategory(category);
                                }
                            }}
                            onMouseLeave={() => {
                                setHoveredCategory(null);
                            }}>
                            <button
                                className={`w-full btn-orange category-button font-bold flex items-center justify-between p-4 h-24 ${category.type}`}
                                disabled={!!category.subcategories?.length}
                                onClick={() => {
                                    if (!category.subcategories?.length) {
                                        onSetCategory(category);
                                    }
                                }}>
                                <FontAwesomeIcon icon={category.icon} className="icon-margin-small" />
                                <span className="mx-2 text-center text-3xl">{category.name}</span>
                                <FontAwesomeIcon icon={category.icon} className="icon-margin-small" />
                            </button>
                            {hoveredCategory?.name === category.name && category.subcategories && (
                                <div className="absolute top-full mt-1 w-full bg-white shadow-md rounded p-2 z-10">
                                    <button
                                        className="w-full text-left px-2 py-1 hover:bg-gray-200"
                                        onClick={() => onSetCategory(category)}>
                                        {category.name} (Full Universe)
                                    </button>
                                    {category.subcategories.map((sub) => (
                                        <button
                                            key={sub.name}
                                            className="w-full text-left px-2 py-1 hover:bg-gray-200"
                                            onClick={() => onSetCategory(sub)}>
                                            {sub.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
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