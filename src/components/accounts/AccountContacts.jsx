import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Button from "../ui/Button.jsx";
import CheckBox from "../ui/form/CheckBox.jsx";
import DateDisplay from "../ui/DateDisplay.jsx";
import useModal from '../hooks/useModal.js';
import Modal from '../ui/Modal.jsx';
import DropMenu from "../ui/form/DropMenu";
import { useToast, NewToast } from "../ui/notifications/ToastService.jsx";


// Import these in this order to reinforce the correct sequence of steps in the order creation process.
import SelectContacts from "../orders/SelectContacts.jsx";
import SelectEvent from "../orders/SelectEvent.jsx";
import SelectProduct from "../orders/SelectProduct.jsx";
import SelectPaymentMethod from "../payment/SelectPaymentMethod.jsx";
import NewPaymentMethod from "../payment/NewPaymentMethod.jsx";
import ConfirmOrder from "../orders/ConfirmOrder.jsx";



export default function AccountContacts() {

    const navigate = useNavigate();
    const { isOpen, openModal, closeModal } = useModal();
    const [contacts, setContacts] = useState([]);
    const { CreateToast } = useToast();


    const openCustomModal = () => {
        openModal();
    };





    return (

        <form id="batch-action" onSubmit={handleSubmit.bind(null, onComplete, onError)}>

            <div className="w-full">

                {/*-------------------- START OF MODAL SECTION -------------------- */}
                <Modal isOpen={isOpen} onClose={closeModal} defaultButtons={true}>
                    <SelectEvent />
                    <SelectProduct products={products} />
                    <SelectPaymentMethod getNextStep={(formData) => formData.get("paymentTypeId") == "new_card" ? 3 : 4} />
                    <NewPaymentMethod />
                    <ConfirmOrder />
                </Modal>
                {/*-------------------- END OF MODAL SECTION -------------------- */}

                <div className="container mx-auto px-6 mt-7">

                    <h1 className="text-2xl font-bold mb-4">Members ({contacts.length})</h1>

                    <div className="overflow-x-auto">

                        <SelectContacts />

                    </div>

                    <br />


                    <Button label="Register" buttonType="button" action={openCustomModal} />
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
