import DropMenu from "../ui/form/DropMenu";
import { useState } from "react";

export default function OrderConfirmation({ contactIds, products, source, onComplete, onError }) {
    const [paymentTypeId, setPaymentTypeId] = useState("");

    const paymentTypes = [
        {
            Name: "Visa 1234",
            Id: "1234"
        },
        {
            Name: "MasterCard 5678",
            Id: "5678"
        },
        {
            Name: "Invoice",
            Id: "invoice"
        }
    ];

    const selectedPaymentType = paymentTypes.find(
        (entry) => entry.Id === paymentTypeId
    );

    return (
        <form id="single-product-order" onSubmit={handleSubmit}>
            <div>
                {source === "event" && (
                    <p>
                        Proceed with registration for "{products[0]?.Name}"?
                    </p>
                )}

                {source === "subscription" && (
                    <p>
                        Would you like to purchase "{products[0]?.Name}"?
                    </p>
                )}

                <DropMenu
                    label={selectedPaymentType ? selectedPaymentType.Name : "Select Payment Type"}
                    entries={paymentTypes}
                    handler={(entry) => setPaymentTypeId(entry.Id)}
                />
            </div>
        </form>
    );

    async function handleSubmit(e) {
        e.preventDefault();
        e.stopPropagation();

        const resp = await fetch("/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contactIds: contactIds,
                productId: products[0].Id,
                paymentTypeId: paymentTypeId
            })
        });

        const result = await resp.json();

        if (!resp.ok)
        {
            console.error("Order failed:", result);

            onError(
                result.error || "Order could not be created."
            );

            return;
        }

        onComplete("invoice", result.order.id);
    }
}
