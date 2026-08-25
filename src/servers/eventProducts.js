import express from "express";
import SalesforceRestApi from "@ocdla/salesforce/SalesforceRestApi.js";

const router = express.Router();

router.get("/api/event-products", async (req, res) => {
    try {
        const instanceUrl = req.cookies.instance_url;
        const accessToken = req.cookies.access_token;

        if (!instanceUrl || !accessToken) {
            return res.status(401).json({
                error: "You must be logged in."
            });
        }

        const client = new SalesforceRestApi(
            instanceUrl,
            accessToken
        );

        const eventProductsQuery = `SELECT Id, Name, CreatedDate, IsActive, IsAddOn__c, Event__c, Event__r.Name, Event__r.Start_Date__c, Description FROM Product2 WHERE Event__c != null AND IsActive = true AND IsAddOn__c = false ORDER BY CreatedDate DESC LIMIT 5`;

        const productsResponse = await client.query(eventProductsQuery);

        if (!productsResponse.records) {
            console.error(
                "Event products Salesforce response:",
                productsResponse
            );

            return res.status(502).json({
                error: "Unable to retrieve event products."
            });
        }

        const eventProducts = productsResponse.records.map((product) => ({
            id: product.Id,
            name: product.Name,
            date: product.Event__r?.Start_Date__c ?? null,
            description: product.Description ?? null
        }));

        return res.json({
            eventProducts
        });

    } catch (error) {
        console.error("EVENT PRODUCTS ROUTE ERROR:", error);

        return res.status(500).json({
            error: "Unable to retrieve event products."
        });
    }
});

export default router;
