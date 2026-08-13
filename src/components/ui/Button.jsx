export default function Button({ label, className = "", buttonType = "button", action, ...props }) {
    return (
        <button
            {...props}
            type={buttonType}
            onClick={action}
            className={`px-[24px] py-[8px] rounded-sm mx-[10px] w-[200px] bg-[rgba(87,120,230,1)] text-white hover:bg-[rgba(35,75,207,1)]`}
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
            className={`px-[24px] w-[200px] py-[8px] rounded-sm mx-[10px] text-white ${variantColor}`}
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
            className="px-[24px] w-[100px] py-[4px] rounded-md bg-white text-black cursor-pointer border border-black"

        >
            {label}
        </button>
    )
}
