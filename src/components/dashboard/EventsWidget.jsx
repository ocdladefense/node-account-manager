import { useState, useEffect } from 'react';
import { useOutletContext } from "react-router-dom";
import { getCookie } from '@ocdla/salesforce/CookieUtils';

export function EventsWidget() {

    let { client } = useOutletContext();
    let [contacts, setContacts] = useState([]);
    let userId = getCookie("user_id");

    return (
        <h1 className="mt-12 text-2xl font-bold mb-4">Upcoming Events</h1>
    )
}
