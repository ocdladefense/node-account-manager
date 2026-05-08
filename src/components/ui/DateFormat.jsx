const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export default function DateView({ date }) {
    return (
        <div>
            <p className="text-lg font-semibold">{formatDate(date)}</p>
        </div>
    );
}
