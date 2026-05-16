import "../../css/contact.css"
export default function Button({ action, label, buttonType = "button" }) {
    return (
        <>
            <button
                type={buttonType}
                onClick={action}
                className="buttonStyle"

            >
                {label}
            </button>
        </>)

}
