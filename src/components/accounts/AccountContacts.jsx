import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Button from "../ui/Button.jsx";
import CheckBox from "../ui/form/CheckBox.jsx";
import DateDisplay from "../ui/DateDisplay.jsx";
import useModal from '../hooks/useModal.js';
import Modal from '../ui/Modal.jsx';
import { useToast, NewToast } from "../ui/notifications/ToastService.jsx";
import OrderConfirmation from "../orders/OrderConfirmation.jsx";


export default function AccountContacts() {

    const navigate = useNavigate();
    const { isOpen, openModal, closeModal } = useModal();
    const [products, setProducts] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [selectedContactIds, setSelectedContactIds] = useState([]);
    const { CreateToast } = useToast();

    const openCustomModal = () => {
        openModal();
    };



    // This fetch is for populating the drop down menu for the registration modal.
    useEffect(() => {
        const fetchEventProducts = async () => {
            try
            {
                const resp = await fetch("/api/query/event-products");
                const data = await resp.json();

                if (!resp.ok)
                {
                    throw new Error(
                        data.error || "Unable to retrieve event products."
                    );
                }

                setProducts(data.records);

            } catch (error)
            {
                console.error(
                    "Error fetching event products:",
                    error
                );
            }
        };

        fetchEventProducts();
    }, []);



    useEffect(() => {
        const fetchContacts = async () => {
            try
            {
                const resp = await fetch("/api/query/account-contacts");
                const data = await resp.json();

                if (!resp.ok)
                {
                    throw new Error(
                        data.error || "Unable to retrieve account contacts."
                    );
                }

                setContacts(data.records);

            } catch (error)
            {
                console.error(
                    "Error fetching account contacts:",
                    error
                );
            }
        };

        fetchContacts();
    }, []);


    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;

        if (checked)
        {
            // Add the value to the array if checked
            setSelectedContactIds([...selectedContactIds, value]);
        } else
        {
            // Filter out the value from the array if unchecked
            setSelectedContactIds(selectedContactIds.filter((item) => item !== value));
        }
    };


    return (

        <form id="select-contacts">
            <div className="w-full">

                {/*-------------------- START OF MODAL SECTION -------------------- */}
                <Modal isOpen={isOpen} onClose={closeModal} defaultButtons={false}
                    content={
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Event Registration</h2>

                            <OrderConfirmation contactIds={selectedContactIds} products={products} source="event" onComplete={(postingEntity, orderId) => {

                                let orderType = postingEntity === "Invoice" ? "invoice" : "order";
                                CreateToast(NewToast("Order created successfully."));

                                closeModal();

                                navigate(`/${orderType}/${orderId}`);
                            }} onError={(error) => CreateToast(NewToast(error))} />

                            <Button label="Register" buttonType="submit" form="order-confirmation" />
                            <Button label="Cancel" buttonType="button" action={closeModal} />
                        </div>
                    }
                />
                {/*-------------------- END OF MODAL SECTION -------------------- */}

                <div className="container mx-auto px-6 mt-7">

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
                                            <CheckBox label="" name="contactId" value={contact.Id} defaultValue={false} onChange={handleCheckboxChange} />
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



                    <Button label="Register" buttonType="button" action={openCustomModal} />
                    <Button label="Renew Membership" buttonType="button" />

                </div>

            </div>

        </form>
    );
}



