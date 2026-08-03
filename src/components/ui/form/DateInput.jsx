export default function DateInput({ label, name, defaultValue, fieldType }) {
    const formatValue = (value) => {
        if (!value) return "";

        const d = new Date(value);

        if (fieldType === "date") {
            return d.toISOString().split("T")[0]; // YYYY-MM-DD
        }

        if (fieldType === "datetime-local") {
            return d.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
        }

        return value;
    };

    let myDate = new Date();

    return (
        <div>
            <label className="block text-sm font-semibold mb-2" htmlFor={name}>
                {label}
            </label>

            <input
                type={fieldType}
                className="w-full px-3 py-2 border rounded"
                name={name}
                defaultValue={formatValue(defaultValue)}
            />
        </div>
    );
}
