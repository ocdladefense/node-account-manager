import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { getAccountContactsQuery } from "./query.js";


export default function AccountContacts() {

    let { client } = useOutletContext();

    const navigate = useNavigate();

    let params = useParams();


    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        const soql = getAccountContactsQuery(accountId);
        const fetchAccountContacts = async () => {
            const resp = await client.query(soql);
            setContact(resp.records[0]);
        };
        getAccountContactsQuery();
    }, []);

    const handleSelectContact = (contactId) => {
        navigate(`/contact/${contactId}`);
    };
    if (!contacts) {
        return <div className="container mx-auto p-6 mt-20">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-6 mt-20">
            <h1 className="text-2xl font-bold mb-4">All Contacts</h1>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">Error loading contacts</p>}

            <div className="space-y-2">
                {contacts.map((contact) => (
                    <div key={contact.Id} className="p-4 border rounded cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSelectContact(contact.Id)}>
                        <p>{contact.Name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
