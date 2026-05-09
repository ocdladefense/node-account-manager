
export default function Info({ label, value }) {
    if (value != null) {
        return (
            <div>
                <div className="mb-6 p-4 gap-1 rounded bg-blue-50">
                    <label class="text-xl block text-sm font-semibold mb-2">{label}</label>
                    <p className="text-xl">{value}</p>
                </div>
            </div>
        );

    }
    else
        return (
            <div>
                <div className="mb-6 p-4 gap-1 rounded bg-blue-50">
                    <label class="text-xl block text-sm font-semibold mb-2">{label}</label>
                    <p className="text-xl">Empty</p>
                </div>
            </div>
        );






}
