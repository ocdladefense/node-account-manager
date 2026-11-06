import express from "express";
import SalesforceRestApi from "@ocdla/salesforce/SalesforceRestApi.js";
import { getPrices, getStandardPrice, getMemberPrice, getEarlyBirdPrice } from "../../utils/product.js";

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

    client = new SalesforceRestApi(
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

    const instanceUrl = req.cookies.instance_url;
    const accessToken = req.cookies.access_token;

    const params = req.body;

    let prices = await getPrices(params, instanceUrl, accessToken);

    return res.json(prices);

    // } catch (error) {
    //     console.error("Error calculating product price:", error);

    //     return res.status(500).json({
    //         error: "Unable to calculate the selected product's price."
    //     });
    // }
});


export default router;
