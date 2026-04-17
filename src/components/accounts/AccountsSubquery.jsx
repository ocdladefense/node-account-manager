import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useOutletContext } from "react-router-dom";



export default function Accounts() {
    let { client } = useOutletContext();
    const navigate = useNavigate();

    // We might need to switch index.js from path=":accountId" to whatever we assign to params.type
    let params = useParams();
    let type = params.type;

    let [accounts, setAccounts] = useState([]);

    useEffect(function() {

        async function fetchAccounts() {

            try {
                // const response = await client.query(`SELECT Id, Name FROM Account WHERE NOT (Name LIKE '%Person%') LIMIT 250`);

                const response = await client.query(`
                    SELECT Id, Name, 
                    (SELECT Id, FirstName, LastName, Name FROM Contacts) 
                    FROM Account 
                    WHERE NOT (Name LIKE '%Person%') 
                `);

                console.log(response.records);

                // Temp for testing to filter for accounts with multiple contacts - remove later
                const accountsWithMultipleContacts = response.records.filter(
                    account => account.Contacts && account.Contacts.records.length > 1
                );

                //setAccounts(response.records);
                setAccounts(accountsWithMultipleContacts);
            } catch (error) {
                console.error("Error fetching accounts:", error);
            }
        }

        fetchAccounts();
    }, []);

    const handleSelectAccount = (accountId) => {
        navigate(`/accounts/${accountId}`);
    };

    return (
        // <div className="container mx-auto p-6 mt-20">
        //     <h1 className="text-2xl font-bold mb-4">All Accounts</h1>

        //     <h1 className="text-2xl font-bold mb-4">All Accounts With Multiple Conacts *FOR TESTING* </h1>

        //     {/* removed key={account.} for now until we figure out what to do here*/}
        //     <div className="space-y-2">
        //         {accounts.map((account) => (
        //             <div className="p-4 border rounded cursor-pointer hover:bg-gray-100"
        //                 onClick={() => handleSelectContact(account.Id)}>
        //                 <p>{account.Name}</p>
        //             </div>
        //         ))}
        //     </div>
        // </div>



        <div className="space-y-4">
            {accounts.map((account) => (
                <div key={account.Id} className="p-4 border rounded bg-gray-50">
                    <h2 className="text-xl font-bold mb-2">{account.Name}</h2>
                    <div className="ml-4 space-y-1">
                        {account.Contacts && account.Contacts.records.map((contact) => (
                            <p
                                key={contact.Id}
                                className="text-sm cursor-pointer hover:underline text-blue-600"
                                onClick={() => navigate(`/contacts/${contact.Id}`)}
                            >
                                • {contact.Name}
                            </p>
                        ))}
                    </div>
                </div>
            ))}
        </div>

    );
};

