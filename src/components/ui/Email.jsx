import { shouldRemove, doubleAsterisk, randomAsterisk, maskAtInterval } from "./uiFunctions.jsx"

function maskEmail(email) {
    const parts = email.split("@");
    let Username = parts[0];
    let Domain = parts[1];
    let maskedUser = Username
        .split("")
        .map(maskAtInterval.bind(null, 3))
        .join("");

    maskedUser = maskedUser
        .split("")
        .filter(shouldRemove)
        .join("");

    maskedUser = maskedUser
        .split("")
        .map(doubleAsterisk)
        .join("");

    let Parts = Domain.split(".");
    let Provider = Parts[0];
    let TLD = Parts[1];

    let MaskedProvider = Provider
        .split("")
        .map(randomAsterisk)
        .join("");

    let joinedProvider = `${MaskedProvider}.${TLD}`;






    return `${maskedUser}@${joinedProvider}`;

}

export default function Email({ label, value, privacy }) {

    const handleClick = async (text) => {
        if (!text) return;
        await navigator.clipboard.writeText(text);
    };
    if (value == null) {
        return (
            <div>
                <div className="gap-1 rounded bg-blue-50">
                    <label class="text-xl block text-sm font-semibold mb-2">{label}</label>
                    <p className="text-xl">Empty</p>
                </div>
            </div>
        );
    }

    const displayValue = privacy ? maskEmail(value) : value;

    return (
        <div className="gap-1 rounded bg-blue-50">
            <label className="text-xl block font-semibold mb-2">
                {label}
            </label>

            <p
                className={`text-xl ${!privacy ? "cursor-pointer" : ""}`}
                onClick={!privacy ? () => handleClick(value) : undefined}
            >
                {displayValue}
            </p>
        </div>
    );
}
