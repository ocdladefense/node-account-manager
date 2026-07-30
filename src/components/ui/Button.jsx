import "../../css/contact.css"
export default function Button({ action, label, className = " ", buttonType = "button" }) {
    return (
        <>
            <button
                type={buttonType}
                onClick={action}
                className={`buttonStyle ${className}`}

            >
                {label}
            </button>
        </>)

}
