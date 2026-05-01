import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { getOrderHistory } from './query.js';

// Information about all orders for an Account using a unique Id
export default function AccountOrders() {

    const { client, metadata } = useOutletContext();
    const { accountId } = useParams();
    const [orders, setOrders] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const soql = getOrderHistory(accountId);
        const fetchOrders = async () => {
            const resp = await client.query(soql);
            setOrders(resp.records);
            console.log("order fields log", resp);
        };
        fetchOrders();
        console.log('order SObject /details endpoint metadata', metadata);
        console.log('order fields', metadata.metadata.fields);
    }, []);

    const handleSelectOrder = (order) => {
        // Pass the order.Id as the orderId param in the route
        navigate(`/order/${order.Id}`, { state: { order } });
    };

    return (
        <div>
            {orders &&
                <div className="container mx-auto p-6 mt-20">
                    <h1 className="text-2xl font-bold mb-4">All Order History of an Account Here </h1>

                    <div className="space-y-2">
                        {orders.map((order) => (
                            <div className="p-4 border rounded cursor-pointer hover:bg-gray-100"
                                onClick={() => navigate(`/order/${order.Id}`, { state: { order } })}>
                                <p>View Order {order.Id}</p>
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div>
    );
}
