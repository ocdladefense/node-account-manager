import express from "express";
import SalesforceRestApi from "@ocdla/salesforce/SalesforceRestApi.js";

const router = express.Router();

function buildQuery(name, cookies, eventId, productIds) {

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
    else if (name == "subs"){
        return `SELECT Id, Name, ClickpdxCatalog__MemberPrice__c, ClickpdxCatalog__StandardPrice__c, Description, ClickpdxCatalog__DownloadUrl__c, CatalogUrl__c FROM Product2 WHERE IsActive = true AND IsAddOn__c = true AND Family = 'Publications'`
    }
    else if (name == "owned") {
        return `SELECT Product2.Id FROM OrderItem WHERE Contact__c = '${cookies.contact_id}' AND Product2.Id IN(${formatListForSql(productIds)}) AND Order.StatusCode != 'Draft'`
    }
}

function formatListForSql(array){
    return array.map((item) => {
        return `'${item}'`;
    }).join(",");
};

router.get("/api/query/:type", async (req, res) => {
    const instanceUrl = req.cookies.instance_url;
    const accessToken = req.cookies.access_token;
    const eventId = req.query?.eventId;
    const productIds = req.query?.ids?.split(",");
    

    if (!instanceUrl || !accessToken) {
        return res.status(401).json({
            error: "You must be logged in."
        });
    }

    const client = new SalesforceRestApi(
        instanceUrl,
        accessToken
    );

    const query = buildQuery(req.params.type, req.cookies, eventId, productIds);

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

    if (req.params.type == "owned"){
        let ownedIds = resp.records.map((rec) => rec.Product2.Id);
        records = productIds.map((id) => {
            return {
                Id: id,
                Owned: ownedIds.includes(id)
            }
        });
    }



    return res.json({
        records: records
    });
});

export default router;
