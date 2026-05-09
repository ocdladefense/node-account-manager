export default function CheckBox({ label, name, defaultValue }) {
    return (
        <div>
            <label className="block text-sm font-semibold mb-2" htmlFor={label}>
                {label}
                <input
                    type="checkbox"
                    class="checkbox ml-3"
                    name={name}
                    defaultChecked={defaultValue}
                    className="ml-3"
                />
            </label>
        </div>
    );
}
