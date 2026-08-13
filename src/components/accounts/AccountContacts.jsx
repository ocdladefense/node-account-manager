import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { getAccountContactsQuery, getEventProductsQuery } from "./query.js";
import Button from "../ui/Button.jsx";
import CheckBox from "../ui/form/CheckBox.jsx";
import DateDisplay from "../ui/DateDisplay.jsx";
import DropMenu from "../ui/form/DropMenu.jsx";
import useModal from '../hooks/useModal.js';
import Modal from '../ui/Modal.jsx';
import { getCookie } from "@ocdla/salesforce/CookieUtils";
import { useToast } from "../ui/notifications/ToastService.jsx";


export default function AccountContacts() {

    let { client } = useOutletContext();
    const navigate = useNavigate();
    const { isOpen, openModal, closeModal } = useModal();
    let accountId = getCookie("account_id");
    const [contacts, setContacts] = useState([]);
    const [productId, setProductId] = useState("");
    const [eventProducts, setEventProducts] = useState([]);
    const { CreateToast } = useToast();
    const selectedProduct = eventProducts.find(
        (entry) => entry.id === productId
    );
    const [attendeeCount, setAttendeeCount] = useState(0);



    const openCustomModal = () => {

        const formData = new FormData(
            document.getElementById("batch-registration")
        );

        const selectedContactIds = formData.getAll("contactIds");

        setAttendeeCount(selectedContactIds.length);

        openModal();
    };




    useEffect(() => {

        const fetchAccountContacts = async () => {
            const soql = getAccountContactsQuery(accountId);
            const resp = await client.query(soql);

            setContacts(resp.records);
        };

        const fetchEventProducts = async () => {
            const soql = getEventProductsQuery();
            const resp = await client.query(soql);

            const products = resp.records.map((product) => ({
                id: product.Id,
                name: product.Name
            }));

            setEventProducts(products);
        };

        fetchAccountContacts();
        fetchEventProducts();

    }, []);




    return (

        <form id="batch-registration" onSubmit={createHandler(CreateToast, closeModal, navigate)}>

            <div className="w-full">

                {/*-------------------- START OF MODAL SECTION -------------------- */}
                <Modal isOpen={isOpen} onClose={closeModal} defaultButtons={false}
                    content={
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Event Registration</h2>
                            <p>
                                {selectedProduct
                                    ? `Proceed with registration for "${selectedProduct.name}"? You will register ${attendeeCount} attendee(s).`
                                    : `Please select an event ticket.`}
                            </p>
                            <br />
                            <DropMenu
                                label={selectedProduct ? selectedProduct.name : "Select Event Ticket"}
                                entries={eventProducts}
                                handler={(entry) => setProductId(entry.id)}
                            />
                            <Button label="Register" buttonType="submit" form="batch-registration" />
                            <Button label="Cancel" buttonType="button" action={closeModal} />
                        </div>
                    }
                />
                {/*-------------------- END OF MODAL SECTION -------------------- */}

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
                                    <tr key={contact.Id} className="border-b cursor-pointer hover:bg-gray-100" onClick={() => navigate(`/contact/${contact.Id}`)}>

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



                    <input name="productId" type="hidden" value={productId} readOnly />

                    <Button label="Register" buttonType="button" action={openCustomModal} />
                    <Button label="Renew Membership" buttonType="button" />

                </div>

            </div>

        </form>
    );
}




/**
 * 
 * @param {Event} e 
 * @returns 
 */
function createHandler(CreateToast, closeModal, navigate) {

    return async function handleSubmit(e) {
        e.preventDefault();
        e.stopPropagation();

        const formData = new FormData(document.getElementById("batch-registration"));

        const selectedContactIds = formData.getAll("contactIds");
        const selectedProductId = formData.get("productId");

        console.log("Selected contacts:", selectedContactIds);

        if (!selectedProductId) {
            CreateToast(
                <div className="bg-red-500 text-black px-6 py-4 text-lg font-semibold rounded-lg shadow-lg">
                    Please select an event ticket.
                </div>
            );
            return;
        }

        if (selectedContactIds.length === 0) {
            CreateToast(
                <div className="bg-red-500 text-black px-6 py-4 text-lg font-semibold rounded-lg shadow-lg">
                    Please select at least one contact.
                </div>
            );
            return;
        }

        try {
            const resp = await fetch("/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contactIds: selectedContactIds,
                    productId: selectedProductId
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

            closeModal();

            navigate(`/order/${result.order.id}`);

            console.log("Order created:", result);
            console.log("Selected contacts:", selectedContactIds);
            console.log("Selected product:", selectedProductId);

        } catch (error) {
            console.error("Error sending order request:", error);

            CreateToast(
                <div className="bg-red-500 text-black px-6 py-4 text-lg font-semibold rounded-lg shadow-lg">
                    Unable to contact the server.
                </div>
            );
        }
    };
}
