export default function SortableHeader({ column, label, sortColumn, sortDirection, onColumnClick }) {
    return (
        <div
            onClick={() => onColumnClick(column)}
            className="text-sm font-semibold text-gray-900 cursor-pointer hover:text-blue-600"
        >
            {label} {sortColumn === column && (sortDirection === 'asc' ? '↑' : '↓')} {/* These arrows may cause browser errors? Should we use icons? */}
        </div>
    );
}
