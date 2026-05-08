export default function DateInput({ label, name, defaultValue, values, fieldType }) {
    return (
        <div>
            <label className="block text-sm font-semibold mb-2" htmlFor={label}>
                {label}
            </label>
            <input
                type={fieldType}
                class="w-full px-3 py-2 border rounded"
                name={name}
                defaultValue={
                    defaultValue
                        ? new Date(defaultValue)
                            .toISOString()
                            .slice(0, 16)
                        : ""
                }
            />
        </div>
    );
}
