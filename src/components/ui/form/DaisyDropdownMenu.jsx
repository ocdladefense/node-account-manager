export default function DropMenu({ label, entries = [], handler }) {
    return (
        <details className="dropdown">
            <summary className="btn m-1">
                {label}
            </summary>

            <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-80 p-2 shadow-sm">
                {entries.map((entry) => (
                    <li key={entry.id}>
                        <button type="button" onClick={() => handler(entry)}>
                            {entry.name}
                        </button>
                    </li>
                ))}
            </ul>
        </details>
    );
}
