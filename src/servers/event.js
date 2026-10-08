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


    // Ultimately, we want to use multiple, weighted algorithms.
    // Run select by IsMember THEN by MemberStatus



    // This was just proof of concept. Don't do this.
    let algo1 = selectBestProductRandomly;


    let algo2 = selectBestProductByIsMember;
    let algo3 = selectBestProductByMemberStatus;


    let suggest = contacts.map((contact) => {
        let product = algo2(contact, products);
        // Run additional algorithm ordered by weight
        product = algo3(contact, products, product);
        return [contact.Id, product.Id];
    });


    suggest.forEach(([contactId, productId]) => {
        _suggest.set(contactId, productId);
    });



    return res.json(Object.fromEntries(_suggest));
});



function selectBestProductByIsMember(contact, products, index) {
    const memberProduct = products.find(product => product.ClickpdxCatalog__IsMembersOnly__c === true);
    const nonMemberProduct = products.find(product => product.ClickpdxCatalog__IsMembersOnly__c === false);

    return contact.Ocdla_Current_Member_Flag__c ? memberProduct : nonMemberProduct;
}


// If we have a contact who has an "A" status (acedemic status) automatically select a third ticket via "OcdlaEligibleMemberStatuses__c"
// Switch this up. Use new parameters to make this a "filter" rather than the raw assignment.
// Should default to previous filtered product if no applicable product exists for this filter.
function selectBestProductByMemberStatus(contact, products, currentProduct) {
    if (contact.Ocdla_Member_Status__c !== "A") {
        return currentProduct;
    }

    const lawStudentProduct = products.find(product => product.OcdlaEligibleMemberStatuses__c === "A");

    return lawStudentProduct || currentProduct;
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
    return `SELECT Id, Name, Event__c, ClickpdxCatalog__IsMembersOnly__c, OcdlaEligibleMemberStatuses__c FROM Product2 WHERE Event__c = '${eventId}' AND IsActive = True AND IsAddOn__c = False`;
}

async function fetchProductRecords(eventId) {
    const productQuery = formatProductQuery(eventId);
    let resp = await client.query(productQuery);
    return resp.records;
}






export default router;
