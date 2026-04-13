import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router";


export default function Contacts() {

    let { client } = useOutletContext();

    const navigate = useNavigate();

    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchContacts() {
            try {
                setLoading(true);
                // Fetch all contacts from server (limiting to 30 for now)
                const response = await client.query("SELECT Id, Name FROM Contact LIMIT 30");
                setContacts(response.records);
            } catch (error) {
                setError(error);
                console.error("Error fetching contacts:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchContacts();
    }, []);

    const handleSelectContact = (contactId) => {
        navigate(`/contacts/${contactId}`);
    };

    return (
        <div className="container mx-auto p-6 mt-20">
            <h1 className="text-2xl font-bold mb-4">All Contacts</h1>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">Error loading contacts</p>}

            {contacts.length > 0 ? (
                <div className="space-y-2">
                    {contacts.map((contact) => (
                        <div key={contact.Id} className="p-4 border rounded cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSelectContact(contact.Id)}>
                            <p>{contact.Name}</p>
                        </div>
                    ))}
                </div>
            ) : (
                !loading && <p>No contacts found</p>
            )}
        </div>
    );
}
