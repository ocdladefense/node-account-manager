import express from "express";
import SalesforceRestApi from "@ocdla/salesforce/SalesforceRestApi.js";
import { getPrices } from "../utils/product.js";
import { formatTicketQuery, formatContactQuery } from "../utils/query.js";
const router = express.Router();





router.post("/product-suggestions", async (req, res) => {


    const instanceUrl = req.cookies.instance_url;
    const accessToken = req.cookies.access_token;

    const { contactIds, eventId } = req.body;

    if (!instanceUrl || !accessToken)
    {
        return res.status(401).json({
            error: "You must be logged in."
        });
    }

    let client = new SalesforceRestApi(
        instanceUrl,
        accessToken
    );



    const contactQuery = formatContactQuery(contactIds);

    const contactResp = await client.query(contactQuery);

    const contacts = contactResp.records;




    const productQuery = formatTicketQuery(eventId);

    const productResp = await client.query(productQuery);

    const products = productResp.records;



    let algorithms = [selectBestProductByMemberStatus, selectBestProductByIsMember, oneTicketAlgorithm];



    let recommendations = [];

    contacts.forEach(contact => {

        const suggestion = algorithms.map(fn => fn(contact, products)).find(result => !!result);

        if (!suggestion)
        {
            recommendations[contact.Id] = null;
            return;
        }

        let rec = {
            contactId: contact.Id,
            productId: suggestion.Id
        };

        recommendations.push(rec);

    });

    let prices = await getPrices(recommendations, instanceUrl, accessToken);

    return res.json(prices);

});




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

        if (!product.OcdlaEligibleMemberStatuses__c)
        {

            return false;

        }

        let eligibleStatuses = product.OcdlaEligibleMemberStatuses__c.split(",");

        let memberStatus = contact.Ocdla_Member_Status__c;

        return eligibleStatuses.includes(memberStatus);

    });
}



function oneTicketAlgorithm(contact, products) {
    if (products.length === 1)
    {
        return products[0];
    }
}



// This was just proof of concept. Don't do this.
function selectBestProductRandomly(contact, products, index) {

    let rand = Math.floor(Math.random() * products.length);

    return products[rand];
}



export default router;
