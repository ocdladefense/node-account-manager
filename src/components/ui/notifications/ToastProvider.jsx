import { useState } from "react";
import ToastContext from "./ToastService";
import { X } from "lucide-react";

const TIMEOUT_TIMER = 5000;

export default function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const CreateToast = (component, timeout = TIMEOUT_TIMER) => {
        const random = Math.random(0, 100);
        const date = Date.now();
        const id = date + "-" + random;
        setToasts(toasts => [...toasts, { id, component }]);

        // setTimeout(() => CloseToast(id), timeout);

        return id;

    }
    const UpdateToast = (id, component) => {
        let filtered = toasts.filter(toast => toast.id != id);
        filtered.push({ id, component });
        console.log("Filtered:", filtered);
        setToasts(filtered);
    };

    const CloseToast = (id) => setToasts(toasts => toasts.filter(toast => toast.id != id))

    return (
        <ToastContext.Provider value={{ CreateToast, CloseToast, UpdateToast }}>
            {children}
            <div className="space-y-2 absolute bottom-4 right-4">
                {toasts.map(({ id, component }) => (
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
