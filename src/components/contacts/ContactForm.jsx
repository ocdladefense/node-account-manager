import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { getContactQuery } from "./query.js";
import { Pi } from "lucide-react";
import PickList from "../ui/form/PickList.jsx";
import TextInput from "../ui/form/TextInput.jsx";
import CheckBox from "../ui/form/Checkbox.jsx";
import Button from "../ui/Button.jsx";
import Actions from "../ui/Actions.jsx";
import { FileUpload, uploadFileToServer } from "../ui/form/FileUpload.jsx";

export default function ContactForm() {
    const { client, metadata } = useOutletContext();
    const navigate = useNavigate();
    const { contactId } = useParams();
    const [contact, setContact] = useState(null);


    const US_COUNTRY_CODE_ID = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAA";

    let salutations = metadata.fetchPicklistValues('Salutation');
    let publicDefenseSurvey = metadata.fetchPicklistValues('Public_Defense_Survey__c');
    let occupations = metadata.fetchPicklistValues('Ocdla_Occupation_Field_Type__c');
    let countries = metadata.fetchPicklistValues("MailingCountryCode");
    let expertTravel = metadata.fetchPicklistValues('Ocdla_Expert_Travel_Availability__c');

    useEffect(() => {
        const soql = getContactQuery(contactId);
        const fetchContact = async () => {
            const resp = await client.query(soql);
            setContact(resp.records[0]);
        };
        fetchContact();
    }, []);

    async function saveFileData(id) {
        const input = document.getElementById(id);

        const files = input.files;
        for (let file of files) {
            const fileData = {
                Filename__c: file.name,
                FileSize__c: file.size,
                FileType__c: file.type,
                ContactId__c: contactId
            };
            console.log("Metadata to send: ", fileData);
            const response = await client.create("FileData__c", fileData);
            console.log(response);
            if (!response.ok) {
                let message = await response.json();
                console.log("An error occurred: ", message);
            }
        }




    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        //Need to figure this out
        // const result = await uploadFileToServer("picture", "1");


        const input = document.getElementById("picture");


        let target = e.target;
        const checkboxes = {
            expertWitness: target.querySelector('#isExpertWitness'),
            legislativeAdvocacy: target.querySelector('#LegislativeAdvocacyOptIn')
        }
        const publicDefenseSurveyValues = [];
        for (let element of target.querySelector('#Public_Defense_Survey__c').selectedOptions) {
            publicDefenseSurveyValues.push(element.value);
        }
        let formData = new FormData(target);

        formData.delete("picture");

        const contactRecord = Object.fromEntries(formData.entries());

        contactRecord.Public_Defense_Survey__c = publicDefenseSurveyValues.join(";");

        contactRecord.LegislativeAdvocacyOptIn__c =
            formData.get("LegislativeAdvocacyOptIn__c") === "on";
        contactRecord.Ocdla_Is_Expert_Witness__c =
            formData.get("Ocdla_Is_Expert_Witness__c") === "on";
        contactRecord.Ocdla_Is_State_Expert__c =
            formData.get("Ocdla_Is_State_Expert__c") === "on";

        contactRecord.Include_in_Expert_Witness_Directory__c =
            formData.get("Include_in_Expert_Witness_Directory__c") === "on";
        contactRecord.ExpertWitnessUpdateEmailSent__c =
            formData.get("ExpertWitnessUpdateEmailSent__c") === "on";
        contactRecord.Id = contact.Id;

        const response = await client.update('Contact', contactRecord);

        if (!response.ok) {
            const result = await response.json();

            return;
        }
        return;

        navigate(`/contact/${contactId}`);
    };

    const handleCancel = () => {
        navigate(`/contact/${contactId}`);
    };

    const normalActions = {
        "Save Changes": { value: null, buttonType: "submit" },
        "Cancel": { value: handleCancel, buttonType: "button" }
    }

    return (
        <div>
            {contact && (
                <div className="container mx-auto px-2">
                    <h1 className="text-2xl font-bold mb-6">Edit Contact</h1>
                    <FileUpload name="picture" label="Profile Picture" accepting="images/*" applicationId={1} preview={false} afterUpload={saveFileData} />
                    <form onSubmit={handleSubmit} className="max-w-2xl">
                        <Actions foobar={normalActions} />
                        { /* Name */}
                        <fieldset className="border rounded p-4 mb-6">
                            <legend className="text-lg font-semibold">Name</legend>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <TextInput label="First Name" apiName="FirstName" currentValue={contact.FirstName} />
                                <TextInput label="Middle Name" apiName="MiddleName" currentValue={contact.MiddleName} />
                                <TextInput label="Last Name" apiName="LastName" currentValue={contact.LastName} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TextInput label="Suffix" apiName="Suffix" currentValue={contact.Suffix} />
                                <div>
                                    <PickList defaultValue={contact.Salutation} metadata={metadata.getField("Salutation")} />
                                </div>
                            </div>
                        </fieldset>
                        {/* Opt Ins */}
                        <fieldset className="border rounded p-4 mb-6">
                            <legend className="text-lg font-semibold">Opt Ins</legend>
                            <div className="mb-4">
                                <CheckBox label="Legislative Opt In" name="LegislativeAdvocacyOptIn__c" defaultValue={contact.LegislativeAdvocacyOptIn__c} />
                                <CheckBox label="Is Expert Witness" name="Ocdla_Is_Expert_Witness__c" defaultValue={contact.Ocdla_Is_Expert_Witness__c} />
                            </div>
                        </fieldset>
                        {/* Bar Number and License Number */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <TextInput label="Bar Number" apiName="Ocdla_Bar_Number__c" currentValue={contact.Ocdla_Bar_Number__c} />
                            <TextInput label="Investigator License Number" apiName="Ocdla_Investigator_License_Number__c" currentValue={contact.Ocdla_Investigator_License_Number__c} />
                            <TextInput label="Organization" apiName="Ocdla_Organization__c" currentValue={contact.Ocdla_Organization__c} />
                        </div>
                        {/* Occupation */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <PickList defaultValue={contact.Public_Defense_Survey__c} metadata={metadata.getField("Public_Defense_Survey__c")} />
                        </div>
                        {/* Contact Info */}
                        <fieldset className="border rounded p-4 mb-6">
                            <legend className="text-lg font-semibold">Contact Info</legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TextInput label="Work Email" apiName="OrderApi__Work_Email__c" currentValue={contact.OrderApi__Work_Email__c} />
                                <TextInput label="Work Phone:" apiName="OrderApi__Work_Phone__c" currentValue={contact.OrderApi__Work_Phone__c} />
                                <TextInput label="Website" apiName="Ocdla_Website__c" currentValue={contact.Ocdla_Website__c} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <TextInput label="Phone" apiName="Phone" currentValue={contact.Phone} />
                                <TextInput label="Cell Phone" apiName="Ocdla_Cell_Phone__c" currentValue={contact.Ocdla_Cell_Phone__c} />
                                <TextInput label="Fax" apiName="Fax" currentValue={contact.Fax} />
                            </div>
                        </fieldset>
                        {/* Mailing Address */}
                        <fieldset className="border rounded p-4 mb-6">
                            <legend className="text-lg font-semibold">Mailing Address</legend>
                            <TextInput label="Street" apiName="MailingStreet" currentValue={contact.MailingAddress.street} />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <TextInput label="City" apiName="MailingCity" currentValue={contact.MailingAddress.city} />
                                <PickList defaultValue={contact.MailingAddress.stateCode} metadata={metadata.getField("MailingStateCode")} />
                                <TextInput label="Zipcode" apiName="MailingPostalCode" currentValue={contact.MailingAddress.postalCode} />
                                <PickList defaultValue={contact.MailingAddress.countryCode} metadata={metadata.getField("MailingCountryCode")} />
                            </div>
                        </fieldset>
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
