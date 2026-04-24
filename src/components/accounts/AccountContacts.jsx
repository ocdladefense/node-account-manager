import { useState, useEffect } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { getAccountContactsQuery } from "./query.js";


export default function AccountContacts() {

    let { client } = useOutletContext();

    const navigate = useNavigate();

    let { accountId } = useParams();


    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const soql = getAccountContactsQuery(accountId);
        console.log("Account Contacts query: ", soql);
        const fetchAccountContacts = async () => {
            try {
                setLoading(true);
                const resp = await client.query(soql);
                setContacts(resp.records);
            } catch (e) {
                setError(e);
                console.log("Error loading contact: ", e);
            } finally {
                setLoading(false);
            }
        };
        fetchAccountContacts();
    }, []);

    const handleSelectContact = (contactId) => {
        navigate(`/contact/${contactId}`);
    };

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
