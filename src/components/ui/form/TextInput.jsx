export default function TextInput({ label, apiName, value, currentValue }) {
    const id = label.split(" ").filter((t) => t).join("");
    return (
        <div className="mb-4">
            <label htmlFor={id} className="block text-sm font-semibold mb-2">{label}</label>
            <input type="text" name={apiName} value={value || currentValue} id={id} className="w-full px-3 py-2 border rounded focus:bg-cyan-100" />
        </div>
    )
}
