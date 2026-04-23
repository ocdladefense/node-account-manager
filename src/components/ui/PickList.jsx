export default function PickList({ label, name, defaultValue, values }) {
    return (
        <div>
            <label className="block text-sm font-semibold mb-2" htmlFor={label}>
                {label}
                <select
                    name={name}
                    defaultValue={defaultValue}
                    className="w-full px-3 py-2 border rounded"
                >
                    {/* <option value="">-- None --</option> */}

                    {values.map((item) => (
                        <option key={item.value} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
}


