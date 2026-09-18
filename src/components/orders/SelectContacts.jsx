
import { useState, useEffect } from "react";
import CheckBox from "../ui/form/CheckBox.jsx";
import DateDisplay from "../ui/DateDisplay.jsx";
import { useNavigate } from "react-router";

export default function SelectContacts() {

    const navigate = useNavigate();
    const [contacts, setContacts] = useState([]);
    const [contactIds, setContactIds] = useState([]);

    useEffect(() => {
        const fetchContacts = async () => {
            try
            {
                const resp = await fetch("/api/query/account-contacts");
                const data = await resp.json();

                if (!resp.ok)
                {
                    throw new Error(
                        data.error || "Unable to retrieve account contacts."
                    );
                }

                setContacts(data.records);

            } catch (error)
            {
                console.error(
                    "Error fetching account contacts:",
                    error
                );
            }
        };

        fetchContacts();
    }, []);


    const addToSelectedContactIds = (event) => {
        const { value, checked } = event.target;

        let fn = checked
            ? (prev) => [...prev, value]
            : (prev) => prev.filter((item) => item !== value);

        setContactIds(fn);
    };



    return (

        <div>
            <input name="contactIds" type="hidden" value={contactIds} readOnly />
            <h1 className="text-2xl font-bold mb-4">Members ({contacts.length})</h1>
            <table className="w-full border-collapse">

                <thead>

                    <tr className="border-b bg-gray-100">

                        <th className="px-4 py-3"></th>

                        <th className="px-4 py-3 text-left">Name</th>

                        <th className="px-4 py-3 text-left">Email</th>

                        <th className="px-4 py-3 text-left">Member Status</th>

                        <th className="px-4 py-3 text-left">Membership Expiration</th>

                    </tr>

                </thead>

                <tbody>

                    {contacts.map((contact) => (
                        <tr key={contact.Id} className="border-b cursor-pointer hover:bg-gray-100" onClick={() => navigate(`/contact/${contact.Id}`)}>

                            <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                <CheckBox label="" name="" value={contact.Id} defaultValue={false} onChange={addToSelectedContactIds} />
                            </td>

                            <td className="px-4 py-3">{contact.Name}</td>

                            <td className="px-4 py-3">
                                {contact.Email ? (
                                    <a href={`mailto:${contact.Email}`} className="text-blue-600 hover:underline" onClick={(e) => e.stopPropagation()}>
                                        {contact.Email}</a>
                                ) : (
                                    "-"
                                )}
                            </td>

                            <td className="px-4 py-3">{contact.Ocdla_Member_Status__c || "-"}</td>

                            <td className="px-4 py-3">{<DateDisplay value={contact.Ocdla_Membership_Expiration_Date__c} type="Date" textClassName="text-base" />}</td>

                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    )
}
