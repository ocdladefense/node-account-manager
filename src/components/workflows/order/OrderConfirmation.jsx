export default function OrderConfirmation({ data }) {

    return (
        <div className="w-full text-left">

            <h2 className="text-2xl font-bold mb-6">
                Your order was created. Order #: {data.orderNumber}
            </h2>

        </div>
    );
}
