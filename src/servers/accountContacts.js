import express from "express";
import SalesforceRestApi from "@ocdla/salesforce/SalesforceRestApi.js";

const router = express.Router();

router.get("/api/account/contacts", async (req, res) => {
    try {
        const instanceUrl = req.cookies.instance_url;
        const accessToken = req.cookies.access_token;
        const accountId = req.cookies.account_id;

        if (!instanceUrl || !accessToken) {
            return res.status(401).json({
                error: "You must be logged in."
            });
        }

        if (!accountId) {
            return res.status(400).json({
                error: "Account ID is missing."
            });
        }

        if (!/^[a-zA-Z0-9]{15}([a-zA-Z0-9]{3})?$/.test(accountId)) {
            return res.status(400).json({
                error: "Invalid account ID."
            });
        }

        const client = new SalesforceRestApi(
            instanceUrl,
            accessToken
        );

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

        const contactsResponse = await client.query(contactsQuery);

        if (!contactsResponse.records) {
            console.error(
                "Account contacts Salesforce response:",
                contactsResponse
            );

            return res.status(502).json({
                error: "Unable to retrieve account contacts."
            });
        }

        return res.json({
            contacts: contactsResponse.records
        });

    } catch (error) {
        console.error("ACCOUNT CONTACTS ROUTE ERROR:", error);

        return res.status(500).json({
            error: "Unable to retrieve account contacts."
        });
    }
});

export default router;
