import { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { getOrderHeader, getOrderItems } from './query.js';
import OrderItem from './OrderItem.jsx';
import OrderHeader from './OrderHeader.jsx';

// Information about a specific order for an account.
export default function OrderDetails() {

    const { client } = useOutletContext();
    const { orderId } = useParams();

    const [orderItems, setOrderItems] = useState(null);
    const [orderHeader, setOrderHeader] = useState(null);

    useEffect(() => {

        const soqlItems = getOrderItems(orderId);

        const fetchOrders = async () => {
            const resp = await client.query(soqlItems);
            setOrderItems(resp.records);
        };

        fetchOrders();

        const soqlHeader = getOrderHeader(orderId);

        const fetchHeader = async () => {
            const resp = await client.query(soqlHeader);
            setOrderHeader(resp.records[0]);
        }

        fetchHeader();

    }, []);

    const getStatusColor = (status) => {
        return status === 'Activated' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    };

    return (
        <div className="w-full">
            <div className="container mx-auto px-2 mt-7">
                {orderHeader && (
                    <>
                        <OrderHeader orderNumber={orderHeader.OrderNumber} orderDate={orderHeader.EffectiveDate} totalDate={orderHeader.TotalAmount} status={orderHeader.Status} />

                        <div className="space-y-8">
                            {orderItems && orderItems.length > 0 ? orderItems.map((item, index) => (
                                <OrderItem key={item.Id} data={item} index={index} />
                            )) : 'No products found'}
                        </div>
                    </>
                )}
            </div>
        </div >
    );
}
