import { useState, useEffect } from 'react';
import { useOutletContext } from "react-router-dom";



export default function HomePage() {

    let { client } = useOutletContext();
    let [contacts, setContacts] = useState([]);

    useEffect(function() {

        async function fetchContacts() {

            try
            {
                const response = await client.query("SELECT Id, Name FROM Contact LIMIT 10");
                setContacts(response.records);
            } catch (error)
            {
                console.error("Error fetching contacts:", error);
            }
        }

        fetchContacts();

    }, []); // Run once on component mount  padding-left: env(safe-area-inset-left);



    return (
        <div>
            <h1>Home Page</h1>
            <ul>
                {contacts.map(contact => (
                    <li key={contact.Id}>{contact.Name}</li>
                ))}
            </ul>
        </div>
    );

}
