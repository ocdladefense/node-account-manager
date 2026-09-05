import { useState, useEffect, Pressable } from 'react';
import { useOutletContext } from "react-router-dom";
import { getCookie } from '@ocdla/salesforce/CookieUtils';
import { CautionButton } from '../ui/Button';
import Button from "../ui/Button";


/* TODO:
- SubscriptionsWidget
  - update query for products to use correct field and/or table names
    - add link field to product2 object
  - update query for owned products to use correct field and/or table names

- SubscriptionCard
  - make "subscribe" button create order and open payment modal
  - make "More Information" button open SubscriptionPopUp

- SubscriptionPopUp
  - add style to the pop up
  - somehow use the useModal in homepage.jsx to show pop up?
  - use absolute position style to make pop up?
*/

export function SubscriptionsWidget({ subscribeHandler }){
    const [products, setProducts] = useState([]);
    const [owned, setOwned] = useState([]);
    const userId = getCookie("user_id");
    let { client } = useOutletContext();

    const getSubscriptions = async () => {

        const productQuery = //fix query field and/or table names - add link field to product2 object
            `
            SELECT
                ExternalId,
                Name,
                ClickpdxCatalog__MemberPrice__c,
                Description
            FROM
                Product2
            WHERE
                IsActive = true
                AND IsAddOn__c = true
                AND Family = 'Membership'
            `

        const resp = await client.query(productQuery);
        setProducts(resp.records);
    }

    const getOwnedSubs = async () => {
        
        const ownedQuery = //fix query field and/or table names
            `SELECT
                Product2.ExternalId
            FROM
                OrderItem
            WHERE
                ContactId__c = '${userId}'
                AND Product2.IsAddOn__c = true
                AND Product2.Family = 'Membership'
            `

        const resp = await client.query(ownedQuery);
        setOwned(resp.records);
    }

    useEffect(() => {
        // getSubscriptions();
        // getOwnedSubs();

        setOwned(["ADDON-BO","ADDON-CLFB"]);
        setProducts([
            {
                title: "Books Online",
                description: "books online membership addon",
                price: 123.45,
                id: "ADDON-BO",
                link: "https://bon.ocdla.org",
                IsAddOn__c: true,
                Family: "MEMBERSHIP_ADDON"
            },
            {
                title: "Continuing Legal Education media player",
                description: "continuing legal education membership addon",
                price: 123.45,
                id: "ADDON-CLE",
                link: "https://media.ocdla.org",
                IsAddOn__c: true,
                Family: "MEMBERSHIP_ADDON"
            },
            {
                title: "Criminal Law Form Book",
                description: "Criminal Law Form Book membership addon",
                price: 123.45,
                id: "ADDON-CLFB",
                link: "https://bondev.ocdla.org/formbook/1",
                IsAddOn__c: true,
                Family: "MEMBERSHIP_ADDON"
            }
        ]);

    }, []);

    const sortedProducts = [...products].sort((a, b) => {
        const aOwned = owned.includes(a.id);
        const bOwned = owned.includes(b.id);

        return bOwned - aOwned;
    });

    return (
        <div>
            <h1 className="mt-8 text-2xl font-bold mb-4">Add to your membership</h1>

            <div className="flex flex-wrap gap-6 mt-6">

                {
                    sortedProducts.map(
                        (sub) => <SubscriptionCard key={sub.id} subscription={sub} isOwned={owned.includes(sub.id)} subscribeHandler={subscribeHandler} />
                    )
                }

            </div>

        </div >
    )
}

/**
 * @param {object} subscription - an object containing information about the subscription including title, description, price, id, and a link
 * @param {boolean} [isOwned] - if the subscription is owned by the currently logged in user
 * @param {string} [className] - html classNames to be used with tailwind for to style the object
 * @param {function} subscribeHandler - the function called when subscribe button is clicked
 * @returns {html}
 */
function SubscriptionCard({ subscription = {}, isOwned = false, className = '', subscribeHandler }) {
    const title = subscription.title || "Error: no title";
    const description = subscription.description || "Error: no description";
    const price = subscription.price || "";

    const handleSubmit = () => {
        if (isOwned) { window.open(subscription.link || "") }
        else {
            subscribeHandler({
                Id: subscription.id,
                Name: subscription.title,
            });
        }
    };

    const getMoreInfo = () => {

    };

    return (
        <div className={`card bg-base-100 card-md shadow-sm w-96 ${className}`} >
            <div className={`card-body border-b-2 ${isOwned ? " border-[rgba(87,120,230,1)]" : "border-black"}`} >

                <h2 className="card-title">{title}</h2>

                <p>{description}</p>
                <p>${price}</p>

                {subscription.id != null && (
                    <div className="flex mx-auto">
                        <Button label="More Information" size="px-6 py-2 w-fit min-w-45" action={getMoreInfo} />

                        {isOwned ? (
                            <Button label="Open" size="px-6 py-2 w-fit" action={handleSubmit} />
                        ) : (
                            <CautionButton label="Subscribe" size="px-6 py-2 w-fit" action={handleSubmit} />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * @param {object} subscription - an object containing information about the subscription including title, description and price
 * @param {function} onClose - the function that is called by the close button
 * @returns {html}
 */
function SubscriptionPopUp({ subscription, onClose }){
    return(
        <div> 
            <p> {subscription.title} </p> 
            <p> {subscription.description} </p> 
            <p> ${subscription.price} </p> 
            <Pressable onPress={() => onClose} > 
                <Text>Close</Text> 
            </Pressable>
        </div>
    );
}
