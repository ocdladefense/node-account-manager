import { useState } from "react";
// import Button, { CautionButton, BackButton } from "../ui/Button.jsx";




export default function ConfirmOrder({ onComplete, onError, onSubmit = handleSubmit.bind(null, onComplete, onError) }) {


    return (

        <div>

            <div className="overflow-hidden w-full">
                <div>
                    <h2>Confirm Your Order</h2>
                </div>
            </div>
        </div>
    );


}




async function handleSubmit(onComplete, onError, e) {
    e.preventDefault();
    e.stopPropagation();

    const formData = new FormData(document.getElementById("order-confirmation"));

    const plainObject = Object.fromEntries(formData);

    const resp = await fetch("/orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(plainObject)
    });

    const result = await resp.json();

    if (!resp.ok)
    {
        console.error("Order failed:", result);

        onError(result.error || "Order could not be created.");
        return;
    }

    onComplete(result.postingEntity, result.order.id);
};
