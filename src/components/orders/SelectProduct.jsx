import { useState, useEffect } from "react";
import DropMenu from "../ui/form/DropMenu.jsx";



export default function SelectProduct({ data, setData }) {

    const [products, setProducts] = useState([]);
    const [productIds, setProductIds] = useState([]);
    let selectedEvent = data?.selectedEvent;



    const selectedProduct = products.length === 1 ? products[0] : products.find(
        (entry) => entry.Id === productIds[0]
    );



    // This fetch is for populating the drop down menu for the registration modal.
    useEffect(() => {
        const fetchEventProducts = async () => {
            try
            {

                console.log(selectedEvent);
                const resp = await fetch("/api/query/event-products?eventId=" + selectedEvent?.Id);
                const data = await resp.json();

                if (!resp.ok)
                {
                    throw new Error(
                        data.error || "Unable to retrieve event products."
                    );
                }

                setProducts(data.records);

            } catch (error)
            {
                console.error(
                    "Error fetching event products:",
                    error
                );
            }
        };

        if (!selectedEvent) return;
        fetchEventProducts();
    }, [selectedEvent]);




    return (

        <>
            <input name="productIds" type="hidden" value={productIds} readOnly />


            <DropMenu
                label={selectedProduct ? (selectedProduct.Name + " - $" + selectedProduct.ClickpdxCatalog__StandardPrice__c) : "Select Ticket"}
                entries={products}
                handler={(product) => setProductIds([product.Id])}
                thingThatGetsDisplayed={(product) => product.Name + " - $" + product.ClickpdxCatalog__StandardPrice__c}
            />

        </>

    );
}
