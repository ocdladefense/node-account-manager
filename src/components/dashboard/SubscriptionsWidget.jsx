import { useState, useEffect } from 'react';
import { useOutletContext } from "react-router-dom";
import { getCookie } from '@ocdla/salesforce/CookieUtils';
import Card  from "../ui/Card";

export function SubscriptionsWidget(){
    
    let { client } = useOutletContext();
    let [contacts, setContacts] = useState([]);
    let userId = getCookie("user_id");

    return(
        <div>
            <h1 className="mt-8 text-2xl font-bold mb-4">Add to your membership</h1>

            <div className="flex flex-wrap gap-6 mt-6">

                <Card
                    title="Medium Card" description="A card component has a figure, a body part, and inside body there are title and actions parts"
                    actions={<button className="btn btn-primary">Subscribe</button>}
                />

                <Card
                    title="Medium Card" description="A card component has a figure, a body part, and inside body there are title and actions parts"
                    actions={<button className="btn btn-primary">Subscribe</button>}
                />

            </div>
        </div >
    )
}
