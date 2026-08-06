export default function DateInput({ label, name, defaultValue, fieldType, min, max, onChange }) {
    const formatValue = (value) => {
        if (!value) return "";

        const d = value == "today" ? new Date() : new Date(value);

        if (isNaN(d.getTime())) return value; // a fallback if date is invalid

        const localDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000);

        if (fieldType === "date") {
            return localDate.toISOString().split("T")[0]; // YYYY-MM-DD
        }

        if (fieldType === "datetime-local") {
            return localDate.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
        }

        return value;
    };

    return (
        <div>
            <label
                className="block text-sm font-semibold mb-2"
                htmlFor={name}>
                {label}
            </label>

            <input
                type={fieldType}
                className="w-full px-3 py-2 border rounded"
                name={name}
                defaultValue={formatValue(defaultValue)}
                min={formatValue(min)}
                max={formatValue(max)}
                onChange={onChange}
            />
        </div>
    );
}
