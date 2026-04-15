import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useOutletContext } from "react-router-dom";

export default function AccountId() {

    let { client } = useOutletContext();
    const navigate = useNavigate();

    let params = useParams();

    const [contacts, setContacts] = useState(null);

    useEffect(() => {
        async function fetchContacts() {
            try {
                const response = await client.query(`SELECT Id, AccountId, Name FROM Contact WHERE AccountId = '${params.accountId}'`);

                console.log(response.records);

                setContacts(response.records)
            }
            catch(error) {
                console.error("Error fetching accounts:", error);
            }

        }
        fetchContacts();
    }, []);

    return (
        <div className="container mx-auto p-6 mt-20">
            <h1 className="text-2xl font-bold mb-4">Contacts for Account</h1>
            
            <div className="space-y-2">
                {contacts && contacts.map((contact) => (
                    <div key={contact.Id} className="p-4 border rounded cursor-pointer hover:bg-gray-100"
                        onClick={() => navigate(`/contacts/${contact.Id}`)}>
                        <p>{contact.Name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}