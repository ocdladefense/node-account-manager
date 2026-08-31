import { useState, useEffect } from "react";
import DropMenu from "../ui/form/DropMenu";
import Button from "../ui/Button.jsx";


export default function OrderConfirmation({ contactIds, products, source, onComplete, onError, children, closeModal }) {

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

    const selectedProduct = products.length === 1 ? products[0] : products.find(
        (entry) => entry.Id === productId
    );




    return (


        <form id="order-confirmation" onSubmit={handleSubmit}>
            <div>

                {children}

                <DropMenu
                    label={selectedPaymentType ? selectedPaymentType.Name : "Select Payment Type"}
                    entries={paymentTypes}
                    handler={(paymentType) => setPaymentTypeId(paymentType.Id)}
                />

                <DropMenu
                    label={selectedProduct ? selectedProduct.Name : "Select Event Ticket"}
                    entries={products}
                    handler={(product) => setProductId(product.Id)}
                />

                <input name="paymentTypeId" type="hidden" value={paymentTypeId} readOnly />

                <input name="productId" type="hidden" value={productId} readOnly />

                <input name="contactIds" type="hidden" value={contactIds} readOnly />
                <p>&nbsp;</p>
                <Button label="Register" buttonType="submit" form="order-confirmation" />
                <Button label="Cancel" buttonType="button" action={closeModal} />
            </div>
        </form>

    );

    async function handleSubmit(e) {
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
}


