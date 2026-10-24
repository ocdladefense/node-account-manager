
import { useState, useEffect } from "react";
import EventTicketOrderLine from "./EventTicketOrderLine.jsx";


export default function EventTicketOrder({ contacts, data, setData }) {

    // Step 1: Prove that we can construct and use a JavaScript Map.

    // Step 2: Figuring out how to populate the Map with actual data from the previous step.
    let selectedContactIds = data.selectedContactIds || [];

    // Step 2.5: Use the event selected in the previous step to populate the drop menu with the associated tickets from the server.
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



    const selectedContacts = contacts.filter(contact => selectedContactIds.includes(contact.Id));




    return (

        <div>

            <h1 className="text-2xl font-bold mb-4"> {selectedContacts.length} people selected.</h1>



            <table className="w-full border-collapse">

                <thead>

                    <tr className="border-b bg-gray-100">

                        {/* <th className="px-4 py-3"></th> */}

                        <th className="px-4 py-3 text-left">Name</th>

                        <th className="px-4 py-3 text-left">Member Status</th>

                        <th className="px-4 py-3 text-left">Product</th>

                    </tr>

                </thead>

                <tbody>

                    {selectedContacts.map((contact) => {
                        let selectedTicketId = "";
                        return <EventTicketOrderLine key={contact.Id} id={contact.Id} name={contact.Name} status={contact.Ocdla_Member_Status__c} selectedTicketId={data.orderLines?.[contact.Id]?.ProductId || ""} tickets={tickets} handleTicketSelect={handleTicketSelect.bind(null, setData)} />
                    })}
                </tbody>

            </table>
        </div>
    )
}



function handleTicketSelect(setData, contactId, product) {


    // const resp = await fetch("/event/price", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({
    //         contactId: contactId,
    //         productId: product.Id,
    //         eventId: selectedEventId
    //     })
    // });

    // const result = await resp.json();

    // if (!resp.ok) {
    //     throw new Error(
    //         result.error || "Unable to calculate product price."
    //     );
    // }


    const price = Number(product.Price);

    setData(prev => {


        let lineItem = { contactId: contactId, productId: product.Id, UnitPrice: price };

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

};




