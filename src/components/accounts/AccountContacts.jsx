import { useState, useEffect } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { getAccountContactsQuery } from "./query.js";


export default function AccountContacts() {

    let { client } = useOutletContext();

    const navigate = useNavigate();

    let { accountId } = useParams();

    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        const soql = getAccountContactsQuery(accountId);
        const fetchAccountContacts = async () => {
            const resp = await client.query(soql);
            setContacts(resp.records);
        };
        fetchAccountContacts();
    }, []);

    const handleSelectContact = (contactId) => {
        navigate(`/contact/${contactId}`);
    };

    return (
        <div className="w-full">
            {contacts &&
                <div className="container mx-auto px-2 mt-[28px]">
                    <h1 className="text-2xl font-bold mb-4">All Contacts</h1>

                    <div className="space-y-2">
                        {contacts.map((contact) => (
                            <div key={contact.Id} className="p-4 border rounded cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSelectContact(contact.Id)}>
                                <h1>{contact.Name}</h1>
                                <p>Email: {contact.Email}</p>
                                <p>Member Status: {contact.Ocdla_Member_Status__c}</p>
                                <p>Membership Expires On: {contact.Ocdla_Membership_Expiration_Date__c}</p>
                            </div>
                        ))}
                    </div>
                </div>


            }

        </div>
    );
}
