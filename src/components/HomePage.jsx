import { useState, useEffect } from 'react';
import { useOutletContext } from "react-router-dom";



export default function HomePage() {

    let { client } = useOutletContext();
    let [contacts, setContacts] = useState([]);

    useEffect(function() {

        async function fetchContacts() {

            try {
                const response = await client.query("SELECT name, id, Ocdla_Member_Status__c FROM Contact LIMIT 10");

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
                    


                    Ask about:
                        Noticed a response about __c required for custom objects? What are custom objects?
                            SELECT Name, AccountNumber, DonorNotes__c, OrderApi__Account_Email__c FROM Account

                    dev_modules/@ocdla/salesforce/SalesforceRestApi.js
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
            <p className="my-6 text-lg font-semibold text-gray-700">Our Law Student Member List</p>
            <ul className="space-y-2">
                {contacts
                    .filter(contact => contact.Ocdla_Member_Status__c === "A")
                    .map(contact => (
                        <li key={contact.Id} className="text-lg p-2 border-b border-gray-300">
                            <div><strong>{contact.Name}</strong></div>
                            <div className="text-sm text-gray-600">Status: {contact.Ocdla_Member_Status__c}</div>
                        </li>
                    ))}
            </ul>
            <p className="my-6 text-lg font-semibold text-gray-700">Other Members</p>
            <ul className="space-y-2">
                {contacts
                    .filter(contact => contact.Ocdla_Member_Status__c !== "A")
                    .map(contact => (
                        <li key={contact.Id} className="text-lg p-2 border-b border-gray-300">
                            <div><strong>{contact.Name}</strong></div>
                            <div className="text-sm text-gray-600">Status: {contact.Ocdla_Member_Status__c}</div>
                        </li>
                    ))}
            </ul>
        </div>
    );

}
