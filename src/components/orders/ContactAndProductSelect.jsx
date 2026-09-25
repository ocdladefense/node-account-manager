
import { useState, useEffect } from "react";
import CheckBox from "../ui/form/CheckBox.jsx";
import DropMenu from "../ui/form/DropMenu.jsx";


// Each contact id will be associated with a productId;
/*

let theMap = {};
theMap["123abc"] = "productId123";
theMap[{Id: "thecontactId","Name": "thecontactName","MemberStatus": "R"}] = "productId123";  // theMap could also look like this.


*/



export default function ContactAndProductSelect({ contacts, eventId, data, setData }) {

    // Step 1: Prove that we can construct and use a JavaScript Map.

    // Step 2: Figuring out how to populate the Map with actual data from the previous step.
    let selectedContactIds = data.selectedContactIds || [];



    contacts = contacts.filter(contact => selectedContactIds.includes(contact.Id));

    // This Map would actually happen on the server, returning the recommended ticket for each contact.
    let theMap = new Map();

    let JUVENILE_LAW_TRAINING_ACADEMY_MEMBERS_ONLY_PRODUCT_ID = "01thr0000008Nyt";
    const JUVENILE_LAW_TRAINING_ACADEMY_EVENT_ID = "a23hr0000008sWHAAY";
    const theProducts = [
        {
            Id: JUVENILE_LAW_TRAINING_ACADEMY_MEMBERS_ONLY_PRODUCT_ID,
            Name: "Juvenile Law Training Academy - Member Ticket"
        },
        {
            Id: "01thr0000008Np4",
            Name: "Juvenile Law Training Academy - Non-Member Ticket"
        }
    ]

    selectedContactIds.forEach((contactId, index) => {

        const productId = data.productIds?.[index] || "";
        theMap.set(contactId, productId);
    });



    console.log(data);

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

            <h1 className="text-2xl font-bold mb-4"> {contacts.length} people selected.</h1>

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

                    {contacts.map((contact) => (
                        <TableRow key={contact.Id} id={contact.Id} name={contact.Name} status={contact.Ocdla_Member_Status__c} product={theMap.get(contact.Id)} products={theProducts} handleProductSelect={handleProductSelect} addToSelectedContactIds={addToSelectedContactIds} />
                    ))}
                </tbody>

            </table>
        </div>
    )
}




function TableRow({ id, name, status, product, products, handleProductSelect, addToSelectedContactIds }) {

    const [selectedProduct, setSelectedProduct] = useState(null);

    return (
        <tr className="border-b cursor-pointer hover:bg-gray-100">

            <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                <CheckBox label="" name="" value={id} defaultValue={false} onChange={addToSelectedContactIds} />
            </td>

            <td className="px-4 py-3">{name}</td>


            <td className="px-4 py-3">{status || "-"}</td>

            <td className="px-4 py-3">
                <DropMenu label={selectedProduct ? selectedProduct.Name : "Select Product"} entries={products} handler={(product) => {
                    setSelectedProduct(product);
                    handleProductSelect(id, product);
                    console.log("Selected product: ", id, product);
                }} />
            </td>


        </tr>
    )
}
