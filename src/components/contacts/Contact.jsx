import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { getContactQuery } from "./query.js"

export default function Contact() {
    const { client } = useOutletContext();
    const navigate = useNavigate();

    const { contactId } = useParams();

    const [contact, setContact] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchContact() {
            const contactQuery = getContactQuery(contactId);
            console.log(contactQuery);

            try {
                setLoading(true);
                const response = await client.query(contactQuery);
                setContact(response.records[0]);
            } catch (err) {
                setError(err);
                console.error("Error fetching contact:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchContact();
    }, []); // dependency array for the useEffect hook, controls when the effects runs (every change to contactId or client)

    // navigate() is a React Router hook that changes the URL
    // First argument /contacts/${contactId}/edit - The URL path to navigate to
    // Second argument { state: { contact } } - This passes data along with the navigation
    const handleEdit = () => {
        navigate(`/contact/${contactId}/edit`, { state: { contact } });
    };

    const handleBack = () => {
        navigate(`/account/${contact.AccountId}`);
    };

    return (
        <div className="container mx-auto p-6 mt-20">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Contact Details</h1>
                <button
                    onClick={handleBack}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                    Back
                </button>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">Error loading contacts</p>}

            {contact && (
                <div className="border rounded p-6">
                    {/* Contact Name */}
                    <div className="grid-col-1">
                        <h2 className="text-3xl font-bold mb-6">{contact.Name}</h2>
                    </div>

                    {/* Salutation */}
                    <div className="grid-col-1">
                        <h2 className="text-3xl font-bold mb-6">Salutation: {contact.Salutation || 'None'}</h2>
                    </div>

                    {/* Bar Number and License */}
                    <div className="grid grid-cols-2 mb-6 p-4 gap-1 rounded bg-blue-50">
                        <p className="text-xl">Bar Number: {contact.Ocdla_Bar_Number__c}</p>
                        <p className="text-xl">Investigator License Number: {contact.Ocdla_Investigator_License_Number__c}</p>
                    </div>

                    {/* Organization */}
                    <div className="grid grid-cols-2 mb-6 p-4 gap-1 rounded bg-blue-50">
                        <p className="text-xl">Organization: {contact.Ocdla_Organization__c}</p>
                    </div>

                    {/* Work Phone / Email */}
                    <div className="grid grid-cols-2 mb-6 p-4 gap-1 rounded bg-blue-50">
                        <p className="text-xl">Work Phone: {contact.OrderApi__Work_Phone__c}</p>
                        <p className="text-xl">Work Email: {contact.OrderApi__Work_Email__c}</p>
                    </div>

                    {/* Phone Number / Fax */}
                    <div className="grid grid-cols-2 mb-6 p-4 gap-1 rounded bg-blue-50">
                        <p className="text-xl">Phone: {contact.Phone}</p>
                        <p className="text-xl">Fax: {contact.Fax}</p>
                    </div>

                    {/* OCDLA Phone / Website */}
                    <div className="grid grid-cols-2 mb-6 p-4 gap-1 rounded bg-blue-50">
                        <p className="text-xl">OCDLA Phone: {contact.Ocdla_Cell_Phone__c}</p>
                        <p className="text-xl">OCDLA Website: {contact.Ocdla_Website__c}</p>
                    </div>

                    {/* Legislative Advocacy Opt In*/}
                    <div className="grid grid-cols-2 mb-6 p-4 gap-1 rounded bg-blue-50">
                        <p className="text-xl">Legislative Advocacy Opt in:</p>
                        <input
                            type="checkbox"
                            checked={contact.LegislativeAdvocacyOptIn__c}
                            disabled
                        />
                    </div>

                    {/* Expert Witness Status */}
                    <div className="grid grid-cols-2 mb-6 p-4 gap-1 rounded bg-blue-50">
                        <p className="text-xl">Expert Witness Status:</p>
                        <input
                            type="checkbox"
                            checked={contact.Ocdla_Is_Expert_Witness__c}
                            disabled
                        />
                    </div>

                    {contact?.Ocdla_Is_Expert_Witness__c && (
                        <div>
                            {/* Expert Witness Info */}
                            <div className="grid grid-cols-1 mb-6 p-4 rounded bg-blue-50">
                                <p className="text-xl mb-3">Expert Witness Info:</p>
                                <p>Is State Expert:</p>
                                <input
                                    type="checkbox"
                                    checked={contact.Ocdla_Is_State_Expert__c}
                                    disabled
                                />
                                <p>Is in Witness Directory:</p>
                                <input
                                    type="checkbox"
                                    checked={contact.Include_in_Expert_Witness_Directory__c}
                                    disabled
                                />
                                <p>Witness Update Email Sent</p>
                                <input
                                    type="checkbox"
                                    checked={contact.ExpertWitnessUpdateEmailSent__c}
                                    disabled
                                />
                                <p>Expert Witness Update Date Sent: {contact.ExpertWitnessUpdateDateSent__c}</p>
                                <p>Other Expert Witness Areas:{contact.Ocdla_Expert_Witness_Other_Areas__c}</p>
                                <p>Last Updated: {contact.Ocdla_Expert_Witness_Last_Updated__c}</p>
                                <p>Unavailibilty Start Date: {contact.Ocdla_Expert_Unavailability_Start_Date__c}</p>
                                <p>Unavailibilty End Date: {contact.Ocdla_Expert_Unavailability_End_Date__c}</p>
                                <p>Travel Availability: {contact.Ocdla_Expert_Travel_Availability__c}</p>
                                <p>Minimum Hours: {contact.Ocdla_Expert_Minimum_Hours__c}</p>
                                <p>Hourly Rate: {contact.Ocdla_Expert_Hourly_Rate__c}</p>
                                <p>Hourly Rate: {contact.Ocdla_Expert_Comments__c}</p>
                            </div>
                        </div>
                    )
                    }




                    {/* Mailing Address */}
                    <div className="grid grid-cols-1 mb-6 p-4 rounded bg-blue-50">
                        <p className="text-xl mb-3">Mailing Address:</p>
                        <ul className="list-none grid grid-cols-[auto_1fr] gap-2">
                            <li className="font-semibold">Street:</li>
                            <li>{contact.MailingAddress?.street}</li>
                            <li className="font-semibold">City:</li>
                            <li>{contact.MailingAddress?.city}</li>
                            <li className="font-semibold">State:</li>
                            <li>{contact.MailingAddress?.state}</li>
                            <li className="font-semibold">Zip:</li>
                            <li>{contact.MailingAddress?.postalCode}</li>
                        </ul>
                    </div>

                    {/* Organization */}
                    <div className="grid grid-cols-1 mb-6 p-4 rounded bg-blue-50">
                        <p className="text-xl mb-3">Organization: {contact.Ocdla_Organization__c}</p>
                    </div>

                    {/* Edit Button */}
                    <button
                        onClick={handleEdit}
                        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                        Edit Contact
                    </button>
                </div>
            )}
        </div>
    );
}
