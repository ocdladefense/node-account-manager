export default function CheckBox({ label, name, defaultValue }) {
    return (
        <div>
            <label className="block text-sm font-semibold mb-2" htmlFor={label}>
                {label}
                <input
                    type="checkbox"
                    name={name}
                    defaultChecked={defaultValue}
                />
            </label>
        </div>
    );
}
