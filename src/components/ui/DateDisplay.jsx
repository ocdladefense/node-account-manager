
export default function DateDisplay({ label, value, type, textClassName = "text-xl" }) {
    let formattedData;
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);

        return date.toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString + "T00:00:00");

        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };





    if (value == null) {
        return (
            <div>
                <div className="gap-1 rounded">
                    <label className="text-xl block text-sm font-semibold mb-2">{label}</label>
                    <p className={textClassName}>-</p>
                </div>
            </div>
        );
    }

    formattedData = type == "DateTime" ? formatDateTime(value) : formatDate(value);


    return (
        <div>
            <div className="gap-1 rounded">
                <label className="text-xl block text-sm font-semibold mb-2">{label}</label>
                <p className={textClassName}>{formattedData}</p>
            </div>
        </div>
    );

}
