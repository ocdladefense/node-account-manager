
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

        if (!selectedEventId || selectedContactIds.length === 0) {
            return;
        }

        const fetchEventProducts = async () => {

            try {

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

                setEventProducts(result.records);

                // const recommendedProductIds = selectedContactIds.map(
                //     contactId => result.recommendations[contactId]?.productId || ""
                // );

                // const recommendedPrices = selectedContactIds.map(
                //     contactId => result.recommendations[contactId]?.price ?? null
                // );

                // setData(prev => ({
                //     ...prev,
                //     productIds: recommendedProductIds,
                //     prices: recommendedPrices
                // }));

            } catch (error) {
                console.error("Error fetching event products:", error);
            }
        };

        fetchEventProducts();


    }, [selectedEventId, selectedContactIds]);



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

    // We can remove error handling whenever you want, I just had it in here for testing purposes (and it helped too lol)
    // We now make calls to the new event/price endpoint to calculate the correct price to display, and also store it in data.prices

    // Had to move this function back inside the component to access selectedEventId and setData
    const handleProductSelect = async (contactId, product) => {

        try {
            const resp = await fetch("/event/price", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contactId: contactId,
                    productId: product.Id,
                    eventId: selectedEventId
                })
            });

            const result = await resp.json();

            if (!resp.ok) {
                throw new Error(
                    result.error || "Unable to calculate product price."
                );
            }

            setData(prev => {

                const contactIds = prev.selectedContactIds || [];
                const productIds = [...(prev.productIds || [])];
                const prices = [...(prev.prices || [])];

                const contactIndex = contactIds.indexOf(contactId);

                // testing buffer because indexOf returns '-1' when value isn't found (user removes a contact while price is updating)
                if (contactIndex === -1) {
                    return prev;
                }

                productIds[contactIndex] = result.productId;
                prices[contactIndex] = result.price;

                return {
                    ...prev,
                    productIds,
                    prices
                };
            });

        } catch (error) {
            console.error("Error updating selected product:", error);
        }
    };






    return (

        <div>

            <h1 className="text-2xl font-bold mb-4"> {selectedContacts.length} people selected.</h1>

            <input name="productIds" type="hidden" value={Array.from(theMap.values())} readOnly form="batch-action" />


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

                    {selectedContacts.map((contact) => (
                        <TableRow key={contact.Id} id={contact.Id} name={contact.Name} status={contact.Ocdla_Member_Status__c} product={theMap.get(contact.Id)} price={data.prices?.[selectedContactIds.indexOf(contact.Id)]} products={eventProducts} handleProductSelect={handleProductSelect} addToSelectedContactIds={addToSelectedContactIds} />
                    ))}
                </tbody>

            </table>
        </div>
    )
}




function TableRow({ id, name, status, product, products, handleProductSelect, price }) {

    // This value didn't work with a useState initial value, but I don't think the useState was necessary for this step? Ask Jose about it.
    const selectedProduct = products.find(item => item.Id === product);

    function thingThatGetsDisplayed(product) {

        // let timeLeft = product.timeLeftInDays;
        let timeLeft = 2;

        return `${product.Name} - $${product.EarlyBirdPrice} ($${product.Price} in ${timeLeft} day(s)!)`;
        //product.MemberPrice
        //product.EarlyBirdPrice
    }

    return (
        <tr className="border-b cursor-pointer hover:bg-gray-100">

            {/* <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                <CheckBox label="" name="" value={id} defaultValue={false} onChange={addToSelectedContactIds} />
            </td> */}

            <td className="px-4 py-3">{name}</td>


            <td className="px-4 py-3">{status || "-"}</td>

            <td className="px-4 py-3 w-[300px]">
                <DropMenu label={selectedProduct ? `${selectedProduct.Name} - ${price != null ? `$${price}` : "Price unavailable"}` : "Select Product"} entries={products} handler={(product) => { handleProductSelect(id, product); }} thingThatGetsDisplayed={thingThatGetsDisplayed} />
            </td>


        </tr>
    )
}





