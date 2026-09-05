import { useState, useEffect } from "react";
import DropMenu from "../ui/form/DropMenu";
import Button, { CautionButton, BackButton } from "../ui/Button.jsx";


export default function OrderConfirmation({ contactIds, products, onComplete, onError, children, closeModal }) {

    const [step, setStep] = useState(1);
    const [paymentTypeId, setPaymentTypeId] = useState(null);
    const [productId, setProductId] = useState(products.length === 1 ? products[0].Id : null);
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

            {step === 2 && (
                <div className="absolute top-6 left-6 z-20">
                    <BackButton className="px-6 w-25 py-1 cursor-pointer rounded-md bg-white text-black hover:bg-gray-100 active:bg-gray-200 transition-colors duration-150" label="< Back" action={() => setStep(1)} />
                </div>
            )}
            <div>

                {children}

                <input name="contactIds" type="hidden" value={contactIds} readOnly />
                <input name="productId" type="hidden" value={productId} readOnly />
                <input name="paymentTypeId" type="hidden" value={paymentTypeId} readOnly />

                <div className="overflow-hidden w-full">
                    <div
                        className={`flex w-[200%] transition-transform duration-300 ease-in-out ${step === 2 ? "-translate-x-1/2" : "translate-x-0"
                            }`}
                    >
                        <div className="w-1/2 flex flex-col items-center space-y-4 px-4">
                            <DropMenu
                                label={selectedProduct ? (selectedProduct.Name + " - $" + selectedProduct.ClickpdxCatalog__StandardPrice__c) : "Select Event Ticket"}
                                entries={products}
                                handler={(product) => setProductId(product.Id)}
                                thingThatGetsDisplayed={(product) => product.Name + " - $" + product.ClickpdxCatalog__StandardPrice__c}
                            />

                            <p>&nbsp;</p>
                            <div>
                                <Button label="Pay Now" buttonType="button" action={() => {
                                    if (!productId) {
                                        alert("Please select an event ticket before proceeding.");
                                        return;
                                    }
                                    setStep(2);
                                }} />
                                <CautionButton label="Cancel" buttonType="button" action={closeModal} isCancel={true} />
                            </div>
                        </div>

                        <div className="w-1/2 flex flex-col items-center space-y-4 px-4">

                            <DropMenu
                                label={selectedPaymentType ? selectedPaymentType.Name : "Select Payment Type"}
                                entries={paymentTypes}
                                handler={(paymentType) => setPaymentTypeId(paymentType.Id)}
                            />

                            <p>&nbsp;</p>
                            <div>
                                <Button label="Register" buttonType="submit" form="order-confirmation" />
                                <CautionButton label="Cancel" buttonType="button" action={closeModal} isCancel={true} />
                            </div>
                        </div>
                    </div>
                </div>
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

        if (!resp.ok) {
            console.error("Order failed:", result);

            onError(result.error || "Order could not be created.");
            return;
        }

        onComplete(result.postingEntity, result.order.id);
    };
}


