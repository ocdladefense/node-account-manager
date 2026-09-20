
import { useState, useEffect } from "react";
import CheckBox from "../ui/form/CheckBox.jsx";


// Each contact id will be associated with a productId;
/*

let theMap = {};
theMap["123abc"] = "productId123";
theMap[{Id: "thecontactId","Name": "thecontactName","MemberStatus": "R"}] = "productId123";  // theMap could also look like this.


*/



export default function ContactAndProductSelect({ contacts, eventId, data }) {

    // Step 1: Prove that we can construct and use a JavaScript Map.

    // Step 2: Figuring out how to populate the Map with actual data from the previous step.
    let selectedContactIds = data.selectedContactIds || [];



    contacts = contacts.filter(contact => selectedContactIds.includes(contact.Id));

    // This Map would actually happen on the server, returning the recommended ticket for each contact.
    let theMap = new Map();
    contacts.forEach(contact => {
        theMap.set(contact.Id, "productId123");
    });



    console.log(data);

    const addToSelectedContactIds = (event) => {
        const { value, checked } = event.target;

        let fn = checked
            ? (prev) => [...prev, value]
            : (prev) => prev.filter((item) => item !== value);

        setData(prev => ({ ...prev, selectedContactIds: fn(prev) }));
    };



    return (

        <div>

            <h1 className="text-2xl font-bold mb-4"> {contacts.length} people selected.</h1>
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
                        <TableRow key={contact.Id} id={contact.Id} name={contact.Name} status={contact.Ocdla_Member_Status__c} product={theMap.get(contact.Id)} addToSelectedContactIds={addToSelectedContactIds} />
                    ))}
                </tbody>

            </table>
        </div>
    )
}




function TableRow({ id, name, status, product, addToSelectedContactIds }) {

    return (
        <tr className="border-b cursor-pointer hover:bg-gray-100">

            <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                <CheckBox label="" name="" value={id} defaultValue={false} onChange={addToSelectedContactIds} />
            </td>

            <td className="px-4 py-3">{name}</td>


            <td className="px-4 py-3">{status || "-"}</td>

            <td className="px-4 py-3">{product || "-"}</td>


        </tr>
    )
}
