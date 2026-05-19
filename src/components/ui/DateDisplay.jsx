
export default function DateDisplay({ label, value, type }) {
    let formattedData;
    const formatDate = (dateString) => {
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

    const formatDateOnly = (dateString) => {
        const date = new Date(dateString);

        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };


    if (value != null) {
        if (type == "DateTime") {
            formattedData = formatDate(value);
            return (
                <div>
                    <div className="gap-1 rounded bg-blue-50">
                        <label class="text-xl block text-sm font-semibold mb-2">{label}</label>
                        <p className="text-xl">{formattedData}</p>
                    </div>
                </div>
            );
        }
        else {
            formattedData = formatDateOnly(value);
            return (
                <div>
                    <div className="gap-1 rounded bg-blue-50">
                        <label class="text-xl block text-sm font-semibold mb-2">{label}</label>
                        <p className="text-xl">{formattedData}</p>
                    </div>
                </div>
            );
        }


    }
    else
        return (
            <div>
                <div className="gap-1 rounded bg-blue-50">
                    <label class="text-xl block text-sm font-semibold mb-2">{label}</label>
                    <p className="text-xl">Empty</p>
                </div>
            </div>
        );
}
