export default function Button({ label, className = " ", buttonType = "button", action }) {
    return (
        <>
            <button
                type={buttonType}
                onClick={action}
                className="px-[24px] py-[8px] rounded-sm mx-[10px] w-[200px] bg-[rgba(87,120,230,1)] text-white"

            >
                {label}
            </button>
        </>)

}

export function CautionButton({ label, className = " ", buttonType = "button", action }) {
    return (
        <>
            <button
                type={buttonType}
                onClick={action}
                className="px-[24px] w-[200px] py-[8px] rounded-sm mx-[10px] bg-red-800 text-white"

            >
                {label}
            </button>
        </>)

}
// !w - fit!bg - white!text - gray - 800!border border - black - 300!hover: bg - gray - 100!px - 3!py - 1!text - sm!font - medium!rounded - lg!transition - colors

export function BackButton({ label, className = " ", buttonType = "button", action }) {
    return (
        <>
            <button
                type={buttonType}
                onClick={action}
                className="px-[24px] w-[100px] py-[4px] rounded-md bg-white text-black cursor-pointer border border-black"

            >
                {label}
            </button>
        </>)

}
