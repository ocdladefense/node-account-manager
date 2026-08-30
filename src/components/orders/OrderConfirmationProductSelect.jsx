import DropMenu from "../ui/form/DropMenu";
import { useState, useEffect } from "react";



export default function OrderConfirmationProductSelect({ contactIds, products, source, onComplete, onError, label, defaultProduct }) {

    const [paymentTypeId, setPaymentTypeId] = useState("");
    const [productId, setProductId] = useState("");
    const [contactCount, setContactCount] = useState(contactIds.length);


    let paymentTypes = [
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

    const selectedProduct = products.find(
        (entry) => entry.Id === productId
    );




    return (


        <form id="batch-registration" onSubmit={handleSubmit}>
            <div>
                <h2 className="text-2xl font-semibold mb-4">{label}</h2>

                {source == "event" &&
                    <p>
                        {selectedProduct
                            ? `Proceed with registration for "${selectedProduct.Name}"? You will register ${contactCount} attendee(s).`
                            : `Please select an event ticket.`}
                    </p>
                }

                {source == "subscription" &&
                    <p>Would you like to purchase this subscription?</p>
                }

                <DropMenu
                    label={selectedPaymentType ? selectedPaymentType.Name : "Select Payment Type"}
                    entries={paymentTypes}
                    handler={(entry) => setPaymentTypeId(entry.Id)}
                />

                <DropMenu
                    label={selectedProduct ? selectedProduct.Name : "Select Event Ticket"}
                    entries={products}
                    handler={(entry) => setProductId(entry.Id)}
                />

                <input name="paymentTypeId" type="hidden" value={paymentTypeId} readOnly />

                <input name="productId" type="hidden" value={productId} readOnly />

                <input name="contactIds" type="hidden" value={contactIds} readOnly />
            </div>
        </form>

    );

    async function handleSubmit(e) {
        e.preventDefault();
        e.stopPropagation();

        const formData = new FormData(document.getElementById("batch-registration"));

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
}


