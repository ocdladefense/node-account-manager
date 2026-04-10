import { useState, useEffect } from 'react';
import { useOutletContext } from "react-router-dom";



export default function HomePage() {

    let { client } = useOutletContext();
    let [contacts, setContacts] = useState([]);

    useEffect(function() {

        async function fetchContacts() {

            try {
                const response = await client.query("SELECT Id, Name FROM Contact LIMIT 10");

                console.log(response.records);

                /*
                    Ask team about this tomorrow. Where is response.records coming from?
                    
                    I researched the following info:
                        The .records property is part of Salesforce's standard REST API response structure. When you query Salesforce, it returns a JSON object with this shape:
                    {
                        "records": [  array of Contact objects  ],
                        "totalSize": 10,
                        "done": true
                        // ... other properties
                    }
                    dev_modules/@ocdla/salesforce/SalesforceRestApi.js?
                */
                setContacts(response.records);
            } catch (error) {
                console.error("Error fetching contacts:", error);
            }
        }

        fetchContacts();

    }, []); // Run once on component mount  padding-left: env(safe-area-inset-left);



    return (
        <div className="container mx-auto p-6 mt-20">
            <h1 className="text-3xl font-bold mb-4">Home Page</h1>
            <ul className="space-y-2">
                {contacts.map(contact => (
                    <li key={contact.Id} className="text-lg p-2 border-b border-gray-300">
                        {contact.Name}
                    </li>
                ))}
            </ul>
        </div>
    );

}
