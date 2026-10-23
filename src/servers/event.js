import express from "express";
import SalesforceRestApi from "@ocdla/salesforce/SalesforceRestApi.js";

const router = express.Router();

let client;


// this route needs to return the id, name, and price of product
router.post("/event-products", async (req, res) => {

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

    const query = `SELECT Id, Name, CreatedDate, IsActive, IsAddOn__c, Event__c, Event__r.Name, Event__r.Start_Date__c, Event__r.Early_Bird_End_Date__c, Description, ClickpdxCatalog__StandardPrice__c, ClickpdxCatalog__MemberPrice__c, EarlyBirdPrice__c, ClickpdxCatalog__IsMembersOnly__c, OcdlaEligibleMemberStatuses__c FROM Product2 WHERE Event__c = '${eventId}' AND IsActive = True AND IsAddOn__c = False`;

    const resp = await client.query(query);
    let records = [];

    if (!resp.records) {
        console.error(
            "Event products Salesforce response:",
            resp
        );

        return res.status(502).json({
            error: "Unable to retrieve data."
        });
    } else {
        records = resp.records;
    }


    let theData = records.map((product) => {
        return {
            Id: product.Id,
            Name: product.Name,
            Price: getStandardPrice(product),
            MemberPrice: getMemberPrice(product),
            EarlyBirdPrice: getEarlyBirdPrice(product)
        }
    });

    return res.json({
        records: theData
    });
});






router.post("/event/price", async (req, res) => {

    const { contactId, productId } = req.body;

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





function getStandardPrice(product) {
    return product.ClickpdxCatalog__StandardPrice__c;
}


function getMemberPrice(product) {

    let price;

    if (product.isMembersOnly) {
        price = product.ClickpdxCatalog__StandardPrice__c;
    }

    else if (!product.isMembersOnly && product.ClickpdxCatalog__MemberPrice__c) {
        price = product.ClickpdxCatalog__MemberPrice__c;
    }

    else {
        price = product.ClickpdxCatalog__StandardPrice__c;
    }


    return price;
}



function getEarlyBirdPrice(product) {

    const earlyBirdPrice = product.EarlyBirdPrice__c;

    if (!earlyBirdPrice) {
        return null;
    }

    return earlyBirdPrice;
}

function isBeforeEarlyBirdEndDate(product) {

    const currentDate = new Date().toISOString().split("T")[0];

    const earlyBirdEndDate = product.Event__r?.Early_Bird_End_Date__c;

    if (earlyBirdEndDate && currentDate <= earlyBirdEndDate) {
        return true;
    }

    return false;
}



function formatContactQuery(ids) {
    const idList = ids.map(id => `'${id}'`).join(",");
    return `SELECT Id, Name, Ocdla_Current_Member_Flag__c, Ocdla_Member_Status__c FROM Contact WHERE Id IN (${idList})`;
}


// Do same thing with product records
function formatProductQuery(eventId) {
    return `SELECT Id, Name, Event__c, Event__r.Early_Bird_End_Date__c, ClickpdxCatalog__IsMembersOnly__c, OcdlaEligibleMemberStatuses__c, ClickpdxCatalog__StandardPrice__c, ClickpdxCatalog__MemberPrice__c, EarlyBirdPrice__c FROM Product2 WHERE Event__c = '${eventId}' AND IsActive = True AND IsAddOn__c = False`;
}



// gets us the price if they buy it now
function getSuggestedPrice(product, contact, useEarlyBird = true) {

    const standardPrice = getStandardPrice(product);
    const memberPrice = getMemberPrice(product);
    const earlyBirdPrice = getEarlyBirdPrice(product);

    if (useEarlyBird && earlyBirdPrice && isBeforeEarlyBirdEndDate(product)) {
        return earlyBirdPrice;
    }
    else if (true) {
        return memberPrice;
    }

    return standardPrice;
}



export default router;
