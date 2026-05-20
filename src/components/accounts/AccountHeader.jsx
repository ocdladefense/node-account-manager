export default function AccountHeader({ name, email, website, phoneNumber, fax, address, memberAmount }) {
    let SF_NO_DATA_ENTERED = process.env.SF_NO_DATA_ENTERED || ' ';
    return (
        <div className="mb-6 border border-gray-100 rounded-lg p-6 bg-white shadow-sm">
            <h1 className="text-2xl font-bold text-center mb-6">{name}</h1>
            <div className="grid grid-cols-4 gap-4 items-center border-b border-gray-200">
                <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="text-lg font-semibold">{email || SF_NO_DATA_ENTERED}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Website</p>
                    <p className="text-lg font-semibold">{website || SF_NO_DATA_ENTERED}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="text-lg font-semibold">{phoneNumber || SF_NO_DATA_ENTERED}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Fax</p>
                    <p className="text-lg font-semibold">{fax || SF_NO_DATA_ENTERED}</p>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-4 items-center pt-4">
                <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-lg font-semibold">{address || SF_NO_DATA_ENTERED}</p>
                </div>
            </div>
        </div>
    );
}
