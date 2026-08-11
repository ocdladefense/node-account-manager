import express from "express";
import SalesforceRestApi from '@ocdla/salesforce/SalesforceRestApi.js';

const router = express.Router();

/**
 * contactIds - an array of contacts Ids selected from the AccountContacs component.
 * productId - a random product "active" and available on the Sandbox.
 * 
 * Goal - execute Salesforce REST api endpoint to create an single order, with one order product for each contactId in the array.
 */
router.post("/orders", async (req, res) => {

    try {

        const contactIds = req.body.contactIds;
        const productId = req.body.productId;

        console.log("CONTACT IDS:", contactIds);
        console.log("PRODUCT ID:", productId);


        // Make sure array isn't empty
        if (!Array.isArray(contactIds) || contactIds.length === 0) {
            return res.status(400).json({
                error: "At least one contact must be selected."
            });
        }


        // Make sure we have a product ID
        if (!productId) {
            return res.status(400).json({
                error: "A product must be selected."
            });
        }

        let url = req.cookies.instance_url;
        let token = req.cookies.access_token;

        let client = new SalesforceRestApi(url, token);

        const pricebookQuery = `
        SELECT
            Id,
            Product2Id,
            Pricebook2Id,
            UnitPrice
        FROM PricebookEntry
        WHERE Product2Id = '${productId}'
    `;

        console.log("PRICEBOOK QUERY:", pricebookQuery);

        const pricebookResp = await client.query(pricebookQuery);

        console.log("PRICEBOOK RESPONSE:", pricebookResp);

        const pricebookEntry = pricebookResp.records[0];


        // Make sure we found a Pricebook entry for the product
        if (!pricebookEntry) {
            return res.status(404).json({
                error: "No PricebookEntry found for product.",
                productId: productId
            });
        }

        console.log("PRICEBOOK ENTRY:", pricebookEntry);


        // Test Order Record
        let orderRecord = {
            Name: "Foobar 4",
            AccountId: req.cookies.account_id,
            EffectiveDate: new Date().toISOString().split('T')[0],
            Status: "Draft",
            Pricebook2Id: pricebookEntry.Pricebook2Id
        };

        const resp = await client.create("Order", orderRecord);

        const orderResult = await resp.json();

        if (!resp.ok) {
            console.error("ORDER CREATION FAILED:", orderResult);

            return res.status(resp.status).json({
                error: "Salesforce failed to create the order.",
                details: orderResult
            });
        }

        const orderItemResults = [];

        for (const contactId of contactIds) {

            const orderItemRecord = {
                OrderId: orderResult.id,
                PricebookEntryId: pricebookEntry.Id,
                Quantity: 1,
                UnitPrice: pricebookEntry.UnitPrice,
                Contact__c: contactId
            };

            const itemResp = await client.create("OrderItem", orderItemRecord);
            const itemResult = await itemResp.json();

            // Make sure each order item was successful
            if (!itemResp.ok) {
                console.error("ORDER ITEM CREATION FAILED:", itemResult);

                return res.status(itemResp.status).json({
                    error: "Salesforce failed to create an order item.",
                    order: orderResult,
                    orderItems: orderItemResults,
                    failedContactId: contactId,
                    details: itemResult
                });
            }

            console.log("ORDER ITEM CREATED:", itemResult);

            orderItemResults.push(itemResult);
        }


        res.json({
            order: orderResult,
            orderItems: orderItemResults
        });

    } catch (error) {
        console.error("ORDER ROUTE ERROR:", error);

        return res.status(500).json({
            error: "An unexpected error occurred while creating the order."
        });
    }

});


export default router;
