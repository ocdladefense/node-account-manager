import { useState } from "react";

export default function PaymentMethodTest() {


    const handleCreatePaymentMethod = async () => {
        try {
            const response = await fetch("/payment-method", {
                method: "POST"
            });

            const data = await response.json();

            console.log("Result of post:", data);

        } catch (err) {
            console.error(
                "How you goofed:",
                err
            );
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">


            <button className="btn btn-primary" onClick={handleCreatePaymentMethod} >
                Create Test Payment Method
            </button>

        </div>
    );
}
