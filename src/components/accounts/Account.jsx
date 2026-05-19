import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useOutletContext } from "react-router-dom";
import { getAccountQuery } from "./query.js";
import AccountContacts from "./AccountContacts";


export default function Account() {

    let { client } = useOutletContext();
    const navigate = useNavigate();

    let { accountId } = useParams();

    const [account, setAccount] = useState([]);

    // TODO: Currently need to add accountId to dependency array because the properties below are not loading on first render. Is there a better way to fix this?
    useEffect(() => {
        const soql = getAccountQuery(accountId);
        const fetchAccount = async () => {
            const resp = await client.query(soql);
            setAccount(resp.records);
        };
        fetchAccount();
    }, [accountId]);


    return (
        <div className="container mx-auto px-2 mt-[28px]">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold mb-4">Info for {account && account[0] && account[0].Name || 'Not Available'}</h1>
            </div>
            {/* account && account[0] && checks if array exists and has at least one record before accessing properties, falls back to 'Not Available' */}
            <h2 className="text-2xl font-bold mb-4">Account Number: {account && account[0] && account[0].AccountNumber || 'Not Available'} </h2>
            <h2 className="text-2xl font-bold mb-4">Website: {account && account[0] && account[0].Site || 'Not Available'} </h2>
            <h2 className="text-2xl font-bold mb-4">Employees: {account && account[0] && account[0].NumberOfEmployees || 'Not Available'} </h2>
            <h2 className="text-2xl font-bold mb-4">Industry: {account && account[0] && account[0].Industry || 'Not Available'} </h2>
            <h2 className="text-2xl font-bold mb-4">Description: {account && account[0] && account[0].Description || 'Not Available'} </h2>
            <AccountContacts></AccountContacts>
        </div>
    );
}
