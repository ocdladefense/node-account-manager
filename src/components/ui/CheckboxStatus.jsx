
export default function CheckboxStatus({ label, value }) {
    return (
        <div>
            <p class="text-xl block text-sm font-semibold mb-2">{label}</p>
            <input
                type="checkbox"
                class="checkbox ml-3 bg-blue-300"
                checked={value}
                disabled
            />
        </div>
    );
}
