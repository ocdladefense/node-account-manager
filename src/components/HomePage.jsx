import { SubscriptionsWidget } from './dashboard/SubscriptionsWidget';
import { EventsWidget } from './dashboard/EventsWidget';
import { StatusWidget } from './dashboard/StatusWidget';
import Modal from './ui/Modal';
import useModal from './hooks/useModal';
import OrderConfirmationSingleProduct from './orders/OrderConfirmationSingleProduct';
import { getCookie } from '@ocdla/salesforce/CookieUtils';
import { useNavigate } from "react-router-dom";
import { useToast, NewToast } from "./ui/notifications/ToastService";
import { useState } from 'react';
import Button from './ui/Button';

export default function HomePage() {

    const { isOpen, openModal, closeModal } = useModal();
    const navigate = useNavigate();
    const { CreateToast } = useToast();

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedSource, setSelectedSource] = useState(null);

    const openProductConfirmation = (product, source) => {
        setSelectedProduct(product);
        setSelectedSource(source);
        openModal();
    };

    let contactId = getCookie("contact_id");
    let selectedContactIds = [contactId];

    return (
        <div className="w-full">
            <div className="container mx-auto px-2 mt-7">
                <h1 className="text-2xl font-bold mb-4">Welcome to OCDLA!</h1>

                <StatusWidget />

                <EventsWidget registerHandler={(product) =>
                    openProductConfirmation(product, "event")
                }
                />

                <SubscriptionsWidget subscribeHandler={(product) =>
                    openProductConfirmation(product, "subscription")
                }
                />

                {/*-------------------- START OF MODAL SECTION -------------------- */}
                <Modal isOpen={isOpen} onClose={closeModal} defaultButtons={false}
                    content={selectedProduct && (
                        <div>
                            <OrderConfirmationSingleProduct
                                product={selectedProduct}
                                contactIds={selectedContactIds}
                                source={selectedSource}
                                onComplete={(orderType, orderId) => {
                                    CreateToast(
                                        NewToast("Order created successfully.")
                                    );

                                    closeModal();

                                    navigate(`/${orderType}/${orderId}`);
                                }}
                                onError={(error) => CreateToast(NewToast(error))}
                            />

                            <Button label={selectedSource === "event" ? "Register" : "Subscribe"} buttonType="submit" form="single-product-order" />

                            <Button label="Cancel" buttonType="button" action={closeModal} />
                        </div>
                    )}
                />
                {/*-------------------- END OF MODAL SECTION -------------------- */}

            </div>
        </div>
    )

}
