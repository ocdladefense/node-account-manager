import { useRef } from "react";

export default function DropMenu({ label, entries = [], handler }) {

    const detailsRef = useRef(null);

    const handleSelection = (entry) => {
        handler(entry);
        detailsRef.current.open = false;
    };

    return (
        <details ref={detailsRef} className="dropdown">
            <summary className="btn m-1">
                {label}
            </summary>

            <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-80 p-2 shadow-sm">
                {entries.map((entry) => (
                    <li key={entry.id}>
                        <button type="button" onClick={() => handleSelection(entry)}>
                            {entry.name}
                        </button>
                    </li>
                ))}
            </ul>
        </details>
    );
}
