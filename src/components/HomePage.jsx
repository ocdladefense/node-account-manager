import { useState, useEffect } from 'react';
import { useOutletContext } from "react-router-dom";
import { getAccountContactsQuery } from './accounts/query';
import { getCookie } from '@ocdla/salesforce/CookieUtils';
import Card from './ui/Card';

export default function HomePage() {

    let { client } = useOutletContext();
    let [contacts, setContacts] = useState([]);
    let userId = getCookie("user_id");


    return (
        <div className="w-full px-8 py-6">
                <h1 className="text-2xl font-bold mb-4">Welcome to OCDLA!</h1>

                <div className="space-y-2">
                    <p>Here's where we explain our purpose to you!</p>
                </div>

                <h1 className="mt-12 text-2xl font-bold mb-4">Upcoming Events</h1>


            <div className="flex flex-wrap gap-6 mt-6">

                <Card
                    title="Medium Card" description="A card component has a figure, a body part, and inside body there are title and actions parts"
                    actions={<button className="btn btn-primary">Register</button>}
                />

                <Card
                    title="Medium Card" description="A card component has a figure, a body part, and inside body there are title and actions parts"
                    actions={<button className="btn btn-primary">Register</button>}
                />

                <Card
                    title="Medium Card" description="A card component has a figure, a body part, and inside body there are title and actions parts"
                    actions={<button className="btn btn-primary">Register</button>}
                />

                <Card
                    title="Medium Card" description="A card component has a figure, a body part, and inside body there are title and actions parts"
                    actions={<button className="btn btn-primary">Register</button>}
                />
            </div>

            <h1 className="mt-10 text-2xl font-bold mb-4">Add to your membership</h1>

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
        </div>
    )

    // Make this a welcoming home page for users of the app


}
