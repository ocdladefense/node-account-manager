export default function Button({ label, size = "px-6 py-2 w-50", className = "", buttonType = "button", action, form }) {
    return (
        <button
            form={form}
            type={buttonType}
            onClick={action}
            className={` rounded-sm cursor-pointer mx-2.5 bg-[rgba(87,120,230,1)] text-white hover:bg-[rgba(35,75,207,1)] ${size}`}
        >
            {label}
        </button>
    )

}

export function CautionButton({ label, className, buttonType = "button", isCancel = false, action }) {

    const variantColor = isCancel ? "bg-yellow-500 cursor-pointer hover:bg-yellow-600" : "bg-red-500 hover:bg-red-600";

    return (
        <button
            type={buttonType}
            onClick={action}
            className={className || `px-6 w-50 py-2 cursor-pointer rounded-sm mx-2.5 text-white ${variantColor}`}
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
            className={className || "px-6 w-25 py-1 cursor-pointer rounded-md bg-white text-black cursor-pointer border border-black"}

        >
            {label}
        </button>
    )
}
