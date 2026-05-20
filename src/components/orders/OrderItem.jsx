import Label from "../ui/Label.jsx"

export default function OrderItem({ index, data }) {
    return (
        <div className="relative border border-gray-100 rounded-lg bg-white shadow-sm hover:shadow-md transition p-[25px]">
            {/* First Row: Product Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-2 border-b border-gray-200" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}>
                <Label data={(index + 1).toString().padStart(4, "0")} prefix="#" />
                {/* Product Name */}
                <div>
                    <div className="text-sm/6 font-medium text-gray-900">Product</div>
                    <div className="text-sm/6 text-gray-700">{data.Product2?.Name}</div>
                </div>

                {/* Quantity */}
                <div>
                    <div className="text-sm/6 font-medium text-gray-900">Quantity</div>
                    <div className="text-sm/6 text-gray-700">{data.Quantity}</div>
                </div>

                {/* Unit Price */}
                <div>
                    <div className="text-sm/6 font-medium text-gray-900">Unit Price</div>
                    <div className="text-sm/6 text-gray-700">${data.UnitPrice}</div>
                </div>

                {/* Total Price */}
                <div>
                    <div className="text-sm/6 font-medium text-gray-900">Total Price</div>
                    <div className="text-sm/6 text-gray-700">${data.TotalPrice}</div>
                </div>
            </div>

            {/* ROW 2: Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-4 pt-2 gap-4" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}>
                {/* Item Category */}
                <div>
                    <div className="text-sm/6 font-medium text-gray-900">Item Category</div>
                    <div className="text-sm/6 text-gray-700">{data.Product2?.Ocdla_Item_Category__c}</div>
                </div>

                {/* Proration Type */}
                <div>
                    <div className="text-sm/6 font-medium text-gray-900">Proration Type</div>
                    <div className="text-sm/6 text-gray-700">{data.Product2?.ProrationType__c}</div>
                </div>

                {/* OCDLA Status Grant */}
                <div>
                    <div className="text-sm/6 font-medium text-gray-900">OCDLA Status Grant</div>
                    <div className="text-sm/6 text-gray-700">{data.Product2?.OcdlaMembershipStatusGrant__c}</div>
                </div>

                {/* Contact */}
                <div>
                    <div className="text-sm/6 font-medium text-gray-900">Contact</div>
                    <div className="text-sm/6 text-gray-700">{data.Contact__r?.Name}</div>
                </div>
            </div>
        </div>
    );
}



