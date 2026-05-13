
export default function Website({ label, value }) {
    if (value != null) {
        return (
            <div>
                <div className="gap-1 rounded bg-blue-50">
                    <label class="text-xl block text-sm font-semibold mb-2">{label}</label>
                    <a href={value} target="_blank" rel="noopener noreferrer" className="text-xl text-blue-600 underline break-all">
                        {value}
                    </a>
                </div>
            </div>
        );

    }
    else
        return (
            <div>
                <div className="gap-1 rounded bg-blue-50">
                    <label class="text-xl block text-sm font-semibold mb-2">{label}</label>
                    <p className="text-xl">Empty</p>
                </div>
            </div>
        );


}
