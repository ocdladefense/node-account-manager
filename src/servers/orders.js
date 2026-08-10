import express from "express";
import path from "path";
import fs from "fs";
import SalesforceRestApi from '@ocdla/salesforce/SalesforceRestApi.js';




const router = express.Router();
const BASE_UPLOADS_DIR = path.resolve("uploads");



/**
 * contactIds - an array of contacts Ids selected from the AccountContacs component.
 * productId - a random product "active" and available on the Sandbox.
 * 
 * Goal - execute Salesforce REST api endpoint to create an single order, with one order product for each contactId in the array.
 */
router.post("/orders", async (req, res) => {

    const pricebookEntryId = "01u0a00000Hb09A"; // req.body.productId;;
    const contactIds = ["003hr000000NvVR"];//req.body.contactIds;

    let url = req.cookies.instance_url;
    let token = req.cookies.access_token;

    let client = new SalesforceRestApi(url, token);
    let orderRecord = { Name: "Foobar 2", AccountId: req.cookies.account_id, EffectiveDate: new Date().toISOString().split('T')[0], Status: 'Draft' };

    // Next step: insert an order product using the required data, OrderId.

    let resp = await client.create('Order', orderRecord);
    console.log(await resp.json()); // Should return the id of the newly-created order record.

    res.json(resp);
});

export default router;
