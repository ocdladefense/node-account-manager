export default function Button({ action, label, buttonType = "button" }) {
    return (
        <>
            <button
                type={buttonType}
                onClick={action}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
                {label}
            </button>
        </>)

}
