import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { getCookie } from '@ocdla/salesforce/CookieUtils';
import { CautionButton } from '../ui/Button';
import Button from "../ui/Button";

/* TODO:
- SubscriptionsWidget
  - update query for products to use correct field and/or table names
  - update query for owned products to use correct field and/or table names

- SubscriptionCard
  - make "subscribe" button create order and open payment modal
  - make "More Information" button open product information page

- create product information page or pop up
*/

export function SubscriptionsWidget(){
    const [products, setProducts] = useState([]);
    const [owned, setOwned] = useState([]);
    const userId = getCookie("user_id");
    let { client } = useOutletContext();

    const getSubscriptions = async () => {

        const productQuery = //fix query field and/or table names
            `
            SELECT
                Id,
                Name,
                Price,
                Description,
                link
            FROM 
                products p
            WHERE
                p.IsAddOn__c = true
                AND p.Family = 'MEMBERSHIP_ADDON';
            `

        const resp = await client.query(productQuery);
        //setProducts(resp.records);
        setProducts([]);
    }

    const getOwnedSubs = async () => {
        
        const ownedQuery = //fix query field and/or table names
            `SELECT
                p.Id
            FROM Orders o
                JOIN OrderItems oi
                    ON o.id = oi.id
                JOIN products p
                    ON oi.productId = p.id
            WHERE
                o.ContactId__c = '${userId}'
                AND p.IsAddOn__c = true
                AND p.Family = 'MEMBERSHIP_ADDON';
            `

        const resp = await client.query(ownedQuery);
        //setOwned(resp.records);
        setOwned([]);
    }

    useEffect(() => {
        getSubscriptions();
        getOwnedSubs();        
    }, []);

    useEffect(() => {
        // sort products by owned first
        setProducts([...products].sort((a, b) => {
            const aOwned = owned.includes(a.id);
            const bOwned = owned.includes(b.id);

            return bOwned - aOwned;
        }));
    }, [owned]);

    return(
        <div>
            <h1 className="mt-8 text-2xl font-bold mb-4">Add to your membership</h1>

            <div className="flex flex-wrap gap-6 mt-6">

                {
                    products.map(
                        (sub) => <SubscriptionCard key={sub.id} subscription={sub} isOwned={owned.includes(sub.id)} />
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
        <div className={`card bg-base-100 card-md shadow-sm w-96 ${className}`} >
            <div className={`card-body border-b-2 ${isOwned ? " border-[rgba(87,120,230,1)]" : "border-black"}`} >

                <h2 className="card-title">{title}</h2>

                <p>{description}</p>
                <p>${price}</p>

                {subscription.id != null && (
                    <>
                        <Button label="More Information" action={getMoreInfo} />

                        {isOwned ? (
                            <Button label="Open" action={handleSubmit} />
                        ) : (
                            <CautionButton label="Subscribe" action={handleSubmit} />
                        )}
                    </>
                )}

            </div>
        </div>
    );
}
