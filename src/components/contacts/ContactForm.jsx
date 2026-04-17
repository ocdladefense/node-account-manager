import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

export default function ContactForm() {
    const { client } = useOutletContext();
    const navigate = useNavigate();
    const location = useLocation();
    const { contactId } = useParams();

    const initialContact = location.state?.contact || {};

    const [formData, setFormData] = useState({
        Name: initialContact.Name || "",
        Ocdla_Bar_Number__c: initialContact.Ocdla_Bar_Number__c || "",
        Ocdla_Investigator_License_Number__c: initialContact.Ocdla_Investigator_License_Number__c || "",
        MailingAddress_Street: initialContact.MailingAddress?.street || "",
        MailingAddress_City: initialContact.MailingAddress?.city || "",
        MailingAddress_State: initialContact.MailingAddress?.state || "",
        MailingAddress_Zip: initialContact.MailingAddress?.postalCode || "",
        Ocdla_Home_Street__c: initialContact.Ocdla_Home_Street__c || "",
        Ocdla_Home_City__c: initialContact.Ocdla_Home_City__c || "",
        Ocdla_Home_State__c: initialContact.Ocdla_Home_State__c || "",
        Ocdla_Home_Zip__c: initialContact.Ocdla_Home_Zip__c || "",
    });

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

    // No longer need
    const handleChange = (e) => {
        // destructures the two properties from the element input (the name of the element and the value of the element)
        const { name, value } = e.target;
        // Updates State (React State) // updates the form state by creating a new object which takes the previous state of the form. It should keep the other fields unchanged.
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // TODO: Does this need 
    const handleSubmit = async (e) => {

        let target = e.target;
        let contactRecord = new FormData(target);

        // Call Salesforce API to update the contact
        const response = await client.update('Contact', contactRecord);

        if (!response.ok) {
            const result = await response.json();
            console.log(result);
            return;
        }

        return;

        // Navigate back to contact detail page on success
        navigate(`/contacts/${contactId}`);

    };

    // Return to previous page
    const handleCancel = () => {
        navigate(`/contacts/${contactId}`);
    };

    return (
        <div className="container mx-auto p-6 mt-20">
            <h1 className="text-2xl font-bold mb-6">Edit Contact</h1>

            <form onSubmit={handleSubmit} className="max-w-2xl">
                {/* Name */}
                <fieldset className="border rounded p-4 mb-6">
                    <legend className="text-lg font-semibold">Name</legend>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2" htmlFor="FName">
                                First Name
                                <input type="text" name="FName" value={formData.FirstName}
                                    onChange={handleChange} className="w-full px-3 py-2 border rounded" />
                            </label>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2" htmlFor="LName">
                                Last Name
                                <input type="text" name="LName" value={formData.LastName}
                                    onChange={handleChange} className="w-full px-3 py-2 border rounded" />
                            </label>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2" htmlFor="Suff">
                                Suffix
                                <input type="text" name="Suff" value={formData.Suffix}
                                    onChange={handleChange} className="w-full px-3 py-2 border rounded" />
                            </label>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2" htmlFor="Salutation">
                                Salutation
                                <select
                                    name="Salutation"
                                    value={formData.Salutation}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded"
                                >
                                    <option value="">-- None --</option>

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
                            value={formData.Ocdla_Bar_Number__c}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">Investigator License Number</label>
                        <input
                            type="text"
                            name="Ocdla_Investigator_License_Number__c"
                            value={formData.Ocdla_Investigator_License_Number__c}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                </div>

                {/* Mailing Address */}
                <fieldset className="border rounded p-4 mb-6">
                    <legend className="text-lg font-semibold">Mailing Address</legend>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2">Street</label>
                        <input
                            type="text"
                            name="MailingAddress_Street"
                            value={formData.MailingAddress_Street}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">City</label>
                            <input
                                type="text"
                                name="MailingAddress_City"
                                value={formData.MailingAddress_City}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">State</label>
                            <input
                                type="text"
                                name="MailingAddress_State"
                                value={formData.MailingAddress_State}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Zip</label>
                            <input
                                type="text"
                                name="MailingAddress_Zip"
                                value={formData.MailingAddress_Zip}
                                onChange={handleChange}
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
                            value={formData.Ocdla_Home_Street__c}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">City</label>
                            <input
                                type="text"
                                name="Ocdla_Home_City__c"
                                value={formData.Ocdla_Home_City__c}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">State</label>
                            <input
                                type="text"
                                name="Ocdla_Home_State__c"
                                value={formData.Ocdla_Home_State__c}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Zip</label>
                            <input
                                type="text"
                                name="Ocdla_Home_Zip__c"
                                value={formData.Ocdla_Home_Zip__c}
                                onChange={handleChange}
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

