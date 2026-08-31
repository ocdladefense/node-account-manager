import DateDisplay from "../ui/DateDisplay";

const getStatusColor = (status) => {
    return status === 'Activated' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
};

export default function OrderHeader({ id, orderNumber, orderDate, totalDate, status }) {
    return (
        <div className="mb-6 border border-gray-100 rounded-lg p-6 bg-white shadow-sm">
            <h1 className="text-2xl font-bold mb-6">Order Summary</h1>
            <div className="grid grid-cols-4 gap-4 items-center">

                <div data-order-id={id}>
                    <p className="text-sm text-gray-500">Order Number</p>
                    <p className="text-lg font-semibold">{orderNumber}</p>
                </div>

                <DateDisplay
                    label="Date placed"
                    value={orderDate}
                    type="Date"
                    labelClassName="text-sm text-gray-500 font-normal"
                    textClassName="text-lg font-semibold"
                    month="long"
                />

                <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-lg font-semibold">${totalDate}</p>
                </div>

                <div>
                    <span className={`px-3 py-2 rounded-full font-medium text-sm ${getStatusColor(status)}`}>
                        {status}
                    </span>
                </div>
            </div>
        </div>
    );
}
