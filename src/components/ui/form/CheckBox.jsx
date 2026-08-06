export default function CheckBox({ label, name, defaultValue, onChange }) {
    return (
        <div>
            <label className="block text-sm font-semibold mb-2" htmlFor={label}>
                {label}
                <input
                    type="checkbox"
                    className="checkbox ml-3"
                    name={name}
                    defaultChecked={defaultValue}
                    onChange={onChange}
                />
            </label>
        </div>
    );
}
