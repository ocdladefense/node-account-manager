import "../../css/contact.css"
export default function Button({ action, label, className = "buttonStyle", buttonType = "button" }) {
    return (
        <>
            <button
                type={buttonType}
                onClick={action}
                className={className}

            >
                {label}
            </button>
        </>)

}
