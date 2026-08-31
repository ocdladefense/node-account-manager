const getStatusColor = (status) => {
    return status === "Posted Payment" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
};

export default function InvoiceHeader({
    invoiceNumber,
    invoiceDate,
    totalAmount,
    status
}) {
    return (
        <div className="mb-6 border border-gray-100 rounded-lg p-6 bg-white shadow-sm">

            <h1 className="text-2xl font-bold mb-6">
                Invoice Summary
            </h1>

            <div className="grid grid-cols-4 gap-4 items-center">

                <div>
                    <p className="text-sm text-gray-500">
                        Invoice Number
                    </p>

                    <p className="text-lg font-semibold">
                        {invoiceNumber}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">
                        Invoice Date
                    </p>

                    <p className="text-lg font-semibold">
                        {new Date(invoiceDate).toLocaleDateString(
                            'en-US',
                            {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            }
                        )}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">
                        Total Amount
                    </p>

                    <p className="text-lg font-semibold">
                        ${totalAmount}
                    </p>
                </div>

                <div>
                    <span
                        className={`px-3 py-2 rounded-full font-medium text-sm ${getStatusColor(status)}`}
                    >
                        {status}
                    </span>
                </div>

            </div>
        </div>
    );
}
