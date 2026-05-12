import { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import PagedList from "../ui/PagedList";
import { getOrderItems } from './query.js';

// Information about a specific order for an account.
export default function AccountOrder() {
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

    return (
        <>
            {!orderItems || orderItems.length === 0 ? (
                <div className="container mx-auto p-6 mt-20">
                    <div className="text-center py-12">
                        <div className="text-lg font-medium text-gray-900">No products found</div>
                    </div>
                </div>
            ) : (
                <PagedList
                    items={orderItems}
                    itemsPerPage={5}
                    title={null}
                    renderHeader={() => (
                        <div className="px-4">
                            <div className="text-2xl font-bold text-gray-900">
                                Order: {orderItems[0]?.Order?.OrderNumber || "Loading..."}
                            </div>
                        </div>
                    )}
                    renderItem={(item, index) => (
                        <div className="border rounded-lg p-6 bg-white shadow-sm">
                            {/* ROW 1: Product Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pb-4 border-b border-gray-200">
                                {/* Product Image */}
                                <div>
                                    {item.Product2?.Ocdla_Image__c && (
                                        <img
                                            src={item.Product2?.Ocdla_Image__c}
                                            alt="Product"
                                            className="w-16 md:w-24 lg:w-32 h-auto rounded object-cover"
                                        />
                                    )}
                                </div>

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
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
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
                    )}
                />
            )}
        </>
    );
}


