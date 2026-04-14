import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

export default function ContactIdEdit() {
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



    const handleChange = (e) => {
        // destructures the two properties from the element input (the name of the element and the value of the element)
        const { name, value } = e.target;
        // Updates State (React State) // updates the form state by creating a new object which takes the previous state of the form. It should keep the other fields unchanged.
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // TODO:
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Reconstruct the contact object for Salesforce update
            const contactRecord = {
                Id: contactId,
                Name: formData.Name,
                Ocdla_Bar_Number__c: formData.Ocdla_Bar_Number__c,
                Ocdla_Investigator_License_Number__c: formData.Ocdla_Investigator_License_Number__c,
                Ocdla_Home_Street__c: formData.Ocdla_Home_Street__c,
                Ocdla_Home_City__c: formData.Ocdla_Home_City__c,
                Ocdla_Home_State__c: formData.Ocdla_Home_State__c,
                Ocdla_Home_Zip__c: formData.Ocdla_Home_Zip__c,
                // Mailing Address as composite field
                MailingAddress: {
                    street: formData.MailingAddress_Street,
                    city: formData.MailingAddress_City,
                    state: formData.MailingAddress_State,
                    postalCode: formData.MailingAddress_Zip
                }
            };

            // Call Salesforce API to update the contact
            await client.update('Contact', contactRecord);

            // Navigate back to contact detail page on success
            navigate(`/contacts/${contactId}`);
        } catch (err) {
            console.error("Error updating contact:", err);
        }
    };

    // Return to previous page
    const handleCancel = () => {
        navigate(`/contacts/${contactId}`);
    };

    // console.log(contact);


    return (
        <div className="container mx-auto p-6 mt-20">
            <h1 className="text-2xl font-bold mb-6">Edit Contact</h1>

            <form onSubmit={handleSubmit} className="max-w-2xl">
                {/* Name */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Name</label>
                    <input
                        type="text"
                        name="Name"
                        value={formData.Name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>

                {/* Bar Number and License Number */}
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

