import { createContext, useContext } from "react";

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);
export default ToastContext;

/**
 * provides a standard toast object to be used with CreateToast, not to be used standalone.
 * @param {string} Message the message the toast will display to the user
 * @param {string} [className] the className to be passed to the div for styling
 * @param {boolean} [useDefaultSyle=true] if the toast should use the default style in addition to user provided style
 * @returns {React.JSX.Element} Toast
 */
export function NewToast(Message, className = "", useDefaultSyle = true) {
    let styles;
    if (useDefaultSyle) styles = "bg-green-500 text-black px-6 py-4 text-lg font-semibold rounded-lg shadow-lg" + className;
    else styles = className;

    return (
        <div className={styles}>
            {Message}
        </div>
    );
}

