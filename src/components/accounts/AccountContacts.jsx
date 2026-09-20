import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Button from "../ui/Button.jsx";
import useModal from '../hooks/useModal.js';
import Modal from '../ui/Modal.jsx';
import { useToast, NewToast } from "../ui/notifications/ToastService.jsx";


// Import these in this order to reinforce the correct sequence of steps in the order creation process.
import SelectContacts from "../orders/SelectContacts.jsx";
import SelectEvent from "../orders/SelectEvent.jsx";
import ContactAndProductSelect from "../orders/ContactAndProductSelect.jsx";
// import SelectProduct from "../orders/SelectProduct.jsx";
import SelectPaymentMethod from "../payment/SelectPaymentMethod.jsx";
import NewPaymentMethod from "../payment/NewPaymentMethod.jsx";
import ConfirmOrder from "../orders/ConfirmOrder.jsx";




export default function AccountContacts() {

    const navigate = useNavigate();
    const { isOpen, openModal, closeModal } = useModal();
    const { CreateToast } = useToast();
    const [contacts, setContacts] = useState([]);
    const [data, setData] = useState(() => ({}));





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

    // data.contactIds;
    // data.contacts; // Has all contact info for display?
    // data.paymentTypeId;
    // data.productIds;
    // data.products; // Has all product info for display?





    return (

        <form id="batch-action" onSubmit={handleSubmit.bind(null, onComplete, onError)}>

            <div className="w-full">

                {/*-------------------- START OF MODAL SECTION -------------------- */}
                <Modal isOpen={isOpen} onClose={closeModal} defaultButtons={true} data={data} setData={setData}>
                    <SelectEvent />
                    {/*<SelectProduct />*/}
                    <ContactAndProductSelect contacts={contacts} />
                    <SelectPaymentMethod getNextStep={(formData) => formData.get("paymentMethodId") == "new_card" ? 4 : 5} />
                    <NewPaymentMethod />
                    <ConfirmOrder />
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





async function handleSubmit(onComplete, onError, e) {
    e.preventDefault();
    e.stopPropagation();

    const formData = new FormData(document.getElementById("batch-action"));

    const plainObject = Object.fromEntries(formData);

    const resp = await fetch("/orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(plainObject)
    });

    const result = await resp.json();

    if (!resp.ok)
    {
        console.error("Order failed:", result);

        onError(result.error || "Order could not be created.");
        return;
    }

    onComplete(result.postingEntity, result.order.id);
};


function onComplete(postingEntity, orderId) {

    let orderType = postingEntity === "Invoice" ? "invoice" : "order";
    CreateToast(NewToast("Order created successfully."));

    closeModal();

    navigate(`/${orderType}/${orderId}`);
};

function onError(error) {
    CreateToast(NewToast(error));
};
