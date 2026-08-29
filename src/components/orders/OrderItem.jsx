import Label from "../ui/Label.jsx"

export default function OrderItem({ index, data }) {
    return (
        <div className="relative border border-gray-100 rounded-lg bg-white shadow-sm hover:shadow-md transition p-6.25">
            {/* First Row: Product Summary */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pb-2 border-b border-gray-200" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}>
                <Label data={(index + 1).toString().padStart(4, "0")} prefix="#" />
                {/* Product Name */}
                <div>
                    <div className="text-sm/6 font-medium text-gray-900">Product: {data.Product2?.Name}</div>
                </div>

                {/* Quantity */}
                <div>
                    <div className="text-sm/6 font-medium text-gray-900">Quantity: {data.Quantity}</div>
                </div>

                {/* Unit Price */}
                <div>
                    <div className="text-sm/6 font-medium text-gray-900">Unit Price: ${data.UnitPrice}</div>
                </div>

                {/* Total Price 
                <div>
                    <div className="text-sm/6 font-medium text-gray-900">Total Price</div>
                    <div className="text-sm/6 text-gray-700">${data.TotalPrice}</div>
                </div>*/}

                {/* Contact */}
                <div>
                    <div className="text-sm/6 font-medium text-gray-900">Contact: {data.Contact__r?.Name}</div>
                </div>
            </div>
        </div>
    );
}



