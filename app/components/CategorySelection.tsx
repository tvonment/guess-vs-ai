"use client";

import { Category, Categories } from "@/model/Categories";
import Image from 'next/image';

interface CategorySelectionProps {
    onNavigateBack: () => void;
    onSetCategory: (theme: Category) => void;
}

export default function CategorySelection({ onNavigateBack, onSetCategory }: CategorySelectionProps) {

    const categories = Categories;

    return (
        <main className="w-full">
            <div className="flex justify-center">
                <Image src="/images/Pick your Poison.png" width={600} height={200} alt="Logo" className="w-100 h-100 mb-4" />
            </div>
            <div className="category-grid">
                {categories.map((category) => (
                    <button
                        className="btn-orange category-button fond-bolt"
                        onClick={() => onSetCategory(category)}
                        key={category.name}
                    >
                        {category.name}
                    </button>
                ))}
            </div>
        </main>
    );
}