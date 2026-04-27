import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { getOrderHistory } from './query.js';

// Information about all orders for an Account using a unique Id
export default function AccountOrders() {

    let { client } = useOutletContext();
    let { accountId } = useParams();
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
    }, []);


    const handleSelectOrder = (orderId) => {
        navigate(`/order/${orderId}`);
    };


    return (
        <div className="container mx-auto p-6 mt-20">
            <h1 className="text-2xl font-bold mb-6">All Order History of an Account Here</h1>
            <ul className="space-y-2">
                {orders && orders.map((order) => (
                    <li key={order.Id} className="border rounded p-4">
                        <button
                            onClick={() => navigate(`/order/${order.Id}`, { state: { order } })}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            View Order {order.Id}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
