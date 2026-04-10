import { useState, useEffect } from 'react';
import { useOutletContext } from "react-router-dom";



export default function HomePage() {

    let { client } = useOutletContext();
    let [contacts, setContacts] = useState([]);
    let [accounts, setAccounts] = useState([]);


    useEffect(function() {

        async function fetchContacts() {

            try {
                const response = await client.query("SELECT Name, Id, Ocdla_Member_Status__c FROM Contact LIMIT 10");

                console.log(response.records);

                setContacts(response.records);
            } catch (error) {
                console.error("Error fetching contacts:", error);
            }
        }

        fetchContacts();

        async function fetchAccounts() {
            try {
                const response = await client.query("SELECT Id, AccountId, Name FROM Contact WHERE AccountId='001j000000oPG6eAAG'");

                console.log(response.records);

                setAccounts(response.records);
            } catch (error) {
                console.error("Error fetching contacts:", error);
            }
        }

        fetchAccounts();

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

            <p className="my-6 text-lg font-semibold text-gray-700">Our Law Student  Member List</p>
            <ul className="space-y-2">
                {accounts
                    .map(contact => (
                        <li key={accounts.AccountId} className="text-lg p-2 border-b border-gray-300"><p>account ID: {accounts.AccountId}</p>
                            <div><strong>{account.Name}</strong></div>
                        </li>
                    ))}
            </ul>

        </div>
    );

}
