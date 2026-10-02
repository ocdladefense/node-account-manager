import express from "express";
import SalesforceRestApi from "@ocdla/salesforce/SalesforceRestApi.js";

const router = express.Router();

let client;


router.post("/event/recommendations", async (req, res) => {

    // Populate map with contactId to product suggestions.
    const _suggest = new Map();


    const instanceUrl = req.cookies.instance_url;
    const accessToken = req.cookies.access_token;

    client = new SalesforceRestApi(instanceUrl, accessToken);

    const { contactIds, eventId } = req.body;




    // ===============================================================================================================================
    // Contact Salesforce query
    // ===============================================================================================================================

    let contacts = await fetchContactRecords(contactIds);
    let products = await fetchProductRecords(eventId);


    console.log("RECOMMENDATION CONTACTS:", contacts);
    console.log("RECOMMENDATION PRODUCTS:", products);

    // ===============================================================================================================================






    let suggest = contacts.map((contact) => {

        return [contact.Id, selectBestProductByMembership(contact, products).Id];
    });


    suggest.forEach(([contactId, productId]) => {
        _suggest.set(contactId, productId);
    });



    return res.json({ recommendations: Object.fromEntries(_suggest) });
});



function selectBestProductByMembership(contact, products) {
    const memberProduct = products.find(product => product.ClickpdxCatalog__IsMembersOnly__c === true)
    const nonMemberProduct = products.find(product => product.ClickpdxCatalog__IsMembersOnly__c === false);

    return contact.Ocdla_Current_Member_Flag__c ? memberProduct : nonMemberProduct;
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
    return `SELECT Id, Name, Event__c, ClickpdxCatalog__IsMembersOnly__c, OcdlaEligibleMemberStatuses__c FROM Product2 WHERE Event__c = '${eventId}' AND IsActive = True AND IsAddOn__c = False`;
}

async function fetchProductRecords(eventId) {
    const productQuery = formatProductQuery(eventId);
    let resp = await client.query(productQuery);
    return resp.records;
}






export default router;
