export default function Date({ label, name, defaultValue, values, multiple = false }) {
    return (
        <div>
            <label className="block text-sm font-semibold mb-2" htmlFor={label}>
                {label}
                <select
                    name={name}
                    defaultValue={defaultValue}
                    className="w-full px-3 py-2 border rounded"
                    id={label.split(" ").join("")}
                    multiple={multiple}
                >
                    <option value="">-- None --</option>

                    {values.map((item) => (
                        <option key={item.value} value={label == "State" ? item.label : item.value}>
                            {item.label}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
}
