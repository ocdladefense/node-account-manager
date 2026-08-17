import { useState } from "react";
import ToastContext from "./ToastService";
import { X } from "lucide-react";

const TIMEOUT_TIMER = 5000;
const TOAST_START_INDEX = 0;
let toastId = TOAST_START_INDEX;

// We don't have to try too hard to have unique ids for our Toast component instances.
// Here just use a standard incremeneter to generate the next id.
function getNextToastId() {
    toastId += 1;
    return toastId + "";   // Convert to string to prevent any potential issues with react keys.
}

export default function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);


    const CreateToast = (component, timeout = TIMEOUT_TIMER) => {
        const id = getNextToastId();
        setToasts(toasts => [...toasts, { id, component }]);

        setTimeout(() => CloseToast(id), timeout);

        return id;
    }


    const UpdateToast = (id, component) => {
        setToasts(toasts => [...toasts.filter(toast => toast.id != id), { id, component }]);
    };


    const CloseToast = (id) => setToasts(toasts => toasts.filter(toast => toast.id != id))



    return (
        <ToastContext.Provider value={{ CreateToast, CloseToast, UpdateToast }}>
            {children}
            <div className="space-y-2 fixed bottom-4 right-4 z-[200]">
                {toasts.sort((a, b) => parseInt(a.id) - parseInt(b.id)).map(({ id, component }) => (
                    <div key={id} className="relative">
                        <button onClick={() => CloseToast(id)} className="absolute top-2 right-2 p-1 rounded-lg  bg-gray-200/20 text-gray-800/60">
                            <X size={16} className="text-black" />
                        </button>
                        {component}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )

}
