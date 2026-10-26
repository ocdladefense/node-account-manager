
import { useState, useEffect } from "react";
import EventTicketOrderLine from "./EventTicketOrderLine.jsx";


const USE_SUGGESTIONS = true;

export default function EventTicketOrder({ contacts, data, setData }) {

    let selectedContactIds = data.selectedContactIds || [];

    const [tickets, setTickets] = useState([]);
    const selectedEventId = data.selectedEvent?.Id;

    useEffect(() => {

        if (!selectedEventId || selectedContactIds.length === 0) {
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

            if (!resp.ok) {
                throw new Error(
                    result.error || "Unable to retrieve event products."
                );
            }

            setTickets(result.records);
        };

        fetchTickets();

    }, [selectedEventId, selectedContactIds]);



    useEffect(() => {

        if (!USE_SUGGESTIONS || !selectedEventId || selectedContactIds.length === 0 || tickets.length === 0) {
            return;
        }

        let cancelled = false;

        const fetchSuggestions = async () => {
            try {
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

                const result = await resp.json();

                if (!resp.ok) {
                    throw new Error(result.error || "Unable to retrieve ticket suggestions.");
                }

                if (cancelled) return;

                selectedContactIds.forEach(contactId => {

                    const productId =
                        result.recommendations?.[contactId]?.productId;

                    const product = tickets.find(ticket => ticket.Id === productId);

                    if (product) {
                        handleTicketSelect(setData, contactId, product, true);
                    }
                });

            } catch (error) {
                if (!cancelled) {
                    console.error("Error fetching ticket suggestions:", error);
                }
            }
        };

        fetchSuggestions();

        return () => {
            cancelled = true;
        };

    }, [selectedEventId, selectedContactIds, tickets, setData]);


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
        </div>
    )
}




async function handleTicketSelect(setData, contactId, product, isSuggestion = false) {

    try {
        const resp = await fetch("/event/price", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contactId: contactId,
                productId: product.Id
            })
        });

        const result = await resp.json();

        if (!resp.ok) {
            throw new Error(result.error || "Unable to calculate ticket price.");
        }

        const price = Number(result.price);

        setData(prev => {

            if (isSuggestion && prev.orderLines?.[contactId]) {
                return prev;
            }

            const lineItem = {
                contactId: contactId,
                productId: product.Id,
                UnitPrice: price
            };

            const orderLines = {
                ...prev.orderLines,
                [contactId]: lineItem
            };

            const total = Object.values(orderLines).reduce(
                (sum, item) => sum + item.UnitPrice,
                0
            );

            return {
                ...prev,
                orderLines,
                total
            };
        });

    } catch (error) {
        console.error("Ticket selection failed:", error);
    }
}



