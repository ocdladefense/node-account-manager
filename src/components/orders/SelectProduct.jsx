import { useState } from "react";
import DropMenu from "../ui/form/DropMenu.jsx";

export default function SelectProduct({ contactIds, products }) {


    const [productIds, setProductIds] = useState(products.length === 1 ? [products[0].Id] : []);

    const selectedProduct = products.length === 1 ? products[0] : products.find(
        (entry) => entry.Id === productIds[0]
    );





    return (

        <div>


            <input name="contactIds" type="hidden" value={contactIds} readOnly />
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
