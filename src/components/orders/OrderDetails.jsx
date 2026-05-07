import { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext, useLocation } from "react-router-dom";
import { getOrderItems } from './query.js';

// Information about a specific order for an account.
export default function AccountOrder() {

    const { client, metadata } = useOutletContext();
    const { orderId } = useParams();
    const [orderItems, setOrderItems] = useState(null);


    useEffect(() => {
        console.log("orderId from params:", orderId);  // Add this line

        const soql = getOrderItems(orderId);
        console.log("Generated SOQL:", soql);  // Add this line

        const fetchOrders = async () => {
            const resp = await client.query(soql);
            setOrderItems(resp.records);
            console.log("orderId query response", resp);
        };
        fetchOrders();
    }, []);

    return (
        <div className="container mx-auto p-6 mt-20">
            {orderItems && orderItems.length > 0 && (
                <div>
                    <div className="px-4">
                        <h1 className="text-base/7 font-semibold text-gray-900">Order Items</h1>
                    </div>
                    <div className="mt-6 border-t border-gray-100">
                        <div className="divide-y divide-gray-100">

                            {/* Order Number */}
                            <div className="px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm/6 font-medium text-gray-900">Order Number</div>
                                    <div className="text-sm/6 text-gray-700">{orderItems[0].Order?.OrderNumber}</div>
                                </div>
                            </div>


                            {/* Product Name & Price */}
                            <div className="px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm/6 font-medium text-gray-900">Product</div>
                                    <div className="text-sm/6 text-gray-700">{orderItems[0].Product2?.Name}</div>
                                </div>
                                <div>
                                    <div className="text-sm/6 font-medium text-gray-900">Total Price</div>
                                    <div className="text-sm/6 text-gray-700">${orderItems[0].TotalPrice}</div>
                                </div>
                            </div>

                            {/* Quantity & Unit Price */}
                            <div className="px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm/6 font-medium text-gray-900">Quantity</div>
                                    <div className="text-sm/6 text-gray-700">{orderItems[0].Quantity}</div>
                                </div>
                                <div>
                                    <div className="text-sm/6 font-medium text-gray-900">Unit Price</div>
                                    <div className="text-sm/6 text-gray-700">${orderItems[0].UnitPrice}</div>
                                </div>
                            </div>

                            {/* Description & Service Date */}
                            <div className="px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm/6 font-medium text-gray-900">Description</div>
                                    <div className="text-sm/6 text-gray-700">{orderItems[0].Description}</div>
                                </div>
                            </div>

                            {/* Contact Name */}
                            <div className="px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm/6 font-medium text-gray-900">Contact</div>
                                    <div className="text-sm/6 text-gray-700">{orderItems[0].Contact__r?.Name}</div>
                                </div>
                            </div>

                            {/* Item Category */}
                            <div className="px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm/6 font-medium text-gray-900">Item Category</div>
                                    <div className="text-sm/6 text-gray-700">{orderItems[0].Product2?.Ocdla_Item_Category__c}
                                    </div>
                                </div>
                            </div>

                            {/* Proration Type */}
                            <div className="px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm/6 font-medium text-gray-900">Proration Type</div>
                                    <div className="text-sm/6 text-gray-700">{orderItems[0].Product2?.ProrationType__c}</div>
                                </div>
                            </div>

                            {/* OCDLA Status Grant */}
                            <div className="px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm/6 font-medium text-gray-900">OCDLA Status Grant</div>
                                    <div className="text-sm/6 text-gray-700">{orderItems[0].Product2?.OcdlaMembershipStatusGrant__c}</div>
                                </div>
                            </div>

                            {/* OCDLA Image */}
                            <div className="px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm/6 font-medium text-gray-900">Product Image</div>
                                    {orderItems[0].Product2?.Ocdla_Image__c && (
                                        <img
                                            src={orderItems[0].Product2?.Ocdla_Image__c}
                                            alt="Product"
                                            className="w-full h-auto rounded mt-2"
                                        />
                                    )}
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
