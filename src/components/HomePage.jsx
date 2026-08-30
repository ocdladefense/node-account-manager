import { SubscriptionsWidget } from './dashboard/SubscriptionsWidget';
import { EventsWidget } from './dashboard/EventsWidget';
import { StatusWidget } from './dashboard/StatusWidget';
import Modal from './ui/Modal';
import useModal from './hooks/useModal';
import OrderConfirmationProductSelect from './orders/OrderConfirmationProductSelect';
import { getCookie } from '@ocdla/salesforce/CookieUtils';
import { useNavigate } from "react-router-dom";
import { useToast, NewToast } from "./ui/notifications/ToastService";
import { useState, useEffect } from "react";
import Button from './ui/Button';



export default function HomePage() {

    const { isOpen, openModal, closeModal } = useModal();
    const navigate = useNavigate();
    const { CreateToast } = useToast();

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedSource, setSelectedSource] = useState(null);
    const [products, setProducts] = useState([]);
    const [queryType, setQueryType] = useState(null);




    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const resp = await fetch("/api/query/event-products");
                const data = await resp.json();

                if (!resp.ok) {
                    throw new Error(
                        data.error || "Unable to retrieve event products."
                    );
                }

                setProducts(data.records);

            } catch (error) {
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
        setSelectedSource(source);
        openModal();
    };




    const openOrderConfirmationForEvent = (event, source) => {

        // Get a List of products (tickets)
        setQueryType("event");
        // Also set the controlling query parameter

        setSelectedSource(source);
        openModal();
    };

    const contactId = getCookie("contact_id");

    return (
        <div className="w-full">
            <div className="container mx-auto px-2 mt-7">
                <h1 className="text-2xl font-bold mb-4">Welcome to OCDLA!</h1>

                <StatusWidget />

                <EventsWidget registerHandler={openOrderConfirmationForEvent} />

                <SubscriptionsWidget subscribeHandler={(product) =>
                    openOrderConfirmation(product, "subscription")
                }
                />

                {/*-------------------- START OF MODAL SECTION -------------------- */}
                <Modal isOpen={isOpen} onClose={closeModal} defaultButtons={false}
                    content={
                        <div>
                            <OrderConfirmationProductSelect
                                products={products}
                                contactIds={[contactId]}
                                source={selectedSource}
                                onComplete={(orderType, orderId) => {
                                    CreateToast(
                                        NewToast("Order created successfully.")
                                    );

                                    closeModal();

                                    navigate(`/${orderType}/${orderId}`);
                                }}
                                onError={(error) => CreateToast(
                                    <div className="bg-red-500 text-black px-6 py-4 text-lg font-semibold rounded-lg shadow-lg">
                                        {error}
                                    </div>
                                )}
                            />

                            <Button label="Register" buttonType="submit" form="order-confirmation" />

                            <Button label="Cancel" buttonType="button" action={closeModal} />
                        </div>
                    }
                />
                {/*-------------------- END OF MODAL SECTION -------------------- */}

            </div>
        </div>
    )

}
