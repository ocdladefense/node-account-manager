import { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { getOrderItems } from './query.js';

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
        <div>
            {!orderItems || orderItems.length === 0 ? (
                <div className="container mx-auto pl-2">
                    <div className="text-center py-12">
                        <div className="text-lg font-medium text-gray-900">No products found</div>
                    </div>
                </div>
            ) : (
                <div className="container mx-auto pl-2">
                    <div className="mb-6 border border-gray-100 rounded-lg p-6 bg-white shadow-sm">
                        <h1 className="text-2xl font-bold text-center mb-6">Order Summary</h1>
                        <div className="grid grid-cols-4 gap-4 items-center">
                            <div>
                                <p className="text-sm text-gray-500">Order number</p>
                                <p className="text-lg font-semibold">{orderItems[0].Order.OrderNumber}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Date placed</p>
                                <p className="text-lg font-semibold">{new Date(orderItems[0].Order.EffectiveDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total amount</p>
                                <p className="text-lg font-semibold">${orderItems[0].Order.TotalAmount}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <span className={`px-3 py-1 rounded-full font-medium text-sm ${getStatusColor(orderItems[0].Order.Status)}`}>
                                    {orderItems[0].Order.Status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {orderItems.map((item) => (
                            <div key={item.Id} className="border border-gray-100 rounded-lg bg-white shadow-sm hover:shadow-md transition p-[15px]">
                                {/* ROW 1: Product Summary */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-2 border-b border-gray-200" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}>
                                    {/* Product Name */}
                                    <div>
                                        <div className="text-sm/6 font-medium text-gray-900">Product</div>
                                        <div className="text-sm/6 text-gray-700">{item.Product2?.Name}</div>
                                    </div>

                                    {/* Quantity */}
                                    <div>
                                        <div className="text-sm/6 font-medium text-gray-900">Quantity</div>
                                        <div className="text-sm/6 text-gray-700">{item.Quantity}</div>
                                    </div>

                                    {/* Unit Price */}
                                    <div>
                                        <div className="text-sm/6 font-medium text-gray-900">Unit Price</div>
                                        <div className="text-sm/6 text-gray-700">${item.UnitPrice}</div>
                                    </div>

                                    {/* Total Price */}
                                    <div>
                                        <div className="text-sm/6 font-medium text-gray-900">Total Price</div>
                                        <div className="text-sm/6 text-gray-700">${item.TotalPrice}</div>
                                    </div>
                                </div>

                                {/* ROW 2: Additional Details */}
                                <div className="grid grid-cols-1 md:grid-cols-4 pt-2 gap-4" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}>
                                    {/* Item Category */}
                                    <div>
                                        <div className="text-sm/6 font-medium text-gray-900">Item Category</div>
                                        <div className="text-sm/6 text-gray-700">{item.Product2?.Ocdla_Item_Category__c}</div>
                                    </div>

                                    {/* Proration Type */}
                                    <div>
                                        <div className="text-sm/6 font-medium text-gray-900">Proration Type</div>
                                        <div className="text-sm/6 text-gray-700">{item.Product2?.ProrationType__c}</div>
                                    </div>

                                    {/* OCDLA Status Grant */}
                                    <div>
                                        <div className="text-sm/6 font-medium text-gray-900">OCDLA Status Grant</div>
                                        <div className="text-sm/6 text-gray-700">{item.Product2?.OcdlaMembershipStatusGrant__c}</div>
                                    </div>

                                    {/* Contact */}
                                    <div>
                                        <div className="text-sm/6 font-medium text-gray-900">Contact</div>
                                        <div className="text-sm/6 text-gray-700">{item.Contact__r?.Name}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}


