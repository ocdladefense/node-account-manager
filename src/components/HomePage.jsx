import { SubscriptionsWidget } from './dashboard/SubscriptionsWidget';
import { EventsWidget } from './dashboard/EventsWidget';
import { StatusWidget } from './dashboard/StatusWidget';
import Modal from './ui/Modal';
import useModal from './hooks/useModal';
import ConfirmOrder from './orders/ConfirmOrder';
import { getCookie } from '@ocdla/salesforce/CookieUtils';
import { useNavigate } from "react-router-dom";
import { useToast, NewToast } from "./ui/notifications/ToastService";
import { useState, useEffect } from "react";



export default function HomePage() {

    const { isOpen, openModal, closeModal } = useModal();
    const navigate = useNavigate();
    const { CreateToast } = useToast();
    const [source, setSource] = useState(null);
    const [products, setProducts] = useState([]);
    const [queryType, setQueryType] = useState(null);
    const [queryParam, setQueryParam] = useState(null);
    const [label, setLabel] = useState("");




    useEffect(() => {
        const fetchProducts = async () => {
            try
            {
                const resp = await fetch("/api/query/event-products?eventId=" + queryParam);
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

        if (null == queryType) return;
        fetchProducts();
    }, [queryType]);





    const openOrderConfirmation = (product, source) => {
        setProducts([product]);
        setSource(source);
        openModal();
    };


    const openOrderConfirmationForEvent = (event, source) => {
        // Get a List of products (tickets)
        setQueryParam(event.Id);
        setQueryType("event");
        setLabel(event.Name);

        // Also set the controlling query parameter
        setSource(source);
        openModal();
    };


    const contactId = getCookie("contact_id");


    return (
        <div className="w-full">
            <div className="container mx-auto px-2 mt-7">
                <h1 className="text-2xl font-bold mb-4">Welcome to OCDLA!</h1>

                <StatusWidget renewHandler={openOrderConfirmation} />

                <EventsWidget registerHandler={openOrderConfirmationForEvent} />

                <SubscriptionsWidget subscribeHandler={openOrderConfirmation} />

                {/*-------------------- START OF MODAL SECTION -------------------- */}

                {/*-------------------- END OF MODAL SECTION -------------------- */}

            </div>
        </div>
    )

}





// Let the label reference the name of the Seminar or Event, and any summary information about the contacts that will be registered.
// <h2 className="text-2xl font-semibold mb-4">Here is my event registration</h2>
function EventRegistrationLabel({ event, label, contacts }) {


    return (
        <p>Proceed with registration for {label}</p>
    );
}




// 
function MembershipAddOnLabel({ product }) {

    return (
        <p>Add {product.Name} to your membership.</p>
    );

}



function MembershipRenewalLabel() {
    return <p>Renew your OCDLA membership.</p>;
}


