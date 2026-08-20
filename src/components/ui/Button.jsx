export default function Button({ label, className = "", buttonType = "button", action, form }) {
    return (
        <button
            form={form}
            type={buttonType}
            onClick={action}
            className={`px-6 py-2 rounded-sm mx-2.5 w-50 bg-[rgba(87,120,230,1)] text-white hover:bg-[rgba(35,75,207,1)]`}
        >
            {label}
        </button>
    )

}

export function CautionButton({ label, className = " ", buttonType = "button", isCancel = false, action }) {

    const variantColor = isCancel ? "bg-yellow-500 hover:bg-yellow-600" : "bg-red-500 hover:bg-red-600";

    return (
        <button
            type={buttonType}
            onClick={action}
            className={`px-6 w-50 py-2 rounded-sm mx-2.5 text-white ${variantColor}`}
        >
            {label}
        </button>
    )
}

export function BackButton({ label, className = " ", buttonType = "button", action }) {
    return (
        <button
            type={buttonType}
            onClick={action}
            className="px-6 w-25 py-1 rounded-md bg-white text-black cursor-pointer border border-black"

        >
            {label}
        </button>
    )
}
