import { formatPhoneNumber } from "../ui/Phone";

export default function AccountHeader({ name, email, website, phoneNumber, fax, address, memberAmount }) {
    let SF_NO_DATA_ENTERED = process.env.SF_NO_DATA_ENTERED || '&nbsp;';


    return (
        <div className="mb-6 border border-gray-100 rounded-lg p-6 bg-white shadow-sm">

            <h1 className="text-2xl font-bold mb-6">{name}</h1>

            <div className="grid grid-cols-4 gap-4 text-sm items-center border-b border-gray-200">


                <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className=" font-semibold">{email || "\u00A0"}</p>
                </div>


                <div>
                    <p className="text-sm text-gray-500">Website</p>
                    {website ? (
                        <a href={website} target="_blank" rel="noreferrer" className="font-semibold text-blue-600 hover:underline">{website}</a>
                    ) : (
                        "\u00A0"
                    )}
                </div>


                <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-semibold">
                        {phoneNumber ? formatPhoneNumber(phoneNumber) : "\u00A0"}
                    </p>
                </div>


                <div>
                    <p className="text-sm text-gray-500">Fax</p>
                    {fax ? (
                        <a href={fax} className="font-semibold text-blue-600 hover:underline" >
                            {formatPhoneNumber(fax)}
                        </a>
                    ) : (
                        "\u00A0"
                    )}
                </div>


            </div>



            <div className="grid grid-cols-3 gap-4 items-center pt-4">

                <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className=" font-semibold">{address || "\u00A0"}</p>
                </div>

            </div>


        </div>
    );
}
