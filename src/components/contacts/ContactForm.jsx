import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { getContactQuery } from "./query.js";
import PickList from "../ui/PickList.jsx";
import TextInput from "../ui/TextInput.jsx"
import { Pi } from "lucide-react";

export default function ContactForm() {


    const { client, metadata } = useOutletContext();
    const navigate = useNavigate();
    const { contactId } = useParams();
    const [contact, setContact] = useState(null);

    let salutations = metadata.fetchPicklistValues('Salutation');
    let publicDefenseSurvey = metadata.fetchPicklistValues('Public_Defense_Survey__c');
    let states = metadata.fetchPicklistValues('MailingStateCode').filter(s => s.validFor === "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAA");
    let occupations = metadata.fetchPicklistValues('Ocdla_Occupation_Field_Type__c');
    let countries = metadata.fetchPicklistValues("MailingCountryCode");
    console.log("States: ", states);
    console.log("Countries: ", countries.find(v => v.value == "US"));
    if (contact) {
        console.log("Rachel's Country: ", contact.MailingAddress.countryCode);
    }
    console.log("Salutations ", salutations);

    // Note the is from Jordans branch - Accpeted both
    let expertTravel = metadata.fetchPicklistValues('Ocdla_Expert_Travel_Availability__c');

    useEffect(() => {
        const soql = getContactQuery(contactId);
        const fetchContact = async () => {
            const resp = await client.query(soql);
            setContact(resp.records[0]);
        };
        fetchContact();
    }, []);


    // TODO: Does this need 
    const handleSubmit = async (e) => {
        e.preventDefault();
        let target = e.target;
        const checkboxes = {
            expertWitness: target.querySelector('#isExpertWitness'),
            legislativeAdvocacy: target.querySelector('#LegislativeAdvocacyOptIn')
        }
        const publicDefenseSurveyValues = [];
        for (let element of target.querySelector('#PublicDefenseSurvey').selectedOptions) {
            publicDefenseSurveyValues.push(element.value);
        }
        let formData = new FormData(target);
        // get the actual values out of the formData object
        const contactRecord = Object.fromEntries(formData.entries());
        // Merge conflict - This is Rosa's code
        // contactRecord.Ocdla_Is_Expert_Witness__c = checkboxes.expertWitness.checked;
        // contactRecord.LegislativeAdvocacyOptIn__c = checkboxes.legislativeAdvocacy.checked;
        contactRecord.Public_Defense_Survey__c = publicDefenseSurveyValues.join(";");
        // End Rosas code


        // Merge conflict - This is Jordans Code
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

        // End Jordans code
        console.log("Object to update: ", contactRecord);
        // Call Salesforce API to update the contact
        const response = await client.update('Contact', contactRecord);

        if (!response.ok) {
            const result = await response.json();
            console.log(result);
            return;
        }
        return;
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

    console.log("State object: ", contact);
    return (
        <div>
            {contact && (
                <div className="container mx-auto p-6 mt-20">
                    <h1 className="text-2xl font-bold mb-6">Edit Contact</h1>

                    <form onSubmit={handleSubmit} className="max-w-2xl">
                        {contact?.Ocdla_Is_Expert_Witness__c && (
                            <div>
                                {/* Expert Witness Info */}
                                <fieldset className="border rounded p-4 mb-6">
                                    <legend className="text-lg font-semibold">Expert Wintess Form</legend>
                                    <div className="mb-4">
                                        <br />
                                        <label className="form-check-label" htmlFor="StateExpert"></label>
                                        OCDLA Is State Expert
                                        <input
                                            type="checkbox"
                                            name="Ocdla_Is_State_Expert__c"
                                            defaultChecked={contact.Ocdla_Is_State_Expert__c}
                                        />
                                        <br />
                                        <label className="form-check-label" htmlFor="ExpertWitnesDirectory"></label>
                                        Include in Expert Witness Directory
                                        <input
                                            type="checkbox"
                                            name="Include_in_Expert_Witness_Directory__c"
                                            defaultChecked={contact.Include_in_Expert_Witness_Directory__c}
                                        />
                                        <br />
                                        <label className="form-check-label" htmlFor="ExpertWitnessEmail"></label>
                                        Expert Witness Update Email Sent
                                        <input
                                            type="checkbox"
                                            name="ExpertWitnessUpdateEmailSent__c"
                                            defaultChecked={contact.ExpertWitnessUpdateEmailSent__c}
                                        />
                                        <br />
                                        <label className="form-check-label" htmlFor="ExpertWitnessEmailUpdate"></label>
                                        Expert Witness Update Date Sent
                                        <input
                                            type="datetime-local"
                                            name="ExpertWitnessUpdateDateSent__c"
                                            defaultValue={
                                                contact.ExpertWitnessUpdateDateSent__c
                                                    ? new Date(contact.ExpertWitnessUpdateDateSent__c)
                                                        .toISOString()
                                                        .slice(0, 16)
                                                    : ""
                                            }
                                        />
                                        <br />
                                        Ocdla_Expert_Witness_Primary__c
                                        <br />
                                        <TextInput label="Expert Witness Other Areas" apiName="Ocdla_Expert_Witness_Other_Areas__c" currentValue={contact.Ocdla_Expert_Witness_Other_Areas__c} />
                                        <br />
                                        <label className="form-check-label" htmlFor="ExpertWitnessLastUpdated"></label>
                                        Expert Witness Last Updated
                                        <input
                                            type="datetime-local"
                                            name="Ocdla_Expert_Witness_Last_Updated__c"
                                            defaultValue={
                                                contact.Ocdla_Expert_Witness_Last_Updated__c
                                                    ? new Date(contact.Ocdla_Expert_Witness_Last_Updated__c)
                                                        .toISOString()
                                                        .slice(0, 16)
                                                    : ""
                                            }
                                        />
                                        <br />
                                        <label className="form-check-label" htmlFor="ExpertWitnesssUnavailabiltyStart"></label>
                                        Expert Witnesss Unavailabilty Start Date
                                        <input
                                            type="datetime-local"
                                            name="Ocdla_Expert_Unavailability_Start_Date__c"
                                            defaultValue={
                                                contact.Ocdla_Expert_Unavailability_Start_Date__c
                                                    ? new Date(contact.Ocdla_Expert_Unavailability_Start_Date__c)
                                                        .toISOString()
                                                        .slice(0, 16)
                                                    : ""
                                            }
                                        />
                                        <br />
                                        <label className="form-check-label" htmlFor="ExpertWitnesssUnavailabiltyEnd"></label>
                                        Expert Witnesss Unavailabilty End Date
                                        <input
                                            type="datetime-local"
                                            name="Ocdla_Expert_Unavailability_End_Date__c"
                                            defaultValue={
                                                contact.Ocdla_Expert_Unavailability_End_Date__c
                                                    ? new Date(contact.Ocdla_Expert_Unavailability_End_Date__c)
                                                        .toISOString()
                                                        .slice(0, 16)
                                                    : ""
                                            }
                                        />
                                        <br />
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <PickList name="Ocdla_Expert_Travel_Availability__c" label="Travel Availability" defaultValue={contact.Ocdla_Expert_Travel_Availability__c} values={expertTravel} />
                                            </div>
                                        </div>
                                        <br />
                                        <TextInput label="Expert Witness Minimum Hours" apiName="Ocdla_Expert_Minimum_Hours__c" currentValue={contact.Ocdla_Expert_Minimum_Hours__c} />
                                        <br />
                                        <TextInput label="Expert Witness Hourly Rate" apiName="Ocdla_Expert_Hourly_Rate__c" currentValue={contact.Ocdla_Expert_Hourly_Rate__c} />
                                        <br />
                                        <TextInput label="Expert Witness Comments" apiName="Ocdla_Expert_Comments__c" currentValue={contact.Ocdla_Expert_Comments__c} />
                                    </div>
                                </fieldset>

                            </div>
                        )
                        }
                        { /* Name */}
                        <fieldset className="border rounded p-4 mb-6">
                            <legend className="text-lg font-semibold">Name</legend>
                            <div className="grid grid-cols-3 gap-4">
                                <TextInput label="First Name" apiName="FirstName" currentValue={contact.FirstName} />
                                <TextInput label="Middle Name" apiName="MiddleName" currentValue={contact.MiddleName} />
                                <TextInput label="Last Name" apiName="LastName" currentValue={contact.LastName} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <TextInput label="Suffix" apiName="Suffix" currentValue={contact.Suffix} />
                                <div>
                                    <PickList name="Salutation" label="Salutation" defaultValue={contact.Salutation} values={salutations} />
                                </div>
                            </div>
                        </fieldset>
                        {/* Opt Ins */}
                        <fieldset className="border rounded p-4 mb-6">
                            <legend className="text-lg font-semibold">Opt Ins</legend>
                            <div className="mb-4">
                                <div className="">
                                    <label className="text-sm font-semibold mb-2" htmlFor="Legislation">
                                        Legislative Opt In
                                    </label>
                                    <input
                                        type="checkbox"
                                        name="LegislativeAdvocacyOptIn__c"
                                        defaultChecked={contact.LegislativeAdvocacyOptIn__c}
                                        className="ml-3"
                                    />
                                </div>
                                <label className="text-sm font-semibold mb-2" htmlFor="Expert Witnes">
                                    Is Expert Witness
                                </label>
                                <input
                                    type="checkbox"
                                    name="Ocdla_Is_Expert_Witness__c"
                                    defaultChecked={contact.Ocdla_Is_Expert_Witness__c}
                                    className="ml-3"
                                />
                            </div>
                        </fieldset>
                        {/* Bar Number and License Number */}
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <TextInput label="Bar Number" apiName="Ocdla_Bar_Number__c" currentValue={contact.Ocdla_Bar_Number__c} />
                            <TextInput label="Investigator License Number" apiName="Ocdla_Investigator_License_Number__c" currentValue={contact.Ocdla_Investigator_License_Number__c} />
                            <TextInput label="Organization" apiName="Ocdla_Organization__c" currentValue={contact.Ocdla_Organization__c} />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <PickList label="Occupation" name="Ocdla_Occupation_Field_Type__c" defaultValue={contact.Ocdla_Occupation_Field_Type__c} values={occupations} />

                            <PickList label="Public Defense Survey" name="Public_Defense_Survey__c" defaultValue={contact.Public_Defense_Survey__c.split(';')} values={publicDefenseSurvey} multiple={true} />
                        </div>
                        {/* Contact Info */}
                        <fieldset className="border rounded p-4 mb-6">
                            <legend className="text-lg font-semibold">Contact Info</legend>
                            <div className="grid grid-cols-2 gap-4">
                                <TextInput label="Work Email" apiName="OrderApi__Work_Email__c" currentValue={contact.OrderApi__Work_Email__c} />
                                <TextInput label="Website" apiName="Ocdla_Website__c" currentValue={contact.Ocdla_Website__c} />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <TextInput label="Phone" apiName="Phone" currentValue={contact.Phone} />
                                <TextInput label="Cell Phone" apiName="Ocdla_Cell_Phone__c" currentValue={contact.Ocdla_Cell_Phone__c} />
                                <TextInput label="Fax" apiName="Fax" currentValue={contact.Fax} />
                            </div>
                        </fieldset>
                        {/* Mailing Address */}
                        <fieldset className="border rounded p-4 mb-6">
                            <legend className="text-lg font-semibold">Mailing Address</legend>
                            <TextInput label="Street" apiName="MailingStreet" currentValue={contact.MailingAddress.street} />
                            <div className="grid grid-cols-3 gap-4">
                                <TextInput label="City" apiName="MailingCity" currentValue={contact.MailingAddress.city} />
                                <PickList label="State" name="MailingState" defaultValue={contact.MailingAddress.state} values={states} />
                                <TextInput label="Zipcode" apiName="MailingPostalCode" currentValue={contact.MailingAddress.postalCode} />
                                <PickList label="Country" name="MailingCountryCode" defaultValue={contact.MailingAddress.countryCode} values={countries} />
                            </div>
                        </fieldset>
                        {/* Buttons */}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </form >
                </div >
            )

            }
        </div >
    );
}
