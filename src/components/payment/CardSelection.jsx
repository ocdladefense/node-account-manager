import { useState, useEffect } from "react";
import DropMenu from "../ui/form/DropMenu";
import InputForm from "./InputForm";


const defaultPaymentOption = [
    { Id: "new_card", Name: "+ Pay with New Card", type: "new_card" },
    { Id: "invoice", Name: "Bill via Invoice", type: "invoice" },
];

export default function CardSelection() {
    const [selectedOption, setSelectedOption] = useState(null);
    const [paymentOptions, setPaymentOptions] = useState(defaultPaymentOption);

    useEffect(() => {
        const fetchPaymentMethods = async () => {
            try {
                // Implement later
                // const resp = await fetch("/api/query/event-products?eventId=" + selectedEvent?.Id);
                // const data = await resp.json();

                let data = {
                    records: [
                        { Id: "card_1234", Name: "Visa ending in 1234", type: "saved_card" },
                        { Id: "card_5678", Name: "Mastercard ending in 5678", type: "saved_card" }
                    ]
                }

                // if (!resp.ok) {
                //     throw new Error(
                //         data.error || "Unable to retrieve event products."
                //     );
                // }

                setPaymentOptions((options) => {
                    return [...data.records, ...options];
                });

            } catch (error) {
                console.error(
                    "Error fetching payment method",
                    error
                );
            }
        };

        fetchPaymentMethods();
    }, []); // Should we rerun fetch payment methods if customer selects new payment?





    return (
        <div className="w-full flex flex-col items-center space-y-4">
            <input
                name="paymentTypeId"
                type="hidden"
                value={selectedOption?.Id || ""}
                readOnly
            />

            <DropMenu
                label={selectedOption ? selectedOption.Name : "Choose a card"}
                entries={paymentOptions}
                handler={(option) => setSelectedOption(option)}
                thingThatGetsDisplayed={(option) => option.Name}
            />

            {selectedOption?.type === "new_card" && (
                <div className="w-full max-w-sm p-4 bg-gray-50 border border-gray-200 rounded-lg text-left">
                    <InputForm />
                </div>
            )}

            {selectedOption?.type === "invoice" && (
                <div className="w-full max-w-sm p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700 text-left">
                    An invoice for this registration will be billed directly to your account.
                </div>
            )}
        </div>
    );
}

