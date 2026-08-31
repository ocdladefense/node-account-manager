import { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { getOrderHeader, getOrderItems } from "../orders/query.js";
import OrderItem from "../orders/OrderItem.jsx";
import InvoiceHeader from "./InvoiceHeader.jsx";

export default function InvoiceDetails() {

    const { client } = useOutletContext();
    const { invoiceId } = useParams();

    const [invoice, setInvoice] = useState(null);
    const [invoiceItems, setInvoiceItems] = useState(null);

    useEffect(() => {

        const soqlHeader = getOrderHeader(invoiceId);

        const fetchInvoice = async () => {
            const resp = await client.query(soqlHeader);
            setInvoice(resp.records[0]);
        };

        fetchInvoice();

        const soqlItems = getOrderItems(invoiceId);

        const fetchInvoiceItems = async () => {
            const resp = await client.query(soqlItems);
            setInvoiceItems(resp.records);

            console.log("invoice items log", resp.records);
        };

        fetchInvoiceItems();

    }, []);

    const displayStatus = invoice?.Status === "Draft" || invoice?.Status === "Activated" ? "Unpaid" : invoice?.Status;

    return (
        <div className="container mx-auto px-2 mt-[28px]">

            {invoice && (
                <>
                    <InvoiceHeader invoiceNumber={invoice.OrderNumber} invoiceDate={invoice.EffectiveDate} totalAmount={invoice.TotalAmount} status={displayStatus} />

                    <div className="space-y-8">
                        {invoiceItems && invoiceItems.length > 0 ? invoiceItems.map((item, index) => (
                            <OrderItem key={item.Id} data={item} index={index} />
                        )) : 'No products found'}
                    </div>
                </>
            )}

        </div>
    );
}
