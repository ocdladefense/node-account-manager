import express from "express";
import SalesforceRestApi from "@ocdla/salesforce/SalesforceRestApi.js";

const router = express.Router();

function buildQuery(name, cookies, eventId) {

    if (name == "event-products") {
        return `SELECT Id, Name, CreatedDate, IsActive, IsAddOn__c, Event__c, Event__r.Name, Event__r.Start_Date__c, Description, ClickpdxCatalog__StandardPrice__c FROM Product2 WHERE Event__c = '${eventId}' AND IsActive = True AND IsAddOn__c = False`;
    }
    else if (name == "account-contacts") {
        let accountId = cookies.account_id;
        return `SELECT Id, Name, Email, Ocdla_Member_Status__c, Ocdla_Membership_Expiration_Date__c FROM Contact WHERE AccountId = '${accountId}'`;

    }
    else if (name == "events") {
        return "SELECT Id, Name, Start_Date__c, Description__c FROM Event__c WHERE Is_Active__c = True AND Start_Date__c >= TODAY ORDER BY Start_Date__c ASC LIMIT 5";
    }
}

router.get("/api/query/:type", async (req, res) => {
    const instanceUrl = req.cookies.instance_url;
    const accessToken = req.cookies.access_token;
    const eventId = req.query.eventId;

    if (!instanceUrl || !accessToken) {
        return res.status(401).json({
            error: "You must be logged in."
        });
    }

    const client = new SalesforceRestApi(
        instanceUrl,
        accessToken
    );

    const query = buildQuery(req.params.type, req.cookies, eventId);

    const resp = await client.query(query);

    if (!resp.records) {
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
