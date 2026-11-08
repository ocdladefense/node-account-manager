
import { useState, useEffect } from "react";
import EventTicketOrderLine from "./EventTicketOrderLine.jsx";
import { hashContactIds, getOrderTotal } from "../../../utils/Order.js";



const USE_SUGGESTIONS = true;

export default function EventTicketOrder({ contacts, data, setData }) {

    let selectedContactIds = data.selectedContactIds || [];


    const [tickets, setTickets] = useState([]);
    const selectedEventId = data.selectedEvent?.Id;


    useEffect(() => {

        let orderLines = {};

        selectedContactIds.forEach(contactId => {

            let lineItem = {
                contactId: contactId,
                productId: null,
                UnitPrice: 0
            };

            orderLines[contactId] = lineItem;
        });

        setData(prev => {


            return {
                ...prev,
                orderLines
            };
        });
        console.log(orderLines);

    }, []);





    useEffect(() => {

        if (!selectedEventId)
        {
            return;
        }

        const fetchTickets = async () => {


            const resp = await fetch("/event-products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    eventId: selectedEventId
                })
            });

            const result = await resp.json();

            if (!resp.ok)
            {
                throw new Error(
                    result.error || "Unable to retrieve event products."
                );
            }

            setTickets(result.records);
        };

        fetchTickets();

    }, [selectedEventId, selectedContactIds]);





    let contactIdsHash = hashContactIds(Object.keys(data.orderLines || {}));

    useEffect(() => {

        if (!USE_SUGGESTIONS || !selectedEventId || selectedContactIds.length === 0)
        {
            return;
        }

        const fetchSuggestions = async () => {

            const resp = await fetch("/product-suggestions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contactIds: selectedContactIds,
                    eventId: selectedEventId
                })
            });

            const suggest = await resp.json();

            if (!resp.ok)
            {
                throw new Error(result.error || "Unable to retrieve ticket suggestions.");
            }

            for (const suggestion of suggest)
            {
                let orderLine = data.orderLines[suggestion.contactId];
                orderLine.productId = suggestion.productId;
                orderLine.UnitPrice = suggestion.price;
            }


            data.total = getOrderTotal(data.orderLines);

        };

        fetchSuggestions();



    }, [contactIdsHash, selectedEventId]);


    const selectedContacts = contacts.filter(contact => selectedContactIds.includes(contact.Id));


    return (

        <div>

            <h1 className="text-2xl font-bold mb-4"> {selectedContacts.length} people selected.</h1>



            <table className="w-full border-collapse">

                <thead>

                    <tr className="border-b bg-gray-100">

                        <th className="px-4 py-3 text-left">Name</th>

                        <th className="px-4 py-3 text-left">Member Status</th>

                        <th className="px-4 py-3 text-left">Product</th>

                    </tr>

                </thead>

                <tbody>

                    {selectedContacts.map((contact) => {
                        return <EventTicketOrderLine key={contact.Id} id={contact.Id} name={contact.Name} status={contact.Ocdla_Member_Status__c} selectedTicketId={data.orderLines?.[contact.Id]?.productId || ""} price={data.orderLines?.[contact.Id]?.UnitPrice} tickets={tickets} handleTicketSelect={handleTicketSelect.bind(null, setData)} />
                    })}
                </tbody>

            </table>

            <div>
                <p>
                    Order Total: ${data.total}
                </p>

            </div>



        </div>
    )
}




async function handleTicketSelect(setData, contactId, product, isSuggestion = false) {

    try
    {
        const resp = await fetch("/event/price", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify([{
                contactId: contactId,
                productId: product.Id
            }])
        });

        const suggestedPrices = await resp.json();

        if (!resp.ok)
        {
            throw new Error(prices.error || "Unable to calculate ticket price.");
        }



        setData(prev => {

            let orderLines = {};

            for (let suggested of suggestedPrices)
            {
                const price = Number(suggested.price);
                const contactId = suggested.contactId;
                const productId = suggested.productId;

                const lineItem = {
                    contactId,
                    productId,
                    UnitPrice: price
                };
                // change this prop to "price"

                orderLines = {
                    ...prev.orderLines,
                    [contactId]: lineItem
                };


            }


            // This will also need to change to "price"
            const total = getOrderTotal(orderLines);

            return {
                ...prev,
                orderLines,
                total
            };
        });

    } catch (error)
    {
        console.error("Ticket selection failed:", error);
    }
}



