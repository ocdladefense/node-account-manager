import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { getContactQuery } from "./query.js";
import { Pi } from "lucide-react";
import PickList from "../ui/form/PickList.jsx";
import TextInput from "../ui/form/TextInput.jsx"
import CheckBox from "../ui/form/CheckBox.jsx";
import DateInput from "../ui/form/DateInput.jsx";
import DateTimeInput from "../ui/form/DateTimeInput.jsx";
import Button from "../ui/Button.jsx";
import Actions from "../ui/Actions.jsx";

export default function ContactExpertForm() {
    const { client, metadata } = useOutletContext();
    const navigate = useNavigate();
    const { contactId } = useParams();
    const [contact, setContact] = useState(null);

    let expertPrimary = metadata.fetchPicklistValues('Ocdla_Expert_Witness_Primary__c');
    let expertTravel = metadata.fetchPicklistValues('Ocdla_Expert_Travel_Availability__c');

    useEffect(() => {
        const soql = getContactQuery(contactId);
        const fetchContact = async () => {
            const resp = await client.query(soql);
            setContact(resp.records[0]);
        };
        fetchContact();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        let target = e.target;
        const checkboxes = {
            expertWitness: target.querySelector('#isExpertWitness'),
            legislativeAdvocacy: target.querySelector('#LegislativeAdvocacyOptIn')
        }
        const expertPrimary = [];
        const primarySelect = target.querySelector(
            '#Ocdla_Expert_Witness_Primary__c'
        );
        for (let element of primarySelect.selectedOptions)
        {
            expertPrimary.push(element.value);
        }
        let formData = new FormData(target);

        // get the actual values out of the formData object
        const contactRecord = Object.fromEntries(formData.entries());

        const nullDetect = value =>
            value === "" ? null : value;

        contactRecord.Ocdla_Expert_Witness_Last_Updated__c =
            nullDetect(contactRecord.Ocdla_Expert_Witness_Last_Updated__c);
        contactRecord.Ocdla_Expert_Unavailability_Start_Date__c =
            nullDetect(contactRecord.Ocdla_Expert_Unavailability_Start_Date__c);
        contactRecord.Ocdla_Expert_Unavailability_End_Date__c =
            nullDetect(contactRecord.Ocdla_Expert_Unavailability_End_Date__c);

        console.log("Expert Witness Update Date Sent:" + contactRecord.ExpertWitnessUpdateDateSent__c)
        console.log("Expert Witness Last Updated:" + contactRecord.Ocdla_Expert_Witness_Last_Updated__c)
        console.log("Expert Witness Unavaial statt:" + contactRecord.Ocdla_Expert_Unavailability_Start_Date__c)
        console.log("Expert Witness unabae end:" + contactRecord.Ocdla_Expert_Unavailability_End_Date__c)

        contactRecord.Include_in_Expert_Witness_Directory__c =
            formData.get("Include_in_Expert_Witness_Directory__c") === "on";
        contactRecord.ExpertWitnessUpdateEmailSent__c =
            formData.get("ExpertWitnessUpdateEmailSent__c") === "on";
        contactRecord.Id = contact.Id;
        contactRecord.Ocdla_Is_State_Expert__c =
            formData.get("Ocdla_Is_State_Expert__c") === "on";

        // Call Salesforce API to update the contact
        const response = await client.update('Contact', contactRecord);

        if (!response.ok)
        {
            const result = await response.json();

            return;
        }
        // Navigate back to contact detail page on success
        navigate(`/contact/${contactId}`);
    };

    // Return to previous page
    const handleCancel = () => {
        navigate(`/contact/${contactId}`);
    };

    const handleExpert = () => {
        navigate(``);
    };

    const normalActions = {
        "Save Changes": { value: null, buttonType: "submit" },
        "Cancel": { value: handleCancel, buttonType: "button" }
    }

    return (
        <div>
            {contact && (
                <div className="container mx-auto p-6 mt-20">
                    <form onSubmit={handleSubmit} className="max-w-2xl">
                        {contact?.Ocdla_Is_Expert_Witness__c && (
                            <div className="container mx-auto p-6 mt-20">
                                <h1 className="text-2xl font-bold mb-6">Expert Witness Form</h1>
                                <Actions foobar={normalActions} />
                                {/* Expert Witness Info */}
                                <fieldset className="border rounded p-4 mb-6">
                                    <legend className="text-lg font-semibold">Expert Witness Status</legend>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <CheckBox label="State Witness" name="Ocdla_Is_State_Expert__c" defaultValue={contact.Ocdla_Is_State_Expert__c} />
                                        <CheckBox label="Included in Expert Witness Directory" name="Include_in_Expert_Witness_Directory__c" defaultValue={contact.Include_in_Expert_Witness_Directory__c} />
                                        <CheckBox label="Update Email Sent" name="ExpertWitnessUpdateEmailSent__c" defaultValue={contact.ExpertWitnessUpdateEmailSent__c} />
                                    </div>
                                    <div>

                                    </div>
                                    <div>

                                    </div>
                                    <div>
                                        <DateInput label="Update Date Sent" name="ExpertWitnessUpdateDateSent__c" defaultValue={contact.ExpertWitnessUpdateDateSent__c} fieldType="datetime-local" />
                                    </div>
                                    <div>
                                        <DateInput label="Last Updated" name="Ocdla_Expert_Witness_Last_Updated__c" defaultValue={contact.Ocdla_Expert_Witness_Last_Updated__c} fieldType="date" />
                                    </div>
                                </fieldset>
                                <fieldset className="border rounded p-4 mb-6">
                                    <legend className="text-lg font-semibold">Expert Witness Info</legend>
                                    <div>
                                        <PickList defaultValue={contact.Ocdla_Expert_Witness_Primary__c} metadata={metadata.getField("Ocdla_Expert_Witness_Primary__c")} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <TextInput label="Other Areas" apiName="Ocdla_Expert_Witness_Other_Areas__c" currentValue={contact.Ocdla_Expert_Witness_Other_Areas__c} />
                                        <TextInput label="Minimum Hours" apiName="Ocdla_Expert_Minimum_Hours__c" currentValue={contact.Ocdla_Expert_Minimum_Hours__c} />
                                        <TextInput label="Hourly Rate" apiName="Ocdla_Expert_Hourly_Rate__c" currentValue={contact.Ocdla_Expert_Hourly_Rate__c} />
                                    </div>
                                    <div>
                                        <TextInput label="Comments" apiName="Ocdla_Expert_Comments__c" currentValue={contact.Ocdla_Expert_Comments__c} />
                                    </div>
                                </fieldset>
                                <fieldset className="border rounded p-4 mb-6">
                                    <legend className="text-lg font-semibold">Availability</legend>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <PickList defaultValue={contact.Ocdla_Expert_Travel_Availability__c} metadata={metadata.getField("Ocdla_Expert_Travel_Availability__c")} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <DateInput label="Unavailabilty Start Date" name="Ocdla_Expert_Unavailability_Start_Date__c" defaultValue={contact.Ocdla_Expert_Unavailability_Start_Date__c} fieldType="date" />
                                        <DateInput label="Unavailabilty End Date" name="Ocdla_Expert_Unavailability_End_Date__c" defaultValue={contact.Ocdla_Expert_Unavailability_End_Date__c} fieldType="date" />
                                    </div>
                                </fieldset>

                            </div>
                        )}
                        {/* Buttons */}
                        <div className="flex">
                            <Button label="Save Changes" buttonType="submit" />
                            <Button action={handleCancel} label="Cancel" />
                        </div>
                    </form >
                </div >
            )}
        </div >
    );
}

