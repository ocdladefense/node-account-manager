import { useState, useEffect, Pressable } from 'react';
import { useOutletContext } from "react-router-dom";
import { getCookie } from '@ocdla/salesforce/CookieUtils';
import { CautionButton } from '../ui/Button';
import Button from "../ui/Button";

export function SubscriptionsWidget({ subscribeHandler }){
    const [subs, setSubs] = useState([]);
    const [ownershipStatus, setOwnershipStatus] = useState([]);
    const contactId = getCookie("contact_id");
    let { client } = useOutletContext();

    useEffect(() => {
        const getSubscriptions = async () => {
            try {
                const resp = await fetch("/api/query/subs");
                const data = await resp.json();
                const records = data.records;

                if (!resp.ok) {
                    throw new Error(
                        data.error || "Unable to retrieve events."
                    );
                }

                setSubs(records);
            } catch (error) {
                console.error("Error fetching subscriptions:", error);
            }
        }

        getSubscriptions();
    }, []);

    useEffect(() => {
        const getOwnershipStatus = async (ids) => {
            try {
                const resp = await fetch(`/api/query/owned?ids=${ids}`);
                const data = await resp.json();
                const records = data.records;

                if (!resp.ok) {
                    throw new Error(
                        data.error || "Unable to retrieve events."
                    );
                }

                setOwnershipStatus(records);
            } catch (error) {
                console.error("Error fetching owned:", error);
            }
        }

        let ids = subs.map((sub) => sub.Id).join(",");
        getOwnershipStatus(ids);
    }, [subs])

    const sortedSubs = [...subs].sort((a, b) => {

        const ownershipA = ownershipStatus.find(status => {
            return status.Id === a.Id;
        });

        const ownershipB = ownershipStatus.find(status => {
            return status.Id === b.Id;
        });

        let aOwned = false;
        if (ownershipA) {
            aOwned = ownershipA.Owned;
        }

        let bOwned = false;
        if (ownershipB) {
            bOwned = ownershipB.Owned;
        }

        if (aOwned && !bOwned) {
            return -1;
        }

        if (!aOwned && bOwned) {
            return 1;
        }
        return 0;
    });

    return (
        <div>
            <h1 className="mt-8 text-2xl font-bold mb-4">Add to your membership</h1>

            <div className="flex flex-wrap gap-6 mt-6">

                {
                    sortedSubs.map((sub) => {
                        let ownership = ownershipStatus.filter((item) => {
                            return item.Id == sub.Id;
                        });
                        let ownedItem = ownership[0] || {Owned: false};
                        let isOwned = ownedItem.Owned;
                        return <SubCard key={sub.Id} subscription={sub} isOwned={isOwned} subscribeHandler={subscribeHandler} />
                    }
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
function SubCard({ subscription = {}, isOwned = false, className = '', subscribeHandler }) {
    const title = subscription.Name || "Error: no title";
    const description = subscription.Description || "Error: no description";
    const price = subscription.ClickpdxCatalog__MemberPrice__c || subscription.ClickpdxCatalog__StandardPrice__c || "0.00";

    const handleSubmit = () => {
        if (isOwned) { window.open(subscription.ClickpdxCatalog__DownloadUrl__c || null) }
        else {
            subscribeHandler({
                Id: subscription.Id,
                Name: subscription.Name,
            });
        }
    };

    const getMoreInfo = () => {
        window.open(subscription.CatalogUrl__c || null)
    };

    return (
        <div className={`card bg-base-100 card-md shadow-sm w-96 ${className}`} >
            <div className={`card-body border-b-2 ${isOwned ? " border-[rgba(87,120,230,1)]" : "border-black"}`} >

                <h2 className="card-title">{title}</h2>

                <p>{description}</p>
                {price && <p>${price}</p>}

                {subscription.Id != null && (
                    isOwned ? (
                        <div>
                            <Button
                                label="Open"
                                size="px-6 py-2 w-fit"
                                action={handleSubmit}
                            />
                        </div>
                    ) : (
                        <div className="flex mx-auto">
                            <Button
                                label="More Information"
                                size="px-6 py-2 w-fit min-w-45"
                                action={getMoreInfo}
                            />

                            <CautionButton
                                label="Subscribe"
                                size="px-6 py-2 w-fit"
                                action={handleSubmit}
                            />
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
