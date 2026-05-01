import { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext, useLocation } from "react-router-dom";
import { getOrderItems } from './query.js';

// Information about a specific order for an account.
export default function AccountOrder() {

    const { client, metadata } = useOutletContext();
    const { orderId } = useParams();
    const [orderItems, setOrderItems] = useState(null);


    useEffect(() => {
        const soql = getOrderItems(orderId);
        const fetchOrders = async () => {
            const resp = await client.query(soql);
            setOrderItems(resp.records);
            console.log("orderId query response", resp);
        };
        fetchOrders();
    }, []);

    return (
        <div className="container mx-auto p-6 mt-20">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Order Details</h1>
            </div>

            {orderItems && (
                <div className="border rounded p-6">

                </div>
            )}

        </div>
    );
}
