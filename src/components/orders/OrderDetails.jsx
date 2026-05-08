import { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext, useLocation } from "react-router-dom";
import { getOrderItems } from './query.js';

// Information about a specific order for an account.
export default function AccountOrder() {

    const { client, metadata } = useOutletContext();
    const { orderId } = useParams();
    const [orderItems, setOrderItems] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;


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

    // Calculate pagination values
    const totalItems = orderItems?.length || 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = orderItems?.slice(startIndex, endIndex) || [];

    return (
        <div className="container mx-auto p-6 mt-20">
            {orderItems && orderItems.length > 0 && (
                <div>
                    <div className="px-4">
                        <h1 className="text-base/7 font-semibold text-gray-900">Order Items</h1>
                    </div>
                    <div className="mt-6 border-t border-gray-100">
                        <div className="divide-y divide-gray-100">

                            {/* Order Number (displayed once) */}
                            <div className="px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm/6 font-medium text-gray-900">Order Number</div>
                                    <div className="text-sm/6 text-gray-700">{orderItems[0].Order?.OrderNumber}</div>
                                </div>
                            </div>

                            {/* Loop through paginated items */}
                            {paginatedItems.map((item, index) => (
                                <div key={index}>
                                    {/* Item Header */}
                                    <div className="px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50">
                                        <div>
                                            <div className="text-sm/6 font-medium text-gray-900">Item {startIndex + index + 1}</div>
                                        </div>
                                    </div>

                                    {/* Product Name & Price */}
                                    <div className="px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    <div className="px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-sm/6 font-medium text-gray-900">Quantity</div>
                                            <div className="text-sm/6 text-gray-700">{item.Quantity}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm/6 font-medium text-gray-900">Unit Price</div>
                                            <div className="text-sm/6 text-gray-700">${item.UnitPrice}</div>
                                        </div>
                                    </div>

                                    {/* Description & Service Date */}
                                    <div className="px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-sm/6 font-medium text-gray-900">Description</div>
                                            <div className="text-sm/6 text-gray-700">{item.Description}</div>
                                        </div>
                                    </div>

                                    {/* Contact Name */}
                                    <div className="px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-sm/6 font-medium text-gray-900">Contact</div>
                                            <div className="text-sm/6 text-gray-700">{item.Contact__r?.Name}</div>
                                        </div>
                                    </div>

                                    {/* Item Category */}
                                    <div className="px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-sm/6 font-medium text-gray-900">Item Category</div>
                                            <div className="text-sm/6 text-gray-700">{item.Product2?.Ocdla_Item_Category__c}</div>
                                        </div>
                                    </div>

                                    {/* Proration Type */}
                                    <div className="px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-sm/6 font-medium text-gray-900">Proration Type</div>
                                            <div className="text-sm/6 text-gray-700">{item.Product2?.ProrationType__c}</div>
                                        </div>
                                    </div>

                                    {/* OCDLA Status Grant */}
                                    <div className="px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-sm/6 font-medium text-gray-900">OCDLA Status Grant</div>
                                            <div className="text-sm/6 text-gray-700">{item.Product2?.OcdlaMembershipStatusGrant__c}</div>
                                        </div>
                                    </div>

                                    {/* OCDLA Image */}
                                    <div className="px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-sm/6 font-medium text-gray-900">Product Image</div>
                                            {item.Product2?.Ocdla_Image__c && (
                                                <img
                                                    src={item.Product2?.Ocdla_Image__c}
                                                    alt="Product"
                                                    className="w-full h-auto rounded mt-2"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="mt-8 flex flex-col gap-4">
                            <div className="flex flex-wrap justify-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 rounded border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    First
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 rounded border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3 py-2 rounded text-sm font-medium ${currentPage === page
                                            ? 'bg-blue-600 text-white'
                                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 rounded border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                                <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 rounded border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Last
                                </button>
                            </div>
                            <div className="text-center text-sm text-gray-600">
                                Page {currentPage} of {totalPages} ({totalItems} items)
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
