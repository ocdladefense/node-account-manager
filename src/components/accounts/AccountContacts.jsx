import { useState, useEffect } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { getAccountContactsQuery } from "./query.js";
import DateDisplay from "../ui/DateDisplay.jsx";


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

            <div className="container mx-auto px-2 mt-[28px]">

                <h1 className="text-2xl font-bold mb-4">Members ({contacts.length})</h1>

                <div className="overflow-x-auto">

                    <table className="w-full border-collapse">

                        <thead>

                            <tr className="border-b bg-gray-100">

                                <th className="px-4 py-3 text-left">Name</th>

                                <th className="px-4 py-3 text-left">Email</th>

                                <th className="px-4 py-3 text-left">Member Status</th>

                                <th className="px-4 py-3 text-left">Membership Expiration</th>

                            </tr>

                        </thead>

                        <tbody>

                            {contacts.map((contact) => (
                                <tr key={contact.Id} className="border-b cursor-pointer hover:bg-gray-100" onClick={() => handleSelectContact(contact.Id)}>

                                    <td className="px-4 py-3">{contact.Name}</td>

                                    <td className="px-4 py-3">{contact.Email || "-"}</td>

                                    <td className="px-4 py-3">{contact.Ocdla_Member_Status__c || "-"}</td>

                                    <td className="px-4 py-3">{<DateDisplay value={contact.Ocdla_Membership_Expiration_Date__c} type="Date" />}</td>

                                </tr>
                            ))}
                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}
