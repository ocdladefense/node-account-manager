import { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { getOrderItems } from './query.js';
import OrderItem from '../ui/OrderItem.jsx';
import OrderHeader from '../ui/OrderHeader.jsx';

// Information about a specific order for an account.
export default function OrderDetails() {
    const { client } = useOutletContext();
    const { orderId } = useParams();
    const [orderItems, setOrderItems] = useState(null);

    useEffect(() => {
        console.log("orderId from params:", orderId);
        const soql = getOrderItems(orderId);
        console.log("Generated SOQL:", soql);

        const fetchOrders = async () => {
            const resp = await client.query(soql);
            setOrderItems(resp.records);
            console.log("orderId query response", resp);
        };
        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        return status === 'Activated' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    };

    return (
        <div className="w-full">
            {!orderItems || orderItems.length === 0 ? (
                <div className="container mx-auto pl-2">
                    <div className="text-center py-12">
                        <div className="text-lg font-medium text-gray-900">No products found</div>
                    </div>
                </div>
            ) : (
                <div className="container mx-auto pl-2">
                    <OrderHeader data={orderItems[0]} />
                    <div className="space-y-8">
                        {orderItems.map((item, index) => (
                            <OrderItem data={item} index={index} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}


