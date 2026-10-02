import express from "express";
import SalesforceRestApi from "@ocdla/salesforce/SalesforceRestApi.js";

const router = express.Router();

let client;


router.post("/event/recommendations", async (req, res) => {

    // Populate map with contactId to product suggestions.
    const recommendations = new Map();


    const instanceUrl = req.cookies.instance_url;
    const accessToken = req.cookies.access_token;

    client = new SalesforceRestApi(instanceUrl, accessToken);

    const { contactIds, eventId } = req.body;




    // ===============================================================================================================================
    // Contact Salesforce query
    // ===============================================================================================================================

    let contactRecords = await fetchContactRecords(contactIds);
    let productRecords = await fetchProductRecords(eventId);



    console.log("RECOMMENDATION CONTACTS:", contactRecords);

    // ===============================================================================================================================





    // ===============================================================================================================================
    // Product Salesforce query
    // ===============================================================================================================================


    console.log("RECOMMENDATION PRODUCTS:", productRRecords);

    // ===============================================================================================================================




    const memberProduct = productResp.records.find(product => product.ClickpdxCatalog__IsMembersOnly__c === true)
    const nonMemberProduct = productResp.records.find(product => product.ClickpdxCatalog__IsMembersOnly__c === false);

    contactRecords.forEach((contact) => {

        const recommendedProduct = contact.Ocdla_Current_Member_Flag__c ? memberProduct : nonMemberProduct;

        recommendations.set(contact.Id, recommendedProduct.Id);
    });

    return res.json({ recommendations: Object.fromEntries(recommendations) });
});




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
