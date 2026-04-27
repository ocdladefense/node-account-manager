import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { useLocation } from 'react-router-dom';



// Information about a specific order for an account.
export default function AccountOrder() {

    let { client } = useOutletContext();
    let { accountId } = useParams();

    // TODO: Correct to follow Contact Form structure
    const { state } = useLocation();
    const order = state?.order;

    console.log("order object should be passed through properly", order)

    return (
        <div className="container mx-auto p-6 mt-20">
            <h1 className="text-2xl font-bold mb-6">Order Details</h1>
            {order && (
                <div className="border rounded p-6">
                    <p><strong>Order ID:</strong> {order.Id}</p>
                    {/* Display other order fields */}
                </div>
            )}
        </div>
    );
}
