export default function Section({ cols = 2, children }) {
    const gridClass =
        cols === 1 ? "grid-cols-1" :
            cols === 2 ? "grid-cols-2" :
                cols === 3 ? "grid-cols-3" :
                    cols === 4 ? "grid-cols-4" : "grid-cols-2";

    return (
        <div className={`border border-black/25 rounded bg-blue-50 p-4 mb-4 grid ${gridClass} gap-4`}>
            {children}
        </div>
    );
}
