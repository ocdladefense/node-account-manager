import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useOutletContext } from "react-router-dom";
import { getAccountsQuery } from "./query.js";


export default function Accounts() {
    let { client } = useOutletContext();
    const navigate = useNavigate();

    let params = useParams();
    let type = params.type;

    let [accounts, setAccounts] = useState([]);

    useEffect(() => {
        const soql = getAccountsQuery();
        const fetchAccounts = async () => {
            const resp = await client.query(soql);
            setAccounts(resp.records[0]);
        };
        fetchAccounts();
    }, []);


    const handleSelectAccount = (accountId) => {
        navigate(`/account/${accountId}`);
    };

    return (
        <div className="container mx-auto p-6 mt-20">
            <h1 className="text-2xl font-bold mb-4">All Accounts</h1>

            {/* removed key={account.} for now until we figure out what to do here*/}
            <div className="space-y-2">
                {accounts.map((account) => (
                    <div className="p-4 border rounded cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSelectAccount(account.Id)}>
                        <p>{account.Name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

