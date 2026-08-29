import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

// things i might need later
// import { useOutletContext } from "react-router-dom";
// import { getCookie } from '@ocdla/salesforce/CookieUtils';
// let { client } = useOutletContext();
// let [contacts, setContacts] = useState([]);
// let userId = getCookie("user_id");


/*
TODO:
1. add products to sandbox
2. flag products as "IsAddOn__c" in and put in same product family
3. query products for those two properties
4. ask joseph what how his buttons work and modal work flow
5. subscribe button "does what joseph's buttons do"
*/

export function SubscriptionsWidget(){
    
    const getSubscriptions = () => {
        return [
            {
                title:"Books Online",
                description:"books online membership addon",
                price:123.45,
                id:"ADDON-BO",
                link:"https://bon.ocdla.org"
            },
            {
                title: "Continuing Legal Education media player",
                description: "continuing legal education membership addon",
                price: 123.45,
                id: "ADDON-CLE",
                link: "https://media.ocdla.org"
            },
            {
                title: "Criminal Law Form Book",
                description: "Criminal Law Form Book membership addon",
                price: 123.45,
                id: "ADDON-CLFB",
                link: "https://bondev.ocdla.org/formbook/1"
            }
        ];
    }

    const getOwnedSubs = () => {
        return [
            "ADDON-BO",
            "ADDON-CLFB"
        ];
    }

    const subscriptions = getSubscriptions(); 
    const owned = getOwnedSubs();

    return(
        <div>
            <h1 className="mt-8 text-2xl font-bold mb-4">Add to your membership</h1>

            <div className="flex flex-wrap gap-6 mt-6">

                {
                    subscriptions.map(
                        (sub) => {
                            const isOwned = owned.includes(sub.id);
                            return <SubscriptionCard key={sub.id} subscription={sub} isOwned={isOwned} />
                        }
                    )
                }

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
    const title = subscription.title || "Error: no title";
    const description = subscription.description || "Error: no description";
    const price = subscription.price || "";

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
                <p>${price}</p>

                {subscription.id && <Button label="More Information" action={getMoreInfo}/> }
                {subscription.id && <Button label={isOwned ? "Open" : "Subscribe"} action={handleSubmit} /> }

            </div>
        </div>
    );
}
