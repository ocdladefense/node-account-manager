import express from "express";
import SalesforceRestApi from "@ocdla/salesforce/SalesforceRestApi.js";

const router = express.Router();

function buildQuery(name, cookies, eventId) {

    if (name == "event-products")
    {
        return `SELECT Id, Name, CreatedDate, IsActive, IsAddOn__c, Event__c, Event__r.Name, Event__r.Start_Date__c, Description FROM Product2 WHERE Event__c = '${eventId}' AND IsActive = true AND IsAddOn__c = false ORDER BY CreatedDate DESC LIMIT 5`;
    }
    else if (name == "account-contacts")
    {
        let accountId = cookies.account_id;
        return `SELECT Id, Name, Email, Ocdla_Member_Status__c, Ocdla_Membership_Expiration_Date__c FROM Contact WHERE AccountId = '${accountId}'`;

    }
    else if (name == "events")
    {
        return "SELECT Id, Name, Start_Date__c, Description__c FROM Event__c ORDER BY Start_Date__c DESC LIMIT 5";
    }
}

router.get("/api/query/:type", async (req, res) => {
    const instanceUrl = req.cookies.instance_url;
    const accessToken = req.cookies.access_token;

    if (!instanceUrl || !accessToken)
    {
        return res.status(401).json({
            error: "You must be logged in."
        });
    }

    const client = new SalesforceRestApi(
        instanceUrl,
        accessToken
    );

    const query = buildQuery(req.params.type, req.cookies, "a23hr0000008WKTAA2");

    const resp = await client.query(query);

    if (!resp.records)
    {
        console.error(
            "Event products Salesforce response:",
            resp
        );

        return res.status(502).json({
            error: "Unable to retrieve event products."
        });
    }

    return res.json({
        records: resp.records
    });
});

export default router;
