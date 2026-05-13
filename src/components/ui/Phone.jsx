
export default function Phone({ label, value, privacy }) {


    const handleClick = async (text) => {
        if (!text) return;
        await navigator.clipboard.writeText(text);
    };


    if (value != null) {
        if (privacy) {
            let cutValue = value.slice(-4);
            return (
                <div>
                    <div className="gap-1 rounded bg-blue-50">
                        <label class="text-xl block text-sm font-semibold mb-2">{label}</label>
                        <p className="text-xl">***-***-{cutValue}</p>
                    </div>
                </div>
            );
        }
        return (
            <div>
                <div className="gap-1 rounded bg-blue-50">
                    <label class="text-xl block text-sm font-semibold mb-2">{label}</label>
                    <p className="text-xl" onClick={() => handleClick(value)}>{value}</p>
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
