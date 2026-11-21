
export default function OrderConfirmation({ data }) {

    const orderNumber = data.orderNumber;
    const transactionId = data.transactionId;
    const isInvoice = data.postingEntity === "Invoice";

    return (
        <div className="w-full text-left">

            <h2 className="text-2xl font-bold mb-6">
                {isInvoice ? "Invoice" : "Order"} Submitted Successfully!
            </h2>

            <div className="space-y-4">

                <p>
                    <strong>Order Number:</strong> {orderNumber}
                </p>

                {typeof transactionId === "string" && transactionId !== "" && (
                    <p>
                        <strong>Transaction ID:</strong> {transactionId}
                    </p>
                )}

            </div>

        </div>
    );
}
