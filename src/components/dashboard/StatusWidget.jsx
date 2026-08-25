import { useState, useEffect } from 'react';
import { useOutletContext } from "react-router-dom";
import { getCookie } from '@ocdla/salesforce/CookieUtils';

export function StatusWidget() {

    let { client } = useOutletContext();
    let [contacts, setContacts] = useState([]);
    let userId = getCookie("user_id");

    return (<div> your current status is looking good ദ്ദി(˵⎚ᴗ⎚ ˵ ) ✧</div>)
}
