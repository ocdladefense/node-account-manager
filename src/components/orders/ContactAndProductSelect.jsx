
import { useState, useEffect } from "react";
import CheckBox from "../ui/form/CheckBox.jsx";
import DropMenu from "../ui/form/DropMenu.jsx";


export default function ContactAndProductSelect({ contacts, data, setData }) {

    // Step 1: Prove that we can construct and use a JavaScript Map.

    // Step 2: Figuring out how to populate the Map with actual data from the previous step.
    let selectedContactIds = data.selectedContactIds || [];

    // Step 2.5: Use the event selected in the previous step to populate the drop menu with the associated tickets from the server.
    const [eventProducts, setEventProducts] = useState([]);
    const selectedEventId = data.selectedEvent?.Id;

    useEffect(() => {

        if (!selectedEventId) {
            return;
        }

        const fetchEventProducts = async () => {

            try {

                const resp = await fetch(`/api/query/event-products?eventId=${encodeURIComponent(selectedEventId)}`);
                const result = await resp.json();

                if (!resp.ok) {
                    throw new Error(result.error || "Unable to retrieve event products.");
                }

                setEventProducts(result.records);

            } catch (error) {
                console.error("Error fetching event products:", error);
            }
        };

        fetchEventProducts();
    }, [selectedEventId]);


    const selectedContacts = contacts.filter(contact => selectedContactIds.includes(contact.Id));

    // This Map would actually happen on the server, returning the recommended ticket for each contact.
    let theMap = new Map();

    selectedContactIds.forEach((contactId, index) => {

        const productId = data.productIds?.[index] || "";
        theMap.set(contactId, productId);
    });


    const addToSelectedContactIds = (event) => {
        const { value, checked } = event.target;

        let fn = checked
            ? (prev) => [...prev, value]
            : (prev) => prev.filter((item) => item !== value);

        setData(prev => ({ ...prev, selectedContactIds: fn(prev) }));
    };


    const handleProductSelect = (contactId, product) => {

        setData(prev => {

            const contactIds = prev.selectedContactIds || [];
            const productIds = [...(prev.productIds || [])];

            const contactIndex = contactIds.indexOf(contactId);

            productIds[contactIndex] = product.Id;

            return { ...prev, productIds };
        });
    };



    return (

        <div>

            <h1 className="text-2xl font-bold mb-4"> {selectedContacts.length} people selected.</h1>

            <input name="productIds" type="hidden" value={Array.from(theMap.values())} readOnly form="batch-action" />


            <table className="w-full border-collapse">

                <thead>

                    <tr className="border-b bg-gray-100">

                        <th className="px-4 py-3"></th>

                        <th className="px-4 py-3 text-left">Name</th>

                        <th className="px-4 py-3 text-left">Member Status</th>

                        <th className="px-4 py-3 text-left">Product</th>

                    </tr>

                </thead>

                <tbody>

                    {selectedContacts.map((contact) => (
                        <TableRow key={contact.Id} id={contact.Id} name={contact.Name} status={contact.Ocdla_Member_Status__c} product={theMap.get(contact.Id)} products={eventProducts} handleProductSelect={handleProductSelect} addToSelectedContactIds={addToSelectedContactIds} />
                    ))}
                </tbody>

            </table>
        </div>
    )
}




function TableRow({ id, name, status, products, handleProductSelect, addToSelectedContactIds }) {

    const [selectedProduct, setSelectedProduct] = useState(null);

    return (
        <tr className="border-b cursor-pointer hover:bg-gray-100">

            <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                <CheckBox label="" name="" value={id} defaultValue={false} onChange={addToSelectedContactIds} />
            </td>

            <td className="px-4 py-3">{name}</td>


            <td className="px-4 py-3">{status || "-"}</td>

            <td className="px-4 py-3 w-[300px]">
                <DropMenu label={selectedProduct ? selectedProduct.Name : "Select Product"} entries={products} handler={(product) => {
                    setSelectedProduct(product);
                    handleProductSelect(id, product);
                    console.log("Selected product: ", id, product);
                }} />
            </td>


        </tr>
    )
}
