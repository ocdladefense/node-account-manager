export default function DateView({ label, name, defaultValue, values }) {
    return (
        <div>
            <label>
                {label}
            </label>
            <p>{name}</p>

        </div>
    );
}
