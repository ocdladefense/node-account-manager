import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useOutletContext } from "react-router-dom";
import AccountContacts from "./AccountContacts";

export default function Account() {

    let { client } = useOutletContext();
    const navigate = useNavigate();

    let params = useParams();

    const [contact, setContact] = useState(null);

    useEffect(() => {
        async function fetchAccount() {
            console.log(params.accountId);
            try {
                const response = await client.query(`SELECT Id,Name,Description,AccountNumber,Site,NumberOfEmployees,Industry
                    FROM Account 
                    WHERE Id = '${params.accountId}'`);


                console.log(response.records);
                setContact(response.records);

            }
            catch (error) {
                console.error("Error fetching accounts:", error);
            }

        }

        fetchAccount();
    }, []);

    if (!contact) {
        return <div className="container mx-auto p-6 mt-20">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-6 mt-20">
            <h1 className="text-2xl font-bold mb-4">Info for {contact[0].Name}</h1>
            <h2 className="text-2xl font-bold mb-4">Account Number: {contact[0].AccountNumber} </h2>
            <h2 className="text-2xl font-bold mb-4">Website: {contact[0].Site} </h2>
            <h2 className="text-2xl font-bold mb-4">Employees: {contact[0].NumberOfEmployees} </h2>
            <h2 className="text-2xl font-bold mb-4">Industry: {contact[0].Industry} </h2>
            <h2 className="text-2xl font-bold mb-4">Description: {contact[0].Description} </h2>
            <AccountContacts></AccountContacts>
        </div>
    );
}
