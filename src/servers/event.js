import express from "express";
import SalesforceRestApi from "@ocdla/salesforce/SalesforceRestApi.js";

const router = express.Router();

let client;


router.post("/event/recommendations", async (req, res) => {

    // Populate map with contactId to product suggestions.
    const _suggest = new Map();
    const instanceUrl = req.cookies.instance_url;
    const accessToken = req.cookies.access_token;
    const { contactIds, eventId } = req.body;


    client = new SalesforceRestApi(instanceUrl, accessToken);


    let contacts = await fetchContactRecords(contactIds);
    let products = await fetchProductRecords(eventId);

    console.log("RECOMMENDATION CONTACTS:", contacts);
    console.log("RECOMMENDATION PRODUCTS:", products);


    let algorithms = [selectBestProductByMemberStatus, selectBestProductByIsMember, oneTicketAlgorithm];


    let suggest = contacts.map((contact) => {

        let results = algorithms.map(fn => fn(contact, products));

        // let suggestion = results.find(result => !!result);
        // return [contact.Id, suggestion.Id];

        let suggestion = results.find(result => !!result);

        if (!suggestion) {
            console.warn(`No recommended product found for ${contact.Id}`);
            return [contact.Id, null];
        }

        const calculatedPrice = calculateProductPrice(contact, suggestion);

        console.log(
            `CONTACT: ${contact.Name}`,
            `PRODUCT: ${suggestion.Name}`,
            `CALCULATED PRICE: $${calculatedPrice}`
        );

        return [
            contact.Id,
            {
                productId: suggestion.Id,
                price: calculatedPrice
            }
        ];

    });


    suggest.forEach(([contactId, recommendation]) => {

        _suggest.set(contactId, recommendation);

    });

    return res.json(Object.fromEntries(_suggest));
});



router.post("/event/price", async (req, res) => {

    const { contactId, productId, eventId } = req.body;

    if (!contactId || !productId || !eventId) {
        return res.status(400).json({
            error: "Contact ID, product ID, and event ID are required."
        });
    }

    try {
        const instanceUrl = req.cookies.instance_url;
        const accessToken = req.cookies.access_token;

        const apiClient = new SalesforceRestApi(instanceUrl, accessToken);

        const contactResponse = await apiClient.query(
            formatContactQuery([contactId])
        );

        const contact = contactResponse.records?.[0];

        const productResponse = await apiClient.query(
            formatProductQuery(eventId)
        );

        const product = productResponse.records?.find(
            item => item.Id === productId
        );

        if (!contact || !product) {
            return res.status(404).json({
                error: "Contact or event product not found."
            });
        }

        const price = calculateProductPrice(contact, product);

        return res.json({
            productId: product.Id,
            price: price
        });

    } catch (error) {
        console.error("Error calculating product price:", error);

        return res.status(500).json({
            error: "Unable to calculate the selected product's price."
        });
    }
});





// Changed this function so it can't accidentally pick the special status tickets.
function selectBestProductByIsMember(contact, products) {

    const memberProduct = products.find(product => product.ClickpdxCatalog__IsMembersOnly__c === true && !product.OcdlaEligibleMemberStatuses__c);

    const nonMemberProduct = products.find(product => product.ClickpdxCatalog__IsMembersOnly__c === false && !product.OcdlaEligibleMemberStatuses__c);

    return contact.Ocdla_Current_Member_Flag__c ? memberProduct : nonMemberProduct;
}


// If we have a contact who has an "A" status (acedemic status) automatically select a third ticket via "OcdlaEligibleMemberStatuses__c"
// Switch this up. Use new parameters to make this a "filter" rather than the raw assignment.
// Should default to previous filtered product if no applicable product exists for this filter.

// If we have a product that lists one or more eligible statuses, that would be the best choice for members with that status.
function selectBestProductByMemberStatus(contact, products) {

    return products.find(product => {

        if (!product.OcdlaEligibleMemberStatuses__c) {

            return false;

        }

        let eligibleStatuses = product.OcdlaEligibleMemberStatuses__c.split(",");

        let memberStatus = contact.Ocdla_Member_Status__c;

        return eligibleStatuses.includes(memberStatus);

    });
}


function oneTicketAlgorithm(contact, products) {
    if (products.length === 1) {
        return products[0];
    }
}



function calculateProductPrice(contact, product) {

    const standardPrice = product.ClickpdxCatalog__StandardPrice__c;
    const memberPrice = product.ClickpdxCatalog__MemberPrice__c;
    const earlyBirdPrice = product.EarlyBirdPrice__c;

    const earlyBirdEndDate = product.Event__r?.Early_Bird_End_Date__c;

    // Yes, I totally let AI write this value for me lol
    const currentDate = new Date().toISOString().split("T")[0];

    // Special membership-status tickets use their own pricing.
    if (product.OcdlaEligibleMemberStatuses__c) {
        return standardPrice;
    }

    // Apply early-bird pricing if within the appropriate timeframe.
    if (
        earlyBirdEndDate &&
        currentDate <= earlyBirdEndDate &&
        earlyBirdPrice != null
    ) {
        return earlyBirdPrice;
    }

    // Apply member pricing when available.
    if (
        contact.Ocdla_Current_Member_Flag__c &&
        memberPrice != null
    ) {
        return memberPrice;
    }

    // Otherwise, use the standard price.
    return standardPrice;
}



// This was just proof of concept. Don't do this.
function selectBestProductRandomly(contact, products, index) {

    let rand = Math.floor(Math.random() * products.length);

    return products[rand];
}


function formatContactQuery(ids) {
    const idList = ids.map(id => `'${id}'`).join(",");
    return `SELECT Id, Name, Ocdla_Current_Member_Flag__c, Ocdla_Member_Status__c FROM Contact WHERE Id IN (${idList})`;
}


async function fetchContactRecords(contactIds) {
    const contactQuery = formatContactQuery(contactIds);
    let resp = await client.query(contactQuery);
    return resp.records;
}


// Do same thing with product records
function formatProductQuery(eventId) {
    return `SELECT Id, Name, Event__c, Event__r.Early_Bird_End_Date__c, ClickpdxCatalog__IsMembersOnly__c, OcdlaEligibleMemberStatuses__c, ClickpdxCatalog__StandardPrice__c, ClickpdxCatalog__MemberPrice__c, EarlyBirdPrice__c FROM Product2 WHERE Event__c = '${eventId}' AND IsActive = True AND IsAddOn__c = False`;
}


async function fetchProductRecords(eventId) {
    const productQuery = formatProductQuery(eventId);
    let resp = await client.query(productQuery);
    return resp.records;
}



export default router;
