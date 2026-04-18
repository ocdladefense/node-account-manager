import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

export default function ContactForm() {
    const { client } = useOutletContext();
    const navigate = useNavigate();
    const location = useLocation();
    const { contactId } = useParams();

    const [Contact, setContact] = useState(null);

    const [salutations, setSalutations] = useState([]);

    useEffect(() => {
        const fetchPicklistValues = async () => {
            try {
                const response = await client.queryObjectMetadata("Contact");
                console.log("Salutations Values: ", response.fields.find((f) => f.name == "Salutation").picklistValues);
                const salutationField = response.fields.find(
                    (f) => f.name === "Salutation"
                );
                setSalutations(salutationField.picklistValues);
            } catch (err) {
                console.error(err);
            }
        };
        fetchPicklistValues();
    }, []);

    useEffect(() => {
        const fetchContact = async () => {
            const response = await client.query(`SELECT 
            Id,
            FirstName,
            LastName,
            MiddleName,
            Suffix,
            Salutation,
            Ocdla_Organization__c,
            OrderApi__Work_Phone__c,
            OrderApi__Work_Email__c,
            LegislativeAdvocacyOptIn__c,
            Ocdla_Is_Expert_Witness__c,
            Ocdla_Address_Line_1__c,
            Ocdla_Address_Line_2__c,
            Ocdla_Bar_Number__c,
            Ocdla_Investigator_License_Number__c,
            Ocdla_Home_Street__c,
            Ocdla_Home_City__c,
            Ocdla_Home_State__c,
            Ocdla_Home_Zip__c,
            MailingAddress,
            Name,
            Phone,
            Ocdla_Cell_Phone__c,
            Fax,
            Ocdla_Website__c
            FROM Contact WHERE Id = '${contactId}'`);
            //console.log(response);
            if (response.totalSize == 1) {
                setContact(response.records[0]);
                console.log("Successfully retrieved contact: ", response.records[0]);
            } else {
                console.log(`Error: There was a problem fetching the data. Query returned ${response.totalSize} results.`);
            }
        }
        fetchContact();
    }, []);

    // TODO: Does this need 
    const handleSubmit = async (e) => {
        e.preventDefault();
        let target = e.target;
        let formData = new FormData(target);
        // get the actual values out of the formData object
        const contactRecord = Object.fromEntries(formData.entries());
        contactRecord.Id = Contact.Id;
        console.log(contactRecord);
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

    console.log("State object: ", Contact);
    if (Contact && salutations.length > 0) {
        return (
            <div className="container mx-auto p-6 mt-20">
                <h1 className="text-2xl font-bold mb-6">Edit Contact</h1>

                <form onSubmit={handleSubmit} className="max-w-2xl">
                    {/* Name */}
                    <fieldset className="border rounded p-4 mb-6">
                        <legend className="text-lg font-semibold">Name</legend>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2" htmlFor="FirstName">
                                    First Name
                                    <input type="text" name="FirstName" defaultValue={Contact.FirstName}
                                        className="w-full px-3 py-2 border rounded" />
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2" htmlFor="LastName">
                                    Last Name
                                    <input type="text" name="LastName" defaultValue={Contact.LastName}
                                        className="w-full px-3 py-2 border rounded" />
                                </label>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2" htmlFor="Suffix">
                                    Suffix
                                    <input type="text" name="Suffix" defaultValue={Contact.Suffix}
                                        className="w-full px-3 py-2 border rounded" />
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2" htmlFor="Salutation">
                                    Salutation
                                    <select
                                        name="Salutation"
                                        defaultValue={Contact.Salutation}
                                        className="w-full px-3 py-2 border rounded"
                                    >
                                        {/* <option value="">-- None --</option> */}

                                        {salutations.map((item) => (
                                            <option key={item.value} value={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                        </div>

                        {/* Bar Number and License Number */}
                    </fieldset>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Bar Number</label>
                            <input
                                type="text"
                                name="Ocdla_Bar_Number__c"
                                defaultValue={Contact.Ocdla_Bar_Number__c}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Investigator License Number</label>
                            <input
                                type="text"
                                name="Ocdla_Investigator_License_Number__c"
                                defaultValue={Contact.Ocdla_Investigator_License_Number__c}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                    </div>

                    {/* Mailing Address */}
                    <fieldset className="border rounded p-4 mb-6">
                        <legend className="text-lg font-semibold">Mailing Address</legend>
                        <div className="mb-4">
                            <label htmlFor="MailingStreet" className="block text-sm font-semibold mb-2">Street</label>
                            <input
                                type="text"
                                name="MailingStreet"
                                defaultValue={Contact.MailingAddress.street}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="MailingCity" className="block text-sm font-semibold mb-2">City</label>
                                <input
                                    type="text"
                                    name="MailingCity"
                                    defaultValue={Contact.MailingAddress.city}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>
                            <div>
                                <label htmlFor="MailingState" className="block text-sm font-semibold mb-2">State</label>
                                <input
                                    type="text"
                                    name="MailingState"
                                    defaultValue={Contact.MailingAddress.state}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>
                            <div>
                                <label htmlFor="MailingZip" className="block text-sm font-semibold mb-2">Zip</label>
                                <input
                                    type="text"
                                    name="MailingPostalCode"
                                    defaultValue={Contact.MailingAddress.postalCode}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>
                        </div>
                    </fieldset>

                    {/* OCDLA Home Address */}
                    <fieldset className="border rounded p-4 mb-6">
                        <legend className="text-lg font-semibold">OCDLA Home Address</legend>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2">Street</label>
                            <input
                                type="text"
                                name="Ocdla_Home_Street__c"
                                defaultValue={Contact.Ocdla_Home_Street__c}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2">City</label>
                                <input
                                    type="text"
                                    name="Ocdla_Home_City__c"
                                    defaultValue={Contact.Ocdla_Home_City__c}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2">State</label>
                                <input
                                    type="text"
                                    name="Ocdla_Home_State__c"
                                    defaultValue={Contact.Ocdla_Home_State__c}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2">Zip</label>
                                <input
                                    type="text"
                                    name="Ocdla_Home_Zip__c"
                                    defaultValue={Contact.Ocdla_Home_Zip__c}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>
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
                </form>
            </div>
        );
    }
}

