import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { getAccountContactsQuery } from "./query.js";
import Button from "../ui/Button.jsx";
import CheckBox from "../ui/form/CheckBox.jsx";
import DateDisplay from "../ui/DateDisplay.jsx";
import { getCookie } from "@ocdla/salesforce/CookieUtils";
import { useToast } from "../ui/notifications/ToastService.jsx";


export default function AccountContacts() {

    let { client } = useOutletContext();

    const navigate = useNavigate();

    let accountId = getCookie("account_id");

    const [contacts, setContacts] = useState([]);
    const [productId, setProductId] = useState("");

    const { CreateToast } = useToast();

    const EVENT_PRODUCTS = [
        {
            id: "01t0a000004Ov4FAAS",
            name: "Winter Conference 2017–Nonmember Lawyer"
        },
        {
            id: "01t0a000005Hc7xAAC",
            name: "Z is for Zealous 2019–Member Lawyer/Nonlawyer"
        },
        {
            id: "01t5b000005nU4BAAU",
            name: "VD 2023–Member Lawyer Registration Not Attending Annual Conference"
        }
    ];

    const selectedProduct = EVENT_PRODUCTS.find(
        (product) => product.id === productId
    );

    useEffect(() => {
        const soql = getAccountContactsQuery(accountId);
        const fetchAccountContacts = async () => {
            const resp = await client.query(soql);
            setContacts(resp.records);
        };

        fetchAccountContacts();
    }, []);


    const handleSelectContact = (contactId) => {
        navigate(`/contact/${contactId}`);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const formData = new FormData(e.currentTarget);

        const selectedContactIds = formData.getAll("contactIds");
        const productId = formData.get("productId");

        console.log("Selected contacts:", selectedContactIds);

        try {
            const resp = await fetch("/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contactIds: selectedContactIds,
                    productId: productId
                })
            });

            const result = await resp.json();

            if (!resp.ok) {
                console.error("Order failed:", result);

                CreateToast(
                    <div className="bg-red-500 text-black px-6 py-4 text-lg font-semibold rounded-lg shadow-lg">
                        {result.error || "Order could not be created."}
                    </div>
                );

                return;
            }

            CreateToast(
                <div className="bg-green-500 text-black px-6 py-4 text-lg font-semibold rounded-lg shadow-lg">
                    Order created successfully.
                </div>
            );

            console.log("Order created:", result);
            console.log("Selected contacts:", selectedContactIds);
            console.log("Selected product:", productId);

        } catch (error) {
            console.error("Error sending order request:", error);

            CreateToast(
                <div className="bg-red-500 text-black px-6 py-4 text-lg font-semibold rounded-lg shadow-lg">
                    Unable to contact the server.
                </div>
            );
        }
    };


    return (

        <form onSubmit={handleSubmit}>

            <div className="w-full">

                <div className="container mx-auto px-6 mt-[28px]">

                    <h1 className="text-2xl font-bold mb-4">Members ({contacts.length})</h1>

                    <div className="overflow-x-auto">

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
                                    <tr key={contact.Id} className="border-b cursor-pointer hover:bg-gray-100" onClick={() => handleSelectContact(contact.Id)}>

                                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                            <CheckBox label="" name="contactIds" value={contact.Id} defaultValue={false} />
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

                    <br />

                    <details className="dropdown">
                        <summary className="btn m-1">
                            {selectedProduct ? selectedProduct.name : "Select Event Ticket"}
                        </summary>

                        <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-80 p-2 shadow-sm">
                            {EVENT_PRODUCTS.map((product) => (
                                <li key={product.id}>
                                    <button type="button" onClick={() => setProductId(product.id)}>
                                        {product.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </details>

                    <input name="productId" type="hidden" value={productId} />

                    <Button label="Create Order" buttonType="submit" />

                </div>

            </div>

        </form>
    );
}
