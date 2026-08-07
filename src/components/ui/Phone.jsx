import { unmaskAtIndex } from "./uiFunctions.jsx"


// Function to take a string a 10 digits and format them in the standard '(000) 000-0000' form.
export function formatPhoneNumber(phoneNumber) {
    if (!phoneNumber) return "";

    const digits = phoneNumber.replace(/\D/g, "");

    if (digits.length !== 10) {
        return phoneNumber;
    }

    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export default function Phone({ label, value, privacy }) {


    const formattedValue = formatPhoneNumber(value);


    const handleClick = async (text) => {
        if (!text) return;
        await navigator.clipboard.writeText(text);
    };


    if (formattedValue != null) {
        if (privacy) {

            let cutValue = unmaskAtIndex(formattedValue, 4)
            return (
                <div>
                    <div className="gap-1 rounded bg-blue-50">
                        <label className="text-xl block text-sm font-semibold mb-2">{label}</label>
                        <p className="text-xl">{cutValue}</p>
                    </div>
                </div>
            );
        }
        return (
            <div>
                <div className="gap-1 rounded bg-blue-50">
                    <label className="text-xl block text-sm font-semibold mb-2">{label}</label>
                    <p className="text-xl" onClick={() => handleClick(value)}>{formattedValue}</p>
                </div>
            </div>
        );

    }
    else
        return (
            <div>
                <div className="mb-6 p-4 gap-1 rounded bg-blue-50">
                    <label className="text-xl block text-sm font-semibold mb-2">{label}</label>
                    <p className="text-xl">-</p>
                </div>
            </div>
        );


}
