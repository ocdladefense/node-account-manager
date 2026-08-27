import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

// things i might need later
// import { useOutletContext } from "react-router-dom";
// import { getCookie } from '@ocdla/salesforce/CookieUtils';
// let { client } = useOutletContext();
// let [contacts, setContacts] = useState([]);
// let userId = getCookie("user_id");

export function SubscriptionsWidget(){
    

    return(
        <div>
            <h1 className="mt-8 text-2xl font-bold mb-4">Add to your membership</h1>

            <div className="flex flex-wrap gap-6 mt-6">

                <SubscriptionCard
                    title="Medium Card" description="A card component has a figure, a body part, and inside body there are title and actions parts"
                    actions={<button className="btn btn-primary">Subscribe</button>}
                />

                <SubscriptionCard
                    title="Medium Card" description="A card component has a figure, a body part, and inside body there are title and actions parts"
                    actions={<button className="btn btn-primary">Subscribe</button>}
                />

            </div>
        </div >
    )
}

/**
 * 
 * @param {object} subscription - an object containing information about the subscription including title, description, price, id, and a link
 * @param {boolean} [isOwned] - if the subscription is owned by the currently logged in user
 * @param {string} [className] - html classNames to be used with tailwind for to style the object 
 * @returns {html}
 */

function SubscriptionCard({ subscription={}, isOwned = false , className = '' }) {

    const title = subscription.title || "no title";
    const description = subscription.description || "no description";

    const handleSubmit = () => {
        if (isOwned) {window.open(subscription.link || "")}
        else {}//create order
    };

    const getMoreInfo = () => {
        useNavigate(`product/${subscription.id || "undefined"}`)
    };

    return (
        <div className={`card bg-base-100 card-md shadow-sm w-96 ${className}`}>
            <div className="card-body">

                <h2 className="card-title">{title}</h2>

                <p>{description}</p>

                <Button label="More Information" action={getMoreInfo}/>
                <Button label={isOwned ? "Open" : "Subscribe"} action={handleSubmit} />

            </div>
        </div>
    );
}
