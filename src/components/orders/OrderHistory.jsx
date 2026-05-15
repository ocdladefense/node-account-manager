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
    }, []);

    const handleSelectOrder = (order) => {
        // Pass the order.Id as the orderId param in the route
        navigate(`/order/${order.Id}`, { state: { order } });
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    // What about other order statuses?
    const getStatusColor = (status) => {
        return status === 'Activated' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    };

    return (
        <div className="container mx-auto pl-2">
            <h1 className="text-2xl font-bold text-center mb-6">Order History</h1>

            {orders && (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.Id} className="border border-gray-100 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition">
                            {/* Order Header Row */}
                            <div className="grid grid-cols-4 gap-4 items-center mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">Order number</p>
                                    <p className="text-lg font-semibold">{order.OrderNumber}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Date placed</p>
                                    <p className="text-lg font-semibold">{formatDate(order.EffectiveDate)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total amount</p>
                                    <p className="text-lg font-semibold">${order.TotalAmount}</p>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => handleSelectOrder(order)}
                                        className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 font-medium transition"
                                    >
                                        View Order
                                    </button>
                                </div>
                            </div>

                            {/* Status and Details Row */}
                            <div className="flex items-center gap-4 text-sm justify-between">
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full font-medium ${getStatusColor(order.Status)}`}>
                                        {order.Status}
                                    </span>
                                </div>
                                {order.Status === 'Activated' && order.FormattedActivatedDate__c && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <p className="text-gray-600">Activated on {order.FormattedActivatedDate__c}</p>
                                        <span>|</span>
                                        <span className="text-blue-600 cursor-pointer">Reactivate</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
