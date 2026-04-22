export default function TextInput({ label, apiName, currentValue }) {
    return (
        <div className="mb-4">
            <label htmlFor={label} className="block text-sm font-semibold mb-2">{label}</label>
            <input type="text" name={apiName} defaultValue={currentValue} id={label} className="w-full px-3 py-2 border rounded" />
        </div>
    )
}
