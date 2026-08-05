import { useState, useEffect } from 'react';
import { useOutletContext } from "react-router-dom";
import { getAccountContactsQuery } from './accounts/query';

export default function HomePage() {

    let { client } = useOutletContext();
    let [contacts, setContacts] = useState([]);


    return (
        <div className="w-full">
            <div className="container mx-auto px-2 mt-[28px]">
                <h1 className="text-2xl font-bold mb-4">Welcome to OCDLA!</h1>

                <div className="space-y-2">
                    <p>Here's where we explain our purpose to you!</p>

                    <a href="/login">Log In</a>
                    <br />
                    <a href="/logout">Log Out</a>

                </div>
            </div>
        </div>
    )

    // Make this a welcoming home page for users of the app


}
