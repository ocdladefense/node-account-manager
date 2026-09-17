import { useState, useEffect } from "react";
import DropMenu from "../ui/form/DropMenu.jsx";



export default function SelectProduct({ products }) {


    // const [products, setProducts] = useState([]);
    const [productIds, setProductIds] = useState(products.length === 1 ? [products[0].Id] : []);

    const selectedProduct = products.length === 1 ? products[0] : products.find(
        (entry) => entry.Id === productIds[0]
    );



    // This fetch is for populating the drop down menu for the registration modal.
    useEffect(() => {
        const fetchEventProducts = async () => {
            try
            {
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

        <div>
            <input name="productIds" type="hidden" value={productIds} readOnly />

            <div className="overflow-hidden w-full">
                <div
                    className={`flex w-[200%]`}
                >
                    {/* Slide 1: Ticket Selection */}
                    <div className="w-1/2 flex flex-col items-center space-y-4 px-4">
                        <DropMenu
                            label={selectedProduct ? (selectedProduct.Name + " - $" + selectedProduct.ClickpdxCatalog__StandardPrice__c) : "Select Event Ticket"}
                            entries={products}
                            handler={(product) => setProductIds([product.Id])}
                            thingThatGetsDisplayed={(product) => product.Name + " - $" + product.ClickpdxCatalog__StandardPrice__c}
                        />
                    </div>


                </div>
            </div>
        </div>

    );
}
