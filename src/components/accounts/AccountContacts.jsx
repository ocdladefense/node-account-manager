import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Button from "../ui/Button.jsx";
import useModal from '../hooks/useModal.js';
import Modal from '../ui/Modal.jsx';
import { useToast, NewToast } from "../ui/notifications/ToastService.jsx";
// Import these in this order to reinforce the correct sequence of steps in the order creation process.
import SelectContacts from "../workflows/contact/SelectContacts.jsx";
import SelectEvent from "../workflows/events/SelectEvent.jsx";
import EventTicketOrder from "../workflows/events/EventTicketOrder.jsx";
import SelectPaymentMethod from "../workflows/payment/SelectPaymentMethod.jsx";
import CreateNewPaymentMethod from "../workflows/payment/CreateNewPaymentMethod.jsx";
import ReviewOrder from "../workflows/order/ReviewOrder.jsx";
import OrderConfirmation from "../workflows/order/OrderConfirmation.jsx";





export default function AccountContacts() {

    const navigate = useNavigate();
    const { isOpen, openModal, closeModal } = useModal();
    const { CreateToast } = useToast();
    const [contacts, setContacts] = useState([]);
    const [data, setData] = useState(() => ({ selectedContactIds: [], total: 0.00 }));

    useEffect(() => {
        console.log("ORDER DATA UPDATED:", data);
    }, [data]);




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

    function onComplete(orderId, postingEntity) {

        let orderType = postingEntity === "Invoice" ? "invoice" : "order";

        CreateToast(NewToast("Order created successfully."));

        // closeModal();

        // Is this the appropriate place to zero out data? (No its not)
        // Special kind of done button !!!
        setData({
            orderNumber: orderId,
            selectedContactIds: [],
            orderLines: {},
            total: 0
        });

        // navigate(`/${orderType}/${orderId}`);
    };

    function onError(error) {
        CreateToast(NewToast(error));
    };




    return (

        <form id="batch-action" onSubmit={handleSubmit.bind(null, data, onComplete, onError)}>

            <div className="w-full">

                {/*-------------------- START OF MODAL SECTION -------------------- */}
                <Modal isOpen={isOpen} onClose={closeModal} defaultButtons={true} data={data} setData={setData}>
                    <SelectEvent />
                    {/*<SelectProduct />*/}
                    <EventTicketOrder contacts={contacts} data={data} setData={setData} />
                    <SelectPaymentMethod getNextStep={(formData) => formData.get("paymentMethodId") == "new_card" ? 4 : 5} />
                    <CreateNewPaymentMethod />
                    <ReviewOrder onSubmit={handleSubmit.bind(null, data, onComplete, onError)} />
                    <OrderConfirmation onSubmit={closeModal} />
                </Modal>
                {/*-------------------- END OF MODAL SECTION -------------------- */}

                <div className="container mx-auto px-6 mt-7">

                    <div className="overflow-x-auto">

                        <SelectContacts contacts={contacts} data={data} setData={setData} />

                    </div>

                    <br />


                    <Button label="Register Events" buttonType="button" action={openModal} />
                    <Button label="Renew Membership" buttonType="button" />

                </div>

            </div>

        </form>
    );
}





async function handleSubmit(data, onComplete, onError, e) {
    e.preventDefault();
    e.stopPropagation();

    try
    {
        const resp = await fetch("/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await resp.json();

        if (!resp.ok || result.error)
        {
            throw new Error(result.error || "Order creation failed.");
        }

        console.log("ORDER CREATED:", result);

        onComplete(result.Id, result.PostingEntity__c);

    } catch (error)
    {
        console.error("Error submitting order:", error);

        onError(error.message || "Unable to submit order.");
    }
}


