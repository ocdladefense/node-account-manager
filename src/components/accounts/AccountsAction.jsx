import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useOutletContext } from "react-router-dom";



export default function AccountsAction() {

    let { client } = useOutletContext();

    let params = useParams();
    let type = params.type;

    let accountId = '001j000000oPG6eAAG';

    let [accounts, setAccounts] = useState([]);

    useEffect(function() {

        async function fetchAccounts() {

            try {
                const response = await client.query("SELECT Id, AccountId, Name FROM Contact WHERE AccountId = '001j000000oPG6eAAG'");

                console.log(response.records);

                setAccounts(response.records);
            } catch (error) {
                console.error("Error fetching accounts:", error);
            }
        }

        fetchAccounts();
    }, []);

    return (
        <div className="container mx-auto p-6 mt-20">
            <h1 className="text-3xl font-bold mb-4">Accounts from Metro PD Law </h1>
            <ul className="space-y-2">
                {accounts
                    .map(account => (
                        <li key={account.Id} className="text-lg p-2 border-b border-gray-300">
                            <div><strong>{account.Name}</strong></div>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

