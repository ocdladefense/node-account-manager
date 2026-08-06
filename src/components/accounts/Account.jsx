import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useOutletContext } from "react-router-dom";
import { getAccountQuery } from "./query.js";
import AccountContacts from "./AccountContacts";
import AccountHeader from "./AccountHeader.jsx";
import { ZapIcon } from "lucide-react";
import FormatAddress from "../ui/FormatAddress.jsx";

export default function Account() {

    let { client } = useOutletContext();
    const navigate = useNavigate();

    let { accountId } = useParams();

    const [account, setAccount] = useState(null);

    // TODO: Currently need to add accountId to dependency array because the properties below are not loading on first render. Is there a better way to fix this?
    useEffect(() => {
        const soql = getAccountQuery(accountId);
        const fetchAccount = async () => {
            const resp = await client.query(soql);
            setAccount(resp.records[0]);
            console.log('account object log', resp.records[0])
        };
        fetchAccount();
    }, [accountId]);

    return (
        <div className="container mx-auto px-2">
            {account && (
                <>
                    <AccountHeader name={account.Name} email={account.Email__c} website={account.Website} phoneNumber={account.Phone} fax={account.Fax}
                        address={<FormatAddress address={account.BillingAddress} />} />
                    <AccountContacts></AccountContacts>
                </>
            )}
        </div>
    );
}
