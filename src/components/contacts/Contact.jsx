import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { getContactQuery } from "./query.js"
import Info from "../ui/Info.jsx";
import Phone from "../ui/Phone.jsx";
import Email from "../ui/Email.jsx";
import CheckboxStatus from "../ui/CheckboxStatus.jsx";
import Website from "../ui/Website.jsx";
import DateDisplay from "../ui/DateDisplay.jsx";
import Steps from "../ui/Steps.jsx";


export default function Contact() {
    const [currentStep, setCurrentStep] = useState(1);
    const { client } = useOutletContext();
    const navigate = useNavigate();

    const { contactId } = useParams();

    const [contact, setContact] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchContact() {
            const contactQuery = getContactQuery(contactId);


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
    const handleEditExpert = () => {
        navigate(`/contact/${contactId}/expert`, { state: { contact } });
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
                        <h2 className="text-3xl font-bold mb-4">{contact.Name}</h2>
                    </div>

                    {/* Salutation */}
                    <div className="grid-col-1">
                        <h2 className="text-3xl font-bold mb-4">Salutation: {contact.Salutation || 'None'}</h2>
                    </div>

                    {/* Bar Number and License */}
                    <div className="border border-black/25 grid grid-cols-2 mb-4 p-4 gap-1 rounded bg-blue-50">
                        <Info label="Bar Number:" value={contact.Ocdla_Bar_Number__c} />
                        <Info label="Investigator License Number:" value={contact.Ocdla_Investigator_License_Number__c} />
                    </div>

                    {/* Organization */}
                    <div className="border border-black/25 grid grid-cols-3 mb-4 p-4 gap-1 rounded bg-blue-50">
                        <Info label="Organization:" value={contact.Ocdla_Organization__c} />
                        <Phone label="Work Phone:" value={contact.OrderApi__Work_Phone__c} privacy={false} />
                        <Email label="Work Email:" value={contact.OrderApi__Work_Email__c} privacy={true} />
                    </div>

                    {/* Phone Number / Fax */}
                    <div className="border border-black/25 grid grid-cols-2 mb-4 p-4 gap-1 rounded bg-blue-50">
                        <Phone label="Phone:" value={contact.Phone} privacy={false} />
                        <Phone label="Fax:" value={contact.Fax} privacy={false} />
                    </div>

                    {/* OCDLA Phone / Website */}
                    <div className="border border-black/25 grid grid-cols-2 mb-4 p-4 gap-1 rounded bg-blue-50">
                        <Phone label="OCDLA Phone:" value={contact.Ocdla_Cell_Phone__c} privacy={true} />
                        <Website label="OCDLA Website:" value={contact.Ocdla_Website__c} />
                    </div>

                    {/* Mailing Address */}
                    <fieldset className="border border-black/25 rounded p-4 pt-0 mb-4 bg-blue-50">
                        <legend className="text-lg font-semibold">Mailing Address</legend>
                        <div className="grid grid-cols-4 rounded bg-blue-50">
                            <Info label="Street:" value={contact.MailingAddress?.street} />
                            <Info label="City:" value={contact.MailingAddress?.city} />
                            <Info label="State:" value={contact.MailingAddress?.state} />
                            <Info label="Zip:" value={contact.MailingAddress?.postalCode} />
                        </div>
                    </fieldset>

                    {/* Legislative Advocacy Opt In*/}
                    <div className="border border-black/25 grid grid-cols-2 mb-4 p-4 gap-1 rounded bg-blue-50">
                        <CheckboxStatus label="Legislative Advocacy Opt in:" value={contact.LegislativeAdvocacyOptIn__c} />
                        <CheckboxStatus label="Expert Witness Status:" value={contact.Ocdla_Is_Expert_Witness__c} />
                    </div>

                    {contact?.Ocdla_Is_Expert_Witness__c && (

                        <div className="border border-black/25 mb-4 p-4 rounded bg-blue-50">
                            <fieldset className=" rounded p-4 mb-4 bg-blue-50">

                                <legend className="text-xl font-semibold">Expert Witness Info</legend>

                                <div className="border border-black/25 p-4 rounded grid grid-cols-3 gap-4 mb-2">
                                    <CheckboxStatus label="State Expert:" value={contact.Ocdla_Is_State_Expert__c} />
                                    <CheckboxStatus label="In Witness Directory:" value={contact.Include_in_Expert_Witness_Directory__c} />
                                    <CheckboxStatus label="Update Email Sent:" value={contact.ExpertWitnessUpdateEmailSent__c} />
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm"></div>

                                <div className="border border-black/25 p-4 rounded grid grid-cols-2 gap-4 mb-2 text-sm">
                                    <Info label="Primary Area:" value={contact.Ocdla_Expert_Witness_Primary__c} />
                                    <Info label="Other Area:" value={contact.Ocdla_Expert_Witness_Other_Areas__c} />
                                </div>
                                <div className="border border-black/25 p-4 rounded grid grid-cols-2 gap-4 mb-2 text-sm">
                                    <DateDisplay label="Update Date:" value={contact.ExpertWitnessUpdateDateSent__c} type="DateTime" />
                                    <DateDisplay label="Last Updated:" value={contact.Ocdla_Expert_Witness_Last_Updated__c} type="Date" />
                                </div>
                                <div className="border border-black/25 p-4 rounded grid grid-cols-3 gap-4 mb-2 text-sm">
                                    <Info label="Travel Availability:" value={contact.Ocdla_Expert_Travel_Availability__c} />
                                    <DateDisplay label="Unavailable Start:" value={contact.Ocdla_Expert_Unavailability_Start_Date__c} type="Date" />
                                    <DateDisplay label="Unavailable End:" value={contact.Ocdla_Expert_Unavailability_End_Date__c} type="Date" />
                                </div>
                                <div className="border border-black/25 p-4 rounded grid grid-cols-2 gap-4 mb-2 text-sm">
                                    <Info label="Minimum Hours:" value={contact.Ocdla_Expert_Minimum_Hours__c} />
                                    <Info label="Hourly Rate:" value={contact.Ocdla_Expert_Hourly_Rate__c} />
                                </div>
                                <div className="border border-black/25 p-4 rounded grid grid-cols-2 gap-4 mb-2 text-sm">
                                    <Info label="Comments:" value={contact.Ocdla_Expert_Comments__c} />
                                </div>
                            </fieldset>

                            {/* Button */}
                            <div className="mt-6">
                                <button
                                    onClick={handleEditExpert}
                                    className="border px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                >
                                    Edit Expert Witness
                                </button>
                            </div>
                        </div>
                    )}

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
