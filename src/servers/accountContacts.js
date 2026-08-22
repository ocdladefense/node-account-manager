import express from "express";
import SalesforceRestApi from "@ocdla/salesforce/SalesforceRestApi.js";

const router = express.Router();


// create a router that uses the current session to retrieve data needed for the account contacts page
router.get("/api/account/contacts", async (req, res) => {
    try {
        const instanceUrl = req.cookies.instance_url;
        const accessToken = req.cookies.access_token;
        const accountId = req.cookies.account_id;

        // check if the user is logged in
        if (!instanceUrl || !accessToken) {
            return res.status(401).json({
                error: "You must be logged in."
            });
        }

        // make sure the account_id made it through
        if (!accountId) {
            return res.status(400).json({
                error: "Account ID is missing."
            });
        }

        // validate the salesforce id
        if (!/^[a-zA-Z0-9]{15}([a-zA-Z0-9]{3})?$/.test(accountId)) {
            return res.status(400).json({
                error: "Invalid account ID."
            });
        }

        // instantiate client
        const client = new SalesforceRestApi(
            instanceUrl,
            accessToken
        );


        // queries moved out of client
        const contactsQuery = `
            SELECT
                Id,
                Name,
                Email,
                Ocdla_Member_Status__c,
                Ocdla_Membership_Expiration_Date__c
            FROM Contact
            WHERE AccountId = '${accountId}'
        `;

        const eventProductsQuery = `
            SELECT
                Id,
                Name,
                CreatedDate
            FROM Product2
            WHERE Event__c != null
            AND IsActive = true
            ORDER BY CreatedDate DESC
            LIMIT 5
        `;


        // fire the queries and store the data once it's returned
        const contactsResponse = await client.query(contactsQuery);
        const productsResponse = await client.query(eventProductsQuery);


        // check for proper return of records
        if (!contactsResponse.records) {
            console.error(
                "Account contacts Salesforce response:",
                contactsResponse
            );

            return res.status(502).json({
                error: "Unable to retrieve account contacts."
            });
        }

        if (!productsResponse.records) {
            console.error(
                "Event products Salesforce response:",
                productsResponse
            );

            return res.status(502).json({
                error: "Unable to retrieve event products."
            });
        }


        // store only the necessary properties of events
        const eventProducts = productsResponse.records.map((product) => ({
            id: product.Id,
            name: product.Name
        }));

        return res.json({
            contacts: contactsResponse.records,
            eventProducts
        });

    } catch (error) {
        console.error("ACCOUNT CONTACTS ROUTE ERROR:", error);

        return res.status(500).json({
            error: "Unable to retrieve account data."
        });
    }
});

export default router;
