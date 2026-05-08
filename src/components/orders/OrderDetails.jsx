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
        <PagedList
            items={orderItems}
            itemsPerPage={5}
            title={null}
            renderHeader={() => (
                <div className="px-4">
                    <div className="text-sm/6 font-medium text-gray-900">Order Details Here: </div>
                    <div className="text-sm/6 text-gray-700">
                        {/*
                            If orderItems exists, get the first item.
                            If it exists, get its Order.
                            If that exists, get its OrderNumber.
                            Otherwise return undefined
                        */}
                        {orderItems?.[0]?.Order?.OrderNumber || "Loading..."}
                    </div>
                </div>
            )}
            renderItem={(item, index) => (
                <div>
                    {/* Item Header */}
                    <div className="px-4 py-2 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50">
                        <div>
                            <div className="text-sm/6 font-medium text-gray-900">Item {index + 1}</div>
                        </div>
                    </div>

                    {/* Product Name & Price */}
                    <div className="px-4 py-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className="text-sm/6 font-medium text-gray-900">Product</div>
                            <div className="text-sm/6 text-gray-700">{item.Product2?.Name}</div>
                        </div>
                        <div>
                            <div className="text-sm/6 font-medium text-gray-900">Total Price</div>
                            <div className="text-sm/6 text-gray-700">${item.TotalPrice}</div>
                        </div>
                    </div>

                    {/* Quantity & Unit Price */}
                    <div className="px-4 py-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className="text-sm/6 font-medium text-gray-900">Quantity</div>
                            <div className="text-sm/6 text-gray-700">{item.Quantity}</div>
                        </div>
                        <div>
                            <div className="text-sm/6 font-medium text-gray-900">Unit Price</div>
                            <div className="text-sm/6 text-gray-700">${item.UnitPrice}</div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="px-4 py-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className="text-sm/6 font-medium text-gray-900">Description</div>
                            <div className="text-sm/6 text-gray-700">{item.Description}</div>
                        </div>
                    </div>

                    {/* Contact Name */}
                    <div className="px-4 py-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className="text-sm/6 font-medium text-gray-900">Contact</div>
                            <div className="text-sm/6 text-gray-700">{item.Contact__r?.Name}</div>
                        </div>
                    </div>

                    {/* Item Category */}
                    <div className="px-4 py-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className="text-sm/6 font-medium text-gray-900">Item Category</div>
                            <div className="text-sm/6 text-gray-700">{item.Product2?.Ocdla_Item_Category__c}</div>
                        </div>
                    </div>

                    {/* Proration Type */}
                    <div className="px-4 py-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className="text-sm/6 font-medium text-gray-900">Proration Type</div>
                            <div className="text-sm/6 text-gray-700">{item.Product2?.ProrationType__c}</div>
                        </div>
                    </div>

                    {/* OCDLA Status Grant */}
                    <div className="px-4 py-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className="text-sm/6 font-medium text-gray-900">OCDLA Status Grant</div>
                            <div className="text-sm/6 text-gray-700">{item.Product2?.OcdlaMembershipStatusGrant__c}</div>
                        </div>
                    </div>

                    {/* OCDLA Image */}
                    <div className="px-4 py-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className="text-sm/6 font-medium text-gray-900">Product Image</div>
                            {item.Product2?.Ocdla_Image__c && (
                                <img
                                    src={item.Product2?.Ocdla_Image__c}
                                    alt="Product"
                                    className="w-1/4 max-w-sm h-auto rounded mt-2 object-cover"
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        />
    );
}
