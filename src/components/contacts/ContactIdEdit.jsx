import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useOutletContext } from "react-router-dom";



export default function ContactIdEdit() {

    let { client } = useOutletContext();

    let params = useParams();
    let type = params.type;

    let contactId = '001j000000oPG6eAAG';

    let [contact, setContacts] = useState([]);

    // useEffect(function() {

    //     async function fetchContact() {

    //         try {
    //             const response = await client.query("SELECT Id, AccountId, Name FROM Contact WHERE AccountId = '003cY00000Zhq7HQAR'");

    //             console.log(response.records);

    //             setAccounts(response.records);
    //         } catch (error) {
    //             console.error("Error fetching accounts:", error);
    //         }
    //     }

    //     fetchContact();
    // }, []);

    return (
        <div className="container mx-auto p-6 mt-20">
            <p>Hello World Edit My Contact!</p>
        </div>
    );
};

