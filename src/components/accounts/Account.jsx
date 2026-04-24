import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useOutletContext } from "react-router-dom";
import AccountContacts from "./AccountContacts";

export default function Account() {

    let { client } = useOutletContext();
    const navigate = useNavigate();

    let params = useParams();

    const [account, setAccount] = useState(null);

    useEffect(() => {
        async function fetchAccount() {
            console.log(params.accountId);
            try {
                const response = await client.query(`SELECT Id,Name,Description,AccountNumber,Site,NumberOfEmployees,Industry
                    FROM Account 
                    WHERE Id = '${params.accountId}'`);


                console.log(response.records);
                setAccount(response.records);

            }
            catch (error) {
                console.error("Error fetching accounts:", error);
            }

        }

        fetchAccount();
    }, []);

    const handleBack = function() {
        navigate('/accounts');
    }
    if (!account) {
        return <div className="container mx-auto p-6 mt-20">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-6 mt-20">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold mb-4">Info for {account[0].Name}</h1>
                <button onClick={handleBack} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                    Back
                </button>
            </div>
            <h2 className="text-2xl font-bold mb-4">Account Number: {account[0].AccountNumber} </h2>
            <h2 className="text-2xl font-bold mb-4">Website: {account[0].Site} </h2>
            <h2 className="text-2xl font-bold mb-4">Employees: {account[0].NumberOfEmployees} </h2>
            <h2 className="text-2xl font-bold mb-4">Industry: {account[0].Industry} </h2>
            <h2 className="text-2xl font-bold mb-4">Description: {account[0].Description} </h2>
            <AccountContacts></AccountContacts>
        </div>
    );
}
