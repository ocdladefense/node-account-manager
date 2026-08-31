import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { getContactQuery } from "./query.js";
import Info from "../ui/Info.jsx";
import Phone from "../ui/Phone.jsx";
import Email from "../ui/Email.jsx";
import CheckboxStatus from "../ui/CheckboxStatus.jsx";
import Website from "../ui/Website.jsx";
import DateDisplay from "../ui/DateDisplay.jsx";
import Button from "../ui/Button.jsx";
import Actions from "../ui/Actions.jsx";
import Section from "../ui/Section.jsx";
import { getCookie } from "@ocdla/salesforce/CookieUtils.js";


export default function Contact() {
    const [currentStep, setCurrentStep] = useState(1);
    const { client } = useOutletContext();
    const navigate = useNavigate();

    let { contactId } = useParams();

    contactId = contactId || getCookie('contact_id');

    const [contact, setContact] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchContact() {
            const contactQuery = getContactQuery(contactId);


            try
            {
                setLoading(true);
                const response = await client.query(contactQuery);
                setContact(response.records[0]);
            } catch (err)
            {
                setError(err);
                console.error("Error fetching contact:", err);
            } finally
            {
                setLoading(false);
            }
        }

        fetchContact();
    }, []); // dependency array for the useEffect hook, controls when the effects runs (every change to contactId or client)

    // navigate() is a React Router hook that changes the URL
    // First argument /contacts/${contactId}/edit - The URL path to navigate to
    // Second argument { state: { contact } } - This passes data along with the navigation
    const handleEdit = () => {
        navigate(`/profile/${contactId}/edit`, { state: { contact } });
    };
    const handleEditExpert = () => {
        navigate(`/profile/${contactId}/expert`, { state: { contact } });
    };



    const normalActions = {
        "edit": { action: handleEdit, buttonType: "button", label: "Edit Contact" }
    };
    const conditionalActions = {
        "edit-expert": { action: handleEditExpert, buttonType: "button", label: "Edit Expert Witness" }
    };



    return (
        <div className="container mx-auto px-2 mt-[28px]">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Contact Details</h1>
            </div>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">Error loading contacts</p>}

            {contact && (
                <div className="">
                    <Actions buttons={normalActions} />
                    {contact?.Ocdla_Is_Expert_Witness__c && (
                        <Actions buttons={conditionalActions} />
                    )}



                    {/* Contact Name  & Saluitation*/}
                    <div>
                        <h2 className="text-3xl font-bold mb-4">{contact.Salutation || ''} {contact.Name}</h2>
                    </div>



                    {/* Contact Information: Phone, Fax, Email */}
                    <Section cols={2}>
                        <Email label="Email:" value={contact.Email} privacy={false} />
                        <Phone label="Phone:" value={contact.Phone} privacy={false} />
                        <Phone label="Fax:" value={contact.Fax} privacy={false} />
                    </Section>



                    {/* Bar Number and License */}
                    <Section cols={2}>
                        <Info label="Bar Number:" value={contact.Ocdla_Bar_Number__c} />
                        <Info label="Investigator License Number:" value={contact.Ocdla_Investigator_License_Number__c} />
                    </Section>



                    {/* Organization */}
                    <Section cols={3}>
                        <Info label="Organization:" value={contact.Ocdla_Organization__c} />
                        <Phone label="Work Phone:" value={contact.Phone} privacy={false} />
                        <Email label="Work Email:" value={contact.Email} privacy={false} />
                    </Section>



                    {/* OCDLA Phone / Website */}
                    <Section cols={2}>
                        <Phone label="OCDLA Phone:" value={contact.Ocdla_Cell_Phone__c} privacy={true} />
                        <Website label="OCDLA Website:" value={contact.Ocdla_Website__c} />
                    </Section>



                    {/* Mailing Address */}
                    <fieldset className="section section-grid-4">
                        <legend className="text-lg font-semibold">Mailing Address</legend>
                        <Section cols={4}>
                            <Info label="Street:" value={contact.MailingAddress?.street} />
                            <Info label="City:" value={contact.MailingAddress?.city} />
                            <Info label="State:" value={contact.MailingAddress?.state} />
                            <Info label="Zip:" value={contact.MailingAddress?.postalCode} />
                        </Section>
                    </fieldset>



                    {/* Legislative Advocacy Opt In*/}
                    <Section cols={2}>
                        <CheckboxStatus label="Legislative Advocacy Opt in:" value={contact.LegislativeAdvocacyOptIn__c} />
                        <CheckboxStatus label="Expert Witness Status:" value={contact.Ocdla_Is_Expert_Witness__c} />
                    </Section>



                    {/* Membership: Status & Expiration*/}
                    <Section cols={2}>
                        <Info label="Membership Status:" value={contact.Ocdla_Member_Status__c} />
                        <DateDisplay label="Membership Expiration:" value={contact.Ocdla_Membership_Expiration_Date__c} type="Date" />
                    </Section>



                    {contact?.Ocdla_Is_Expert_Witness__c && (

                        <div className="border border-black/25 mb-4 p-4 rounded bg-blue-50 section">
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
                                {/*Timezones are acting werid with this*/}
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
                            <Button action={handleEditExpert} label="Edit Expert Witness" />
                        </div>
                    )}

                    {/* Edit Button */}
                    <Button action={handleEdit} label="Edit Contact" />
                </div>
            )}
        </div>
    );
}
