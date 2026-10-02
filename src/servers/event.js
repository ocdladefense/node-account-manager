import express from "express";
import SalesforceRestApi from "@ocdla/salesforce/SalesforceRestApi.js";

const router = express.Router();

router.post("/event/recommendations", async (req, res) => {

    const instanceUrl = req.cookies.instance_url;
    const accessToken = req.cookies.access_token;

    const client = new SalesforceRestApi(
        instanceUrl,
        accessToken
    );

    const { contactIds, eventId } = req.body;




    // ===============================================================================================================================
    // Contact Salesforce query
    // ===============================================================================================================================

    const contactIdList = contactIds.map(contactId => `'${contactId}'`).join(",");

    const contactQuery = `SELECT Id, Name, Ocdla_Current_Member_Flag__c, Ocdla_Member_Status__c FROM Contact WHERE Id IN (${contactIdList})`;

    const contactResp = await client.query(contactQuery);

    console.log("RECOMMENDATION CONTACTS:", contactResp.records);

    // ===============================================================================================================================





    // ===============================================================================================================================
    // Product Salesforce query
    // ===============================================================================================================================

    const productQuery = `SELECT Id, Name, Event__c, ClickpdxCatalog__IsMembersOnly__c, OcdlaEligibleMemberStatuses__c FROM Product2 WHERE Event__c = '${eventId}' AND IsActive = TRUE AND IsAddOn__c = FALSE`;

    const productResp = await client.query(productQuery);

    console.log("RECOMMENDATION PRODUCTS:", productResp.records);

    // ===============================================================================================================================


    const recommendations = new Map();

    const memberProduct = productResp.records.find(product => product.ClickpdxCatalog__IsMembersOnly__c === true)
    const nonMemberProduct = productResp.records.find(product => product.ClickpdxCatalog__IsMembersOnly__c === false);

    contactResp.records.forEach((contact) => {

        const recommendedProduct = contact.Ocdla_Current_Member_Flag__c ? memberProduct : nonMemberProduct;

        recommendations.set(contact.Id, recommendedProduct.Id);
    });

    return res.json({ recommendations: Object.fromEntries(recommendations) });
});

export default router;
