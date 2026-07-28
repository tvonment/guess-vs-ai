"use client";

import { Section, Sections } from "@/model/Sections";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";

interface SectionSelectionProps {
    onSetSection: (section: Section) => void;
}

export default function SectionSelection({ onSetSection }: SectionSelectionProps) {

    useEffect(() => {
        const handleResize = () => {
            const element = document.getElementById('section-header');
            if (window.innerWidth >= 768) {
                element?.classList.add('box-blue');
            } else {
                element?.classList.remove('box-blue');
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <main className="w-full flex flex-col items-center md:mt-12 lg:mt-20 xl:mt-24">
            <div className="w-full md:w-2/3">
                <div id="section-header" className="w-full flex justify-center text-white mb-4">
                    <h1 className="text-center text-xl md:text-4xl font-extrabold flex items-center justify-between py-6">
                        <FontAwesomeIcon icon={faGamepad} className="icon-margin hidden lg:inline" />
                        <span className="mx-2 text-center text-6xl">Pick Your World</span>
                        <FontAwesomeIcon icon={faGamepad} className="icon-margin hidden lg:inline" />
                    </h1>
                </div>
            </div>
            <div className="w-2/3">
                <div className="grid grid-cols-1 mb-4 md:grid-cols-2 gap-4 text-xl">
                    {Sections.map((section) => (
                        <button
                            key={section.id}
                            className="w-full btn-orange category-button font-bold flex flex-col items-center justify-center p-4 h-36 Featured"
                            onClick={() => onSetSection(section)}>
                            <span className="flex items-center">
                                <FontAwesomeIcon icon={section.icon} className="icon-margin-small" />
                                <span className="mx-2 text-center text-3xl">{section.name}</span>
                                <FontAwesomeIcon icon={section.icon} className="icon-margin-small" />
                            </span>
                            <span className="mt-2 text-base font-normal">{section.description}</span>
                        </button>
                    ))}
                </div>
            </div>
        </main>
    );
}
