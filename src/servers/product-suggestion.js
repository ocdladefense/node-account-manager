import express from "express";
import SalesforceRestApi from "@ocdla/salesforce/SalesforceRestApi.js";

const router = express.Router();


router.post("/product-suggestions", async (req, res) => {

    const _suggest = new Map();

    const instanceUrl = req.cookies.instance_url;
    const accessToken = req.cookies.access_token;

    const { contactIds, eventId } = req.body;

    if (!instanceUrl || !accessToken) {
        return res.status(401).json({
            error: "You must be logged in."
        });
    }

    const client = new SalesforceRestApi(
        instanceUrl,
        accessToken
    );



    const contactQuery = formatContactQuery(contactIds);

    const contactResp = await client.query(contactQuery);

    const contacts = contactResp.records;




    const productQuery = formatProductQuery(eventId);

    const productResp = await client.query(productQuery);

    const products = productResp.records;



    let algorithms = [selectBestProductByMemberStatus, selectBestProductByIsMember, oneTicketAlgorithm];



    const recommendations = {};

    contacts.forEach(contact => {

        const suggestion = algorithms.map(fn => fn(contact, products)).find(result => !!result);

        if (!suggestion) {
            recommendations[contact.Id] = null;
            return;
        }


        recommendations[contact.Id] = {
            productId: suggestion.Id,
            price: calculatedPrice
        };
    });


    return res.json({
        records: products,
        recommendations: recommendations
    });

});




function formatContactQuery(ids) {
    const idList = ids.map(id => `'${id}'`).join(",");
    return `SELECT Id, Name, Ocdla_Current_Member_Flag__c, Ocdla_Member_Status__c FROM Contact WHERE Id IN (${idList})`;
}



function formatProductQuery(eventId) {
    return `SELECT Id, Name, Event__c, Event__r.Early_Bird_End_Date__c, ClickpdxCatalog__IsMembersOnly__c, OcdlaEligibleMemberStatuses__c, ClickpdxCatalog__StandardPrice__c, ClickpdxCatalog__MemberPrice__c, EarlyBirdPrice__c FROM Product2 WHERE Event__c = '${eventId}' AND IsActive = True AND IsAddOn__c = False`;
}



// ===============================================================================================================
// ==================      The Algorithms       ==================================================================
// ===============================================================================================================

function selectBestProductByIsMember(contact, products) {

    const memberProduct = products.find(product => product.ClickpdxCatalog__IsMembersOnly__c === true && !product.OcdlaEligibleMemberStatuses__c);

    const nonMemberProduct = products.find(product => product.ClickpdxCatalog__IsMembersOnly__c === false && !product.OcdlaEligibleMemberStatuses__c);

    return contact.Ocdla_Current_Member_Flag__c ? memberProduct : nonMemberProduct;
}



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



// This was just proof of concept. Don't do this.
function selectBestProductRandomly(contact, products, index) {

    let rand = Math.floor(Math.random() * products.length);

    return products[rand];
}




// Old code for reuse in this file.
// function fubar() {
//         const contactQuery = formatContactQuery(contactIds);

//         const contactResp = await client.query(contactQuery);

//         const contacts = contactResp.records;

//         let algorithms = [selectBestProductByMemberStatus, selectBestProductByIsMember, oneTicketAlgorithm];

//         const recommendations = {};

//         contacts.forEach(contact => {

//             const suggestion = algorithms.map(fn => fn(contact, records)).find(result => !!result);

//             if (!suggestion) {
//                 recommendations[contact.Id] = null;
//                 return;
//             }

//             const calculatedPrice = calculateProductPrice(suggestion, contact,
//             );

//             recommendations[contact.Id] = {
//                 productId: suggestion.Id,
//                 price: calculatedPrice
//             };
//         });



//         return res.json({
//             records: records,
//             recommendations: recommendations
//         });
//     });












export default router;
