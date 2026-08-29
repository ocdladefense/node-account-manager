import DropMenu from "../ui/form/DropMenu";
import { useState, useEffect } from "react";



export default function OrderConfirmation({ contactIds, source, onComplete, onError }) {

    const [paymentTypeId, setPaymentTypeId] = useState("");
    const [eventProducts, setEventProducts] = useState([]);
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

    const selectedProduct = eventProducts.find(
        (entry) => entry.Id === productId
    );

    // This fetch is for populating the drop down menu for the registration modal.
    useEffect(() => {
        const fetchEventProducts = async () => {
            try {
                const resp = await fetch("/api/query/event-products");
                const data = await resp.json();

                if (!resp.ok) {
                    throw new Error(
                        data.error || "Unable to retrieve event products."
                    );
                }

                setEventProducts(data.records);

            } catch (error) {
                console.error(
                    "Error fetching event products:",
                    error
                );
            }
        };

        fetchEventProducts();
    }, []);




    return (


        <form id="batch-registration" onSubmit={handleSubmit}>
            <div>
                {source == "event" &&
                    <p>
                        {selectedProduct
                            ? `Proceed with registration for "${selectedProduct.Name}"? You will register ${contactCount} attendee(s).`
                            : `Please select an event ticket.`}
                    </p>
                }

                <DropMenu
                    label={selectedPaymentType ? selectedPaymentType.Name : "Select Payment Type"}
                    entries={paymentTypes}
                    handler={(entry) => setPaymentTypeId(entry.Id)}
                />

                <DropMenu
                    label={selectedProduct ? selectedProduct.Name : "Select Event Ticket"}
                    entries={eventProducts}
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

        if (!resp.ok) {
            console.error("Order failed:", result);

            onError(result.error || "Order could not be created.");
            return;
        }

        onComplete("invoice", result.order.id);
    };
}


