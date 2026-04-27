import { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext, useLocation } from "react-router-dom";



// Information about a specific order for an account.
export default function AccountOrder() {

    const { client, metadata } = useOutletContext();
    const { orderId } = useParams();

    // TODO: Correct to follow Contact Form structure
    const { state } = useLocation();
    const order = state?.order;

    return (
        <div className="container mx-auto p-6 mt-20">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Order Details</h1>
            </div>

            {order && (
                <div className="border rounded p-6">
                    {/* Order ID */}
                    <div className="grid-col-1">
                        <h2 className="text-3xl font-bold mb-6">Order {order.Id}</h2>
                    </div>

                    {/* Order Status */}
                    <div className="grid grid-cols-2 mb-6 p-4 gap-1 rounded bg-blue-50">
                        <p className="text-xl">Status: {order.Status || 'N/A'}</p>
                        <p className="text-xl">Order Date: {order.CreatedDate || 'N/A'}</p>
                    </div>

                    {/* Order Amount */}
                    <div className="grid grid-cols-2 mb-6 p-4 gap-1 rounded bg-blue-50">
                        <p className="text-xl">Total Amount: {order.TotalAmount || 'N/A'}</p>
                        <p className="text-xl">Currency: {order.CurrencyIsoCode || 'USD'}</p>
                    </div>


                    {/* Order Details */}
                    <div className="grid grid-cols-1 mb-6 p-4 rounded bg-blue-50">
                        <p className="text-xl mb-3">Additional Details:</p>
                        <ul className="list-none grid grid-cols-[auto_1fr] gap-2">
                            <li className="font-semibold">Description:</li>
                            <li>{order.Description || 'N/A'}</li>
                        </ul>
                    </div>


                </div>
            )}

        </div>
    );
}
