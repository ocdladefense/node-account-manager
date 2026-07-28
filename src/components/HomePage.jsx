import { useState, useEffect } from 'react';
import { useOutletContext } from "react-router-dom";
import { getAccountContactsQuery } from './accounts/query';

export default function HomePage() {

    let { client } = useOutletContext();
    let [contacts, setContacts] = useState([]);


    useEffect(function() {

        async function fetchContacts() {

            try {
                const response = await client.query(getAccountContactsQuery(process.env.SF_ACCOUNT_ID));

                setContacts(response.records);
            } catch (error) {
                console.error("Error fetching contacts:", error);
            }
        }

        fetchContacts();

    }, []); // Run once on component mount  padding-left: env(safe-area-inset-left);



    return (
        <div className="container mx-auto px-2 mt-[28px]">
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
            <p className="my-6 text-lg font-semibold text-gray-700">Other  Members</p>
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
