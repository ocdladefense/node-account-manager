import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { getCookie } from "@ocdla/salesforce/CookieUtils";
import { getInvoiceHistory } from "./query";

export default function InvoiceHistory() {

    const { client, metadata } = useOutletContext();
    const accountId = getCookie("account_id");
    const [invoices, setInvoices] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const soql = getInvoiceHistory(accountId);

        const fetchInvoices = async () => {
            const resp = await client.query(soql);
            setInvoices(resp.records);
            console.log("invoice fields log", resp);
        };

        fetchInvoices();
    }, []);

    const handleSelectInvoice = (invoice) => {
        navigate(`/invoice/${invoice.Id}`, { state: { invoice } });
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const getStatusColor = (status) => {
        return status === 'Activated' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    };

    return (
        <div className="container mx-auto pl-2 mt-[28px]">
            <h1 className="text-2xl font-bold mb-6">Invoice History</h1>

            {invoices && (
                <div className="space-y-4">
                    {invoices.map((invoice) => (
                        <div
                            key={invoice.Id}
                            className="border border-gray-100 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition"
                        >

                            <div className="grid grid-cols-5 gap-5 items-center mb-4">

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Invoice Status
                                    </p>

                                    <span
                                        className={`px-3 py-1 rounded-full font-medium ${getStatusColor(invoice.Status)}`}
                                    >
                                        {invoice.Status}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Order number
                                    </p>

                                    <p className="text-lg font-semibold">
                                        {invoice.OrderNumber}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Date placed
                                    </p>

                                    <p className="text-lg font-semibold">
                                        {formatDate(invoice.EffectiveDate)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Total amount
                                    </p>

                                    <p className="text-lg font-semibold">
                                        ${invoice.TotalAmount}
                                    </p>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={() => handleSelectInvoice(invoice)}
                                        className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 font-medium transition cursor-pointer"
                                    >
                                        View Invoice
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
