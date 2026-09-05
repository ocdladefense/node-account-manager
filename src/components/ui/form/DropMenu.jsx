import { useState, useRef, useEffect } from "react";

export default function DropMenu({ label, entries = [], handler, thingThatGetsDisplayed }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelection = (entry) => {
        handler(entry);
        setIsOpen(false);
    };

    return (
        <div ref={dropdownRef} className="relative inline-block w-full max-w-xs text-left">
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className={`w-full flex items-center justify-between px-4 py-2 bg-white border rounded-lg shadow-sm text-sm font-medium transition-all ${isOpen
                    ? "border-blue-500 ring-2 ring-blue-500/20 text-gray-900"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
            >
                <span className="truncate pr-3">{label}</span>

                <svg
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180 text-blue-600" : ""
                        }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-56 overflow-y-auto p-1.5 focus:outline-none">
                    {entries.map((entry) => {
                        const displayText = thingThatGetsDisplayed
                            ? thingThatGetsDisplayed(entry)
                            : entry.Name;

                        return (
                            <button
                                key={entry.Id}
                                type="button"
                                onClick={() => handleSelection(entry)}
                                className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100 transition-colors whitespace-nowrap overflow-hidden text-ellipsis block"
                            >
                                {displayText}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
